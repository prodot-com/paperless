"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  File as FileIcon,
  ShieldCheck,
  Maximize2,
  AlertCircle,
  Download,
  ExternalLink,
  Lock,
  Info,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sun,
  Moon,
  FileText,
} from "lucide-react";
import Logo from "@/lib/logo";
import { useSession } from "next-auth/react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type FileResponse = {
  url: string;
  name?: string;
  fileType?: string;
};

export default function FileViewer() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const token = searchParams.get("token");
  const from = searchParams.get("from");
  const showBack = from === "upload";

  const [data, setData] = useState<FileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkBg, setDarkBg] = useState(true);

  const isMobile =
    typeof window !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    if (!id) return;
    const fetchFile = async () => {
      try {
        const res = await fetch(`/api/upload/${id}/view?token=${token || ""}`);
        const json = await res.json();
        if (!res.ok) throw new Error();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFile();
  }, [id, token]);

  // const getCategory = (mime?: string) => {
  //   if (!mime) return "unknown";
  //   const m = mime.toLowerCase();
  //   if (m.startsWith("image/")) return "image";
  //   if (m === "application/pdf") return "pdf";
  //   if (m === "text/plain") return "text";
  //   if (m.includes("word") || m.includes("officedocument.wordprocessingml")) return "doc";
  //   if (m.includes("presentation") || m.includes("powerpoint")) return "ppt";
  //   return "unknown";
  // };

  const getCategory = (mime?: string) => {
    if (!mime) return "unknown";

    const m = mime.toLowerCase();

    if (m.startsWith("image/")) return "image";

    if (m === "application/pdf") return "pdf";

    if (m === "text/plain") return "text";

    if (m.includes("word") || m.includes("officedocument.wordprocessingml"))
      return "doc";

    if (
      m.includes("sheet") ||
      m.includes("excel") ||
      m.includes("spreadsheetml")
    )
      return "xlsx";

    if (m.includes("presentation") || m.includes("powerpoint")) return "ppt";

    return "unknown";
  };

  const category = getCategory(data?.fileType);

  const handleDownload = async () => {
    try {
      const res = await fetch(
        `/api/upload/${id}/download?token=${token || ""}`,
      );
      const { url } = await res.json();
      const link = document.createElement("a");
      link.href = url;
      link.download = data?.name || "file";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="h-screen bg-[#FDFDFD] dark:bg-[#050505] flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
          <Loader2
            className="animate-spin text-blue-600 absolute"
            size={60}
            strokeWidth={1}
          />
          <Logo className="w-8 h-8 opacity-80" />
        </div>
        <p className="mt-8 font-serif italic text-zinc-500 animate-pulse tracking-wide">
          Accessing Secure Vault...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-[#050505]/70 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-all"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() =>
              session ? router.push("/dashboard") : router.push("/")
            }
          >
            <Logo className="w-8 h-8 group-hover:scale-110 transition-transform" />
            <span className="font-serif italic font-bold text-2xl tracking-tight">
              paperless
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-zinc-200 dark:border-zinc-800 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
          >
            <Download size={16} />
            <span className="hidden md:block">Download</span>
          </button>
          <a
            href={data?.url}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-zinc-900 text-white dark:bg-white dark:text-black rounded-full hover:opacity-90 transition-all"
          >
            <Maximize2 size={16} />
            <span className="hidden md:block">Full View</span>
          </a>
        </div>
      </header>

      <main className="flex-1 relative flex items-center justify-center overflow-hidden p-4 md:p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-6xl h-full min-h-[60vh] md:min-h-[80vh] bg-white dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex items-center justify-center"
          >
            {category === "image" && (
              <div
                className={`w-full h-full transition-colors duration-500 flex items-center justify-center ${darkBg ? "bg-[#0c0c0c]" : "bg-zinc-100"}`}
              >
                <TransformWrapper initialScale={1} minScale={1} maxScale={8}>
                  {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                      <TransformComponent
                        wrapperClass="!w-full !h-full"
                        contentClass="w-full h-full flex items-center justify-center"
                      >
                        <img
                          src={data?.url}
                          alt={data?.name}
                          className="max-w-full max-h-full object-contain shadow-2xl select-none"
                          draggable={false}
                        />
                      </TransformComponent>

                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1.5 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-20">
                        <ControlBtn
                          onClick={() => zoomIn()}
                          icon={<ZoomIn size={18} />}
                        />
                        <ControlBtn
                          onClick={() => zoomOut()}
                          icon={<ZoomOut size={18} />}
                        />
                        <ControlBtn
                          onClick={() => resetTransform()}
                          icon={<RotateCcw size={18} />}
                        />
                        <div className="w-[1px] h-4 bg-white/20 mx-1" />
                        <ControlBtn
                          onClick={() => setDarkBg(!darkBg)}
                          icon={darkBg ? <Sun size={18} /> : <Moon size={18} />}
                        />
                      </div>
                    </>
                  )}
                </TransformWrapper>
              </div>
            )}

            {/* {category === "pdf" && (
            isMobile ? (
              <div className="flex flex-col items-center gap-6 py-20 text-center">
                <p className="text-sm text-neutral-500">
                  PDF preview is not supported on your device
                </p>

                <a
                  href={data?.url}
                  target="_blank"
                  className="px-6 py-3 bg-black text-white rounded-xl text-sm"
                >
                  Open PDF
                </a>

                <button
                  onClick={handleDownload}
                  className="px-6 py-3 border rounded-xl text-sm"
                >
                  Download
                </button>
              </div>
            ) : (
              <iframe
                src={data?.url}
                className="w-full min-h-[85vh]"
              />
            )
          )} */}

            {category === "pdf" && (
              <iframe
                src={data?.url}
                className="w-full min-h-[85vh] bg-white"
                title={data?.name}
              />
            )}

            {category === "text" && <TextViewer url={data?.url || ""} />}

            {/* {["doc", "ppt", "unknown"].includes(category) && (
              <div className="flex flex-col items-center gap-6 py-20">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400">
                  <FileIcon size={32} />
                </div>
                <div className="text-center">
                   <p className="font-medium">Preview not supported</p>
                   <p className="text-sm text-zinc-500 mt-1">Download to view this {category} file.</p>
                </div>
                <button onClick={handleDownload} className="px-8 py-3 bg-zinc-900 text-white dark:bg-white dark:text-black rounded-xl font-semibold hover:scale-105 transition-transform">
                  Download File
                </button>
              </div>
            )} */}
            {["doc", "ppt", "xlsx"].includes(category) && (
              <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(data?.url || "")}`}
                className="w-full min-h-[85vh] bg-white"
                title={data?.name}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* --- FOOTER --- */}
      <footer className="px-8 py-6 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 text-zinc-400 text-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span>AES-256 Encrypted</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Lock size={14} />
              <span>TLS 1.3 Secure Connection</span>
            </div>
          </div>

          <div className="px-4 py-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center gap-3 text-xs font-mono text-zinc-500">
            <Info size={14} />
            <span className="truncate max-w-[200px]">{data?.name}</span>
            <span className="opacity-30">|</span>
            <span className="uppercase">
              {data?.fileType?.split("/")[1] || category}
            </span>
          </div>

          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">
            &copy; {new Date().getFullYear()} Paperless Labs
          </p>
        </div>
      </footer>
    </div>
  );
}

function ControlBtn({
  onClick,
  icon,
}: {
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
    >
      {icon}
    </button>
  );
}

function TextViewer({ url }: { url: string }) {
  const [content, setContent] = useState("");
  useEffect(() => {
    fetch(url)
      .then((res) => res.text())
      .then(setContent)
      .catch(() => setContent("Error loading text content."));
  }, [url]);

  return (
    <div className="w-full h-full bg-zinc-50 dark:bg-[#080808] p-6 md:p-12 overflow-auto">
      <pre className="text-sm leading-relaxed font-mono text-zinc-700 dark:text-zinc-400 whitespace-pre-wrap">
        {content}
      </pre>
    </div>
  );
}
