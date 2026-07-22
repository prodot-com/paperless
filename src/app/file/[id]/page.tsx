"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Archive,
  ArrowLeft,
  Check,
  Clipboard,
  Download,
  ExternalLink,
  File as FileIcon,
  FileText,
  FolderOpen,
  Info,
  Loader2,
  Lock,
  Maximize2,
  Minimize2,
  Moon,
  RotateCcw,
  ShieldCheck,
  Sun,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { toast } from "sonner";
import Logo from "@/lib/logo";
import { useSession } from "next-auth/react";

type FileResponse = {
  url: string;
  name?: string;
  fileType?: string;
};

type FileCategory =
  | "image"
  | "pdf"
  | "text"
  | "doc"
  | "xlsx"
  | "ppt"
  | "archive"
  | "unknown";

const categoryLabels: Record<FileCategory, string> = {
  image: "Image",
  pdf: "PDF document",
  text: "Text document",
  doc: "Word document",
  xlsx: "Spreadsheet",
  ppt: "Presentation",
  archive: "Archive",
  unknown: "File",
};

function getCategory(mime?: string): FileCategory {
  if (!mime) return "unknown";

  const type = mime.toLowerCase();
  if (type.startsWith("image/")) return "image";
  if (type === "application/pdf") return "pdf";
  if (type === "text/plain") return "text";
  if (type.includes("word") || type.includes("officedocument.wordprocessingml")) {
    return "doc";
  }
  if (type.includes("sheet") || type.includes("excel") || type.includes("spreadsheetml")) {
    return "xlsx";
  }
  if (type.includes("presentation") || type.includes("powerpoint")) return "ppt";
  if (type.includes("zip") || type.includes("archive") || type.includes("compressed")) {
    return "archive";
  }

  return "unknown";
}

