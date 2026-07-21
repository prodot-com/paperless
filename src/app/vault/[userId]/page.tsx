"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Download,
  Eye,
  File,
  Folder,
  FolderOpen,
  HardDrive,
  Layers3,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Logo from "@/lib/logo";

type FileItem = {
  id: string;
  name: string;
  path: string;
  size: number;
  createdAt: string;
  folderId: string | null;
  folder: {
    id: string;
    name: string;
  } | null;
};

type FolderItem = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    files: number;
  };
};

type VaultView = "all" | "root" | string;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

export default function PublicVaultPage() {
  const router = useRouter();
  const params = useParams();
  const publicUserId = params.userId as string;

  const [ownerName, setOwnerName] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [loadingVault, setLoadingVault] = useState(true);
  const [selectedView, setSelectedView] = useState<VaultView>("all");

  useEffect(() => {
    const fetchVaultData = async () => {
      if (!publicUserId) return;

      try {
        setLoadingVault(true);
        const res = await fetch(`/api/public/${publicUserId}`);
        if (!res.ok) throw new Error("Failed to load public vault");

        const data = await res.json();
        setFolders(data.folders || []);
        setFiles(data.files || []);
        setOwnerName(data.owner?.name || data.owner?.email || "User");
      } catch (err) {
        console.error(err);
        toast.error("Unable to load public vault");
      } finally {
        setLoadingVault(false);
      }
    };

    fetchVaultData();
  }, [publicUserId]);

  const sections = useMemo(() => {
    const rootFiles = files.filter((file) => !file.folderId);
    const folderSections = folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      files: files.filter((file) => file.folderId === folder.id),
      isRoot: false,
    }));

    if (selectedView === "root") {
      return [
        { id: "root", name: "Main vault", files: rootFiles, isRoot: true },
      ];
    }

    if (selectedView !== "all") {
      return folderSections.filter((section) => section.id === selectedView);
    }

    return [
      ...(rootFiles.length
        ? [{ id: "root", name: "Main vault", files: rootFiles, isRoot: true }]
        : []),
      ...folderSections.filter((section) => section.files.length > 0),
    ];
  }, [files, folders, selectedView]);

  const visibleFileCount = sections.reduce(
    (total, section) => total + section.files.length,
    0,
  );

  const activeLabel =
    selectedView === "all"
      ? "All assets"
      : selectedView === "root"
        ? "Main vault"
        : folders.find((folder) => folder.id === selectedView)?.name || "Folder";

  function formatSize(bytes: number) {
    const sizes = ["B", "KB", "MB", "GB"];
    let index = 0;
    let value = bytes;

    while (value >= 1024 && index < sizes.length - 1) {
      value /= 1024;
      index++;
    }

    return `${value.toFixed(1)} ${sizes[index]}`;
  }

  async function handleAction(id: string, action: "view" | "download") {
    try {
      const res = await fetch(`/api/public/file/${id}/${action}`);
      if (!res.ok) throw new Error("Action failed");

      const { url } = await res.json();
      if (action === "view") {
        router.push(`/file/${id}?public=true`);
        return;
      }

      const link = document.createElement("a");
      link.href = url;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error("Unable to perform action");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FAFAFA] font-sans text-neutral-900 transition-colors dark:bg-[#0A0A0A] dark:text-neutral-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[18%] -top-[18%] h-[48rem] w-[48rem] rounded-full bg-blue-400/15 blur-[140px] dark:bg-blue-600/10" />
        <div className="absolute -right-[22%] top-[35%] h-[36rem] w-[36rem] rounded-full bg-indigo-400/10 blur-[140px] dark:bg-indigo-600/10" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-8 md:px-10 md:py-10 lg:px-16 lg:py-14">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex items-center justify-between gap-4"
        >
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-xl px-1 py-1 text-neutral-700 transition-colors hover:text-black dark:text-neutral-300 dark:hover:text-white"
          >
            <Logo className="h-8 w-8 rotate-10 text-black transition-transform duration-300 group-hover:rotate-0 dark:text-white" />
            <span className="font-serif text-lg font-bold italic tracking-tight">
              paperless
            </span>
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500 shadow-sm backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Public vault
          </div>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.5, ease: "easeOut" }}
          className="relative mt-10 overflow-hidden rounded-[2rem] border border-neutral-200/80 bg-white/70 p-6 shadow-xl shadow-neutral-200/30 backdrop-blur-xl sm:p-8 md:mt-14 md:p-10 dark:border-neutral-800/80 dark:bg-neutral-900/65 dark:shadow-none"
        >
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                <HardDrive size={14} />
                Shared collection
              </div>
              <h1 className="font-serif text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
                {ownerName ? (
                  <>
                    <span className="italic">{ownerName}&apos;s</span> vault
                  </>
                ) : (
                  "Shared file vault"
                )}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                Browse and download the files that have been made available to
                you.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white/70 p-3 pr-4 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-[#111]/80">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-900 font-serif text-lg text-white shadow-sm dark:bg-white dark:text-black">
                {ownerName ? ownerName.charAt(0).toUpperCase() : <HardDrive size={18} />}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Collection
                </p>
                <p className="mt-0.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  {loadingVault ? "Loading assets" : `${files.length} file${files.length === 1 ? "" : "s"}`}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-6 rounded-[1.75rem] border border-neutral-200/80 bg-white/60 p-4 shadow-sm backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/55 sm:p-5"
        >
          <motion.div variants={itemVariants} className="flex items-center justify-between gap-4 px-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                Browse vault
              </p>
              <p className="mt-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Choose a location to explore
              </p>
            </div>
            <span className="hidden rounded-lg bg-neutral-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 sm:block dark:bg-neutral-800 dark:text-neutral-500">
              {folders.length} folder{folders.length === 1 ? "" : "s"}
            </span>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-4 flex gap-2 overflow-x-auto px-1 pb-1 pt-1"
          >
            <VaultFilter
              active={selectedView === "all"}
              icon={<Layers3 size={15} />}
              label="All assets"
              onClick={() => setSelectedView("all")}
            />
            <VaultFilter
              active={selectedView === "root"}
              icon={<HardDrive size={15} />}
              label="Main vault"
              onClick={() => setSelectedView("root")}
            />
            {loadingVault ? (
              <div className="flex min-w-20 items-center justify-center">
                <Loader2 size={17} className="animate-spin text-neutral-400" />
              </div>
            ) : (
              folders.map((folder) => (
                <VaultFilter
                  key={folder.id}
                  active={selectedView === folder.id}
                  icon={
                    selectedView === folder.id ? (
                      <FolderOpen size={15} />
                    ) : (
                      <Folder size={15} />
                    )
                  }
                  label={folder.name}
                  onClick={() => setSelectedView(folder.id)}
                />
              ))
            )}
          </motion.div>
        </motion.section>

        <section className="mt-10 md:mt-14">
          <div className="mb-5 flex items-center gap-4 px-1">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                {activeLabel}
              </p>
              <h2 className="mt-1 font-serif text-2xl tracking-tight text-neutral-800 dark:text-neutral-100">
                {loadingVault ? "Getting things ready" : `${visibleFileCount} shared item${visibleFileCount === 1 ? "" : "s"}`}
              </h2>
            </div>
            <div className="mt-5 h-px flex-1 bg-neutral-200/70 dark:bg-neutral-800" />
          </div>

          {loadingVault ? (
            <div className="space-y-3">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="h-20 animate-pulse rounded-2xl border border-neutral-200/70 bg-white/60 dark:border-neutral-800 dark:bg-neutral-900/55"
                />
              ))}
            </div>
          ) : sections.length === 0 ? (
            <EmptyState
              title={selectedView === "all" ? "This vault is empty" : "Nothing here yet"}
              message={
                selectedView === "all"
                  ? "No files have been shared in this collection yet."
                  : "This location does not contain any shared files."
              }
            />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-9"
            >
              {sections.map((section) => (
                <motion.div key={section.id} variants={itemVariants}>
                  {selectedView === "all" && (
                    <div className="mb-3 flex items-center gap-2.5 px-1">
                      {section.isRoot ? (
                        <HardDrive size={15} className="text-neutral-400" />
                      ) : (
                        <FolderOpen size={15} className="text-blue-500" />
                      )}
                      <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-300">
                        {section.name}
                      </h3>
                      <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500">
                        {section.files.length}
                      </span>
                    </div>
                  )}

                  {section.files.length ? (
                    <div className="space-y-3">
                      {section.files.map((file) => (
                        <FileRow
                          key={file.id}
                          file={file}
                          onAction={handleAction}
                          formatSize={formatSize}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      compact
                      title="This folder is empty"
                      message="Try another location in the vault."
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </main>
  );
}

function VaultFilter({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-all duration-300 ${
        active
          ? "border-neutral-900 bg-neutral-900 text-white shadow-md dark:border-white dark:bg-white dark:text-black"
          : "border-neutral-200 bg-white/80 text-neutral-500 hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:bg-[#111] dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-white"
      }`}
    >
      {icon}
      <span className="max-w-36 truncate">{label}</span>
    </button>
  );
}

function FileRow({
  file,
  onAction,
  formatSize,
}: {
  file: FileItem;
  onAction: (id: string, action: "view" | "download") => void;
  formatSize: (bytes: number) => string;
}) {
  const extension = file.name.split(".").pop()?.toUpperCase() || "FILE";
  const createdAt = new Date(file.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/70 p-3 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md dark:border-neutral-800/80 dark:bg-neutral-900/65 dark:hover:border-neutral-700"
    >
      <div className="absolute inset-y-0 left-0 w-1 origin-bottom scale-y-0 bg-blue-500 transition-transform duration-300 group-hover:scale-y-100" />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 text-neutral-400 transition-colors group-hover:text-blue-500 dark:border-neutral-800 dark:bg-neutral-800/70">
            <File size={18} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              {file.name}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-bold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
              <span>{extension}</span>
              <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              <span>{formatSize(file.size)}</span>
              <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              <span>{createdAt}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-neutral-100 pt-3 sm:border-t-0 sm:pt-0 dark:border-neutral-800">
          <FileActionButton
            label="View"
            icon={<Eye size={15} />}
            onClick={() => onAction(file.id, "view")}
          />
          <FileActionButton
            label="Download"
            icon={<Download size={15} />}
            onClick={() => onAction(file.id, "download")}
            primary
          />
        </div>
      </div>
    </motion.article>
  );
}

function FileActionButton({
  icon,
  label,
  onClick,
  primary = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 ${
        primary
          ? "bg-neutral-900 text-white shadow-sm hover:opacity-80 dark:bg-white dark:text-black"
          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function EmptyState({
  title,
  message,
  compact = false,
}: {
  title: string;
  message: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-white/45 text-center backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/35 ${
        compact ? "px-6 py-9" : "px-6 py-14"
      }`}
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500">
        <FolderOpen size={19} />
      </div>
      <h3 className="font-serif text-lg text-neutral-700 dark:text-neutral-300">{title}</h3>
      <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500">{message}</p>
    </div>
  );
}