export default function FileViewer() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const previewRef = useRef<HTMLDivElement>(null);

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const token = searchParams.get("token");
  const isPublic = searchParams.get("public") === "true";
  const source = searchParams.get("from");
  const showBack = Boolean(source || isPublic || token);

  const [data, setData] = useState<FileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkCanvas, setDarkCanvas] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const category = getCategory(data?.fileType);
  const fileName = data?.name || "Untitled file";

  const loadFile = useCallback(async () => {
    if (!id) {
      setError("This file link is incomplete.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const endpoint = isPublic
        ? `/api/public/file/${id}/view`
        : `/api/upload/${id}/view?token=${token || ""}`;
      const response = await fetch(endpoint);
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "We couldn't open this file.");
      }

      setData(json);
    } catch (err) {
      setData(null);
      setError(
        err instanceof Error ? err.message : "We couldn't open this file.",
      );
    } finally {
      setLoading(false);
    }
  }, [id, isPublic, token]);

  const handleDownload = useCallback(async () => {
    if (!id) return;

    try {
      const endpoint = isPublic
        ? `/api/public/file/${id}/download`
        : `/api/upload/${id}/download?token=${token || ""}`;
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Download failed");

      const { url } = await response.json();
      const link = document.createElement("a");
      link.href = url;
      link.download = data?.name || "file";
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Download started");
    } catch {
      toast.error("Unable to download this file");
    }
  }, [data?.name, id, isPublic, token]);

  const toggleFullscreen = useCallback(async () => {
    if (!previewRef.current) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await previewRef.current.requestFullscreen();
      }
    } catch {
      toast.error("Fullscreen is not available in this browser");
    }
  }, []);

  const copyPageLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("File link copied");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Unable to copy the file link");
    }
  }, []);

  useEffect(() => {
    void loadFile();
  }, [loadFile]);

  useEffect(() => {
    const updateFullscreenState = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", updateFullscreenState);
    return () => document.removeEventListener("fullscreenchange", updateFullscreenState);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (event.key.toLowerCase() === "d") {
        event.preventDefault();
        void handleDownload();
      }

      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        void toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDownload, toggleFullscreen]);

  if (loading) return <LoadingState />;

  if (error || !data) {
    return <ErrorState message={error || "We couldn't find this file."} onRetry={loadFile} />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FAFAFA] text-neutral-900 dark:bg-[#0A0A0A] dark:text-neutral-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[20%] -top-[25%] h-[42rem] w-[42rem] rounded-full bg-blue-400/15 blur-[130px] dark:bg-blue-600/10" />
        <div className="absolute -right-[18%] top-[25%] h-[38rem] w-[38rem] rounded-full bg-indigo-400/10 blur-[130px] dark:bg-indigo-600/10" />
      </div>

      <header className="sticky top-0 z-30 border-b border-neutral-200/70 bg-white/75 backdrop-blur-xl dark:border-neutral-800/70 dark:bg-[#0A0A0A]/75">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3 sm:px-6 md:px-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            {showBack && (
              <IconButton label="Go back" onClick={() => router.back()}>
                <ArrowLeft size={18} />
              </IconButton>
            )}
            <button
              type="button"
              onClick={() => router.push(session ? "/dashboard" : "/")}
              className="group flex shrink-0 items-center gap-2.5 rounded-xl px-1 py-1 text-neutral-800 transition-colors hover:text-black dark:text-neutral-200 dark:hover:text-white"
              aria-label="Go to Paperless home"
            >
              <Logo className="h-8 w-8 rotate-10 text-black transition-transform duration-300 group-hover:rotate-0 dark:text-white" />
              <span className="hidden font-serif text-xl font-bold italic tracking-tight sm:block">
                paperless
              </span>
            </button>
            <div className="hidden h-6 w-px bg-neutral-200 sm:block dark:bg-neutral-800" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                {fileName}
              </p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                Secure file viewer
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <IconButton label="Copy file link" onClick={copyPageLink}>
              {copied ? <Check size={17} className="text-emerald-500" /> : <Clipboard size={17} />}
            </IconButton>
            <ActionButton label="Download" onClick={handleDownload}>
              <Download size={16} />
            </ActionButton>
            <a
              href={data.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl bg-neutral-900 px-3 py-2.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-80 dark:bg-white dark:text-black sm:px-4"
            >
              <ExternalLink size={16} />
              <span className="hidden sm:inline">Open</span>
            </a>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-[1600px] px-4 py-6 sm:px-6 md:px-8 md:py-8">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-5 flex flex-col gap-4 rounded-2xl border border-neutral-200/80 bg-white/65 p-4 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-5 dark:border-neutral-800/80 dark:bg-neutral-900/60"
        >
          <div className="flex min-w-0 items-center gap-3.5">
            <FileTypeIcon category={category} />
            <div className="min-w-0">
              <h1 className="truncate font-serif text-xl tracking-tight text-neutral-800 sm:text-2xl dark:text-neutral-100">
                {fileName}
              </h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                <span>{categoryLabels[category]}</span>
                <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <span>{data.fileType?.split("/")[1]?.replaceAll("-", " ") || "secured"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              <ShieldCheck size={13} />
              Protected
            </span>
            <span className="flex items-center gap-1.5 rounded-lg bg-neutral-100 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
              <Lock size={12} />
              Encrypted
            </span>
          </div>
        </motion.section>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_270px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.45, ease: "easeOut" }}
            ref={previewRef}
            className="relative min-h-[65vh] overflow-hidden rounded-[1.75rem] border border-neutral-200/80 bg-white shadow-xl shadow-neutral-200/25 dark:border-neutral-800/80 dark:bg-neutral-900 dark:shadow-none xl:min-h-[calc(100vh-15.5rem)]"
          >
            <Preview
              category={category}
              data={data}
              darkCanvas={darkCanvas}
              isFullscreen={isFullscreen}
              onDownload={handleDownload}
              onToggleCanvas={() => setDarkCanvas((value) => !value)}
              onToggleFullscreen={toggleFullscreen}
            />
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12, duration: 0.4, ease: "easeOut" }}
            className="space-y-4"
          >
            <section className="rounded-2xl border border-neutral-200/80 bg-white/65 p-5 shadow-sm backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/60">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                <Info size={14} />
                File details
              </div>
              <dl className="mt-5 space-y-4">
                <Detail label="Format" value={categoryLabels[category]} />
                <Detail label="Type" value={data.fileType || "Unknown"} truncate />
                <Detail label="Access" value={isPublic ? "Public vault" : token ? "Shared link" : "Private vault"} />
              </dl>
            </section>

            <section className="rounded-2xl border border-neutral-200/80 bg-white/65 p-5 shadow-sm backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/60">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                Quick actions
              </p>
              <div className="mt-4 space-y-2">
                <SideAction icon={<Download size={16} />} label="Download file" onClick={handleDownload} shortcut="D" />
                <SideAction icon={<Maximize2 size={16} />} label="Fullscreen preview" onClick={toggleFullscreen} shortcut="F" />
                <SideAction icon={<Clipboard size={16} />} label="Copy page link" onClick={copyPageLink} />
              </div>
            </section>

            <section className="rounded-2xl border border-dashed border-neutral-200 bg-white/35 p-5 text-sm leading-6 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/35 dark:text-neutral-400">
              <div className="mb-2 flex items-center gap-2 font-medium text-neutral-700 dark:text-neutral-300">
                <ShieldCheck size={16} className="text-emerald-500" />
                Protected access
              </div>
              This preview uses a temporary secure link. Download the original file if you need to keep a copy.
            </section>
          </motion.aside>
        </div>
      </div>
    </main>
  );
}

function Preview({
  category,
  data,
  darkCanvas,
  isFullscreen,
  onDownload,
  onToggleCanvas,
  onToggleFullscreen,
}: {
  category: FileCategory;
  data: FileResponse;
  darkCanvas: boolean;
  isFullscreen: boolean;
  onDownload: () => void;
  onToggleCanvas: () => void;
  onToggleFullscreen: () => void;
}) {
  if (category === "image") {
    return (
      <div className={`relative h-full min-h-[65vh] transition-colors duration-500 ${darkCanvas ? "bg-[#101010]" : "bg-neutral-100"}`}>
        <TransformWrapper initialScale={1} minScale={0.8} maxScale={8} centerOnInit>
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <TransformComponent wrapperClass="!h-full !w-full" contentClass="!h-full !w-full flex items-center justify-center">
                <img
                  src={data.url}
                  alt={data.name || "Preview"}
                  draggable={false}
                  className="max-h-full max-w-full select-none object-contain shadow-2xl"
                />
              </TransformComponent>
              <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-white/10 bg-black/80 p-1.5 shadow-2xl backdrop-blur-xl">
                <ViewerControl label="Zoom in" onClick={() => zoomIn()} icon={<ZoomIn size={17} />} />
                <ViewerControl label="Zoom out" onClick={() => zoomOut()} icon={<ZoomOut size={17} />} />
                <ViewerControl label="Reset zoom" onClick={() => resetTransform()} icon={<RotateCcw size={17} />} />
                <span className="mx-1 h-4 w-px bg-white/15" />
                <ViewerControl label={darkCanvas ? "Use light canvas" : "Use dark canvas"} onClick={onToggleCanvas} icon={darkCanvas ? <Sun size={17} /> : <Moon size={17} />} />
                <ViewerControl label={isFullscreen ? "Exit fullscreen" : "Fullscreen"} onClick={onToggleFullscreen} icon={isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />} />
              </div>
            </>
          )}
        </TransformWrapper>
      </div>
    );
  }

  if (category === "pdf") {
    return <iframe src={data.url} className="h-full min-h-[65vh] w-full bg-white" title={data.name || "PDF preview"} />;
  }

  if (category === "text") {
    return <TextViewer key={data.url} url={data.url} onDownload={onDownload} />;
  }

  if (["doc", "ppt", "xlsx"].includes(category)) {
    return (
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(data.url)}`}
        className="h-full min-h-[65vh] w-full bg-white"
        title={data.name || "Office document preview"}
      />
    );
  }

  return (
    <UnsupportedPreview
      category={category}
      fileName={data.name || "this file"}
      url={data.url}
      onDownload={onDownload}
    />
  );
}

function TextViewer({
  url,
  onDownload,
}: {
  url: string;
  onDownload: () => void;
}) {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"loading" | "loaded" | "failed">("loading");

  useEffect(() => {
    let active = true;

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load text");
        return response.text();
      })
      .then((value) => {
        if (active) {
          setContent(value);
          setStatus("loaded");
        }
      })
      .catch(() => {
        if (active) setStatus("failed");
      });

    return () => {
      active = false;
    };
  }, [url]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-neutral-50 dark:bg-[#0D0D0D]">
        <Loader2 size={24} className="animate-spin text-neutral-400" />
      </div>
    );
  }

  if (status === "failed") {
    return <UnsupportedPreview category="text" fileName="this text file" url={url} onDownload={onDownload} />;
  }

  return (
    <div className="h-full min-h-[65vh] overflow-auto bg-neutral-50 p-5 dark:bg-[#0D0D0D] sm:p-8 md:p-10">
      <div className="mx-auto max-w-4xl rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-7">
        <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-7 text-neutral-700 dark:text-neutral-300">
          {content}
        </pre>
      </div>
    </div>
  );
}

function UnsupportedPreview({
  category,
  fileName,
  url,
  onDownload,
}: {
  category: FileCategory;
  fileName: string;
  url: string;
  onDownload: () => void;
}) {
  const isArchive = category === "archive";

  return (
    <div className="relative flex min-h-[65vh] items-center justify-center overflow-hidden bg-neutral-50 p-6 dark:bg-[#0D0D0D]">
      <div className="pointer-events-none absolute h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="relative max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-400 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          {isArchive ? <Archive size={27} /> : <FileIcon size={27} />}
        </div>
        <h2 className="mt-6 font-serif text-2xl tracking-tight text-neutral-800 dark:text-neutral-100">
          Preview unavailable
        </h2>
        <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
          {isArchive
            ? `${fileName} is an archive, so it needs to be downloaded before it can be opened.`
            : `Paperless can safely store ${fileName}, but this file format cannot be previewed in the browser.`}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button type="button" onClick={onDownload} className="flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-80 dark:bg-white dark:text-black">
            <Download size={16} />
            Download file
          </button>
          <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800">
            <ExternalLink size={16} />
            Open anyway
          </a>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAFAFA] dark:bg-[#0A0A0A]">
      <div className="absolute h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="relative flex flex-col items-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
          <Loader2 className="absolute animate-spin text-blue-500" size={42} strokeWidth={1.25} />
          <Logo className="h-7 w-7 text-neutral-800 dark:text-white" />
        </div>
        <p className="mt-7 font-serif text-xl italic text-neutral-700 dark:text-neutral-300">
          Opening your secure file
        </p>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
          Preparing preview
        </p>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAFAFA] px-5 dark:bg-[#0A0A0A]">
      <div className="absolute h-96 w-96 rounded-full bg-rose-500/10 blur-3xl" />
      <div className="relative max-w-md rounded-[2rem] border border-neutral-200 bg-white/75 p-8 text-center shadow-xl backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/75">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 dark:bg-rose-500/10">
          <FolderOpen size={24} />
        </div>
        <h1 className="mt-5 font-serif text-2xl text-neutral-800 dark:text-neutral-100">Unable to open this file</h1>
        <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{message}</p>
        <button type="button" onClick={onRetry} className="mt-6 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black">
          Try again
        </button>
      </div>
    </div>
  );
}

function FileTypeIcon({ category }: { category: FileCategory }) {
  const icon = category === "text" ? <FileText size={20} /> : category === "archive" ? <Archive size={20} /> : <FileIcon size={20} />;

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 text-blue-500 shadow-sm dark:border-neutral-800 dark:bg-neutral-800/70">
      {icon}
    </div>
  );
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className="rounded-xl cursor-pointer p-2.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white">
      {children}
    </button>
  );
}

function ActionButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs font-semibold text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 sm:px-4">
      {children}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function ViewerControl({ label, onClick, icon }: { label: string; onClick: () => void; icon: ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className="rounded-xl p-2.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
      {icon}
    </button>
  );
}

function Detail({ label, value, truncate = false }: { label: string; value: string; truncate?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-xs text-neutral-400 dark:text-neutral-500">{label}</dt>
      <dd className={`max-w-[150px] text-right text-xs font-semibold text-neutral-700 dark:text-neutral-300 ${truncate ? "truncate" : ""}`} title={value}>
        {value}
      </dd>
    </div>
  );
}

function SideAction({ icon, label, onClick, shortcut }: { icon: ReactNode; label: string; onClick: () => void; shortcut?: string }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-xs font-semibold text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white">
      <span className="text-neutral-400">{icon}</span>
      <span className="flex-1">{label}</span>
      {shortcut && <kbd className="rounded border border-neutral-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-500">{shortcut}</kbd>}
    </button>
  );
}
