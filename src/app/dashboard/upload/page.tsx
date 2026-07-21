"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Download,
  Eye,
  File,
  Folder,
  FolderOpen,
  FolderPlus,
  Globe,
  HardDrive,
  Loader2,
  Lock,
  Share2,
  Trash2,
  Type,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import CustomModal from "@/components/CustomModal";
import { allowedTypes, MAX_SIZE } from "@/lib/fileTypes";

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

type ModalState = {
  isOpen: boolean;
  type: "error" | "confirm" | "rename" | "share" | "folder";
  title: string;
  message: string;
  file?: FileItem;
};

const emptyModal: ModalState = {
  isOpen: false,
  type: "confirm",
  title: "",
  message: "",
};

function formatSize(bytes: number) {
  const sizes = ["B", "KB", "MB", "GB"];
  let index = 0;
  let value = bytes;

  while (value >= 1024 && index < sizes.length - 1) {
    value /= 1024;
    index++;
  }

  return `${value.toFixed(index === 0 ? 0 : 1)} ${sizes[index]}`;
}

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const publicUserId = searchParams.get("user");
  const isPublicView = Boolean(publicUserId);

  const [ownerName, setOwnerName] = useState("");
  const [isVaultPublic, setIsVaultPublic] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [loadingFolders, setLoadingFolders] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>(emptyModal);

  const fetchFolders = useCallback(async () => {
    if (isPublicView) return;

    try {
      setLoadingFolders(true);
      const response = await fetch("/api/folders");
      if (!response.ok) throw new Error("Unable to load folders");
      setFolders((await response.json()) as FolderItem[]);
    } catch {
      toast.error("Unable to load folders");
    } finally {
      setLoadingFolders(false);
    }
  }, [isPublicView]);

  useEffect(() => {
    if (status === "unauthenticated" && !isPublicView) {
      router.push("/login");
    }
  }, [isPublicView, router, status]);

  useEffect(() => {
    let active = true;

    const loadVault = async () => {
      if (isPublicView) {
        try {
          setLoadingFolders(true);
          const response = await fetch(`/api/public/${publicUserId}`);
          if (!response.ok) throw new Error("Unable to load public vault");
          const data = await response.json();
          if (!active) return;

          setFolders(data.folders || []);
          setFiles(data.files || []);
          setOwnerName(data.owner?.name || data.owner?.email || "User");
        } catch {
          toast.error("Unable to load public vault");
        } finally {
          if (active) setLoadingFolders(false);
        }
        return;
      }

      if (status !== "authenticated") return;

      await fetchFolders();
      try {
        const response = await fetch("/api/upload");
        if (!response.ok) throw new Error("Unable to load vault");
        const data = await response.json();
        if (!active) return;

        setFiles(data.files || []);
        setIsVaultPublic(Boolean(data.isVaultPublic));
      } catch {
        toast.error("Unable to load vault files");
      }
    };

    if (isPublicView || status === "authenticated") void loadVault();
    return () => {
      active = false;
    };
  }, [fetchFolders, isPublicView, publicUserId, status]);

  const groupedFiles = useMemo(() => {
    const rootFiles = files.filter((file) => !file.folderId);
    const folderGroups = folders
      .map((folder) => ({
        ...folder,
        files: files.filter((file) => file.folderId === folder.id),
      }))
      .filter((group) => group.files.length > 0);

    return { rootFiles, folderGroups };
  }, [files, folders]);

  const selectedFolder = folders.find(
    (folder) => folder.id === selectedFolderId,
  );
  const destinationName = selectedFolder?.name || "Main vault";

  async function handleCreateFolder(name?: string) {
    if (!name?.trim() || isPublicView) return;

    try {
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!response.ok) throw new Error("Create failed");

      const folder = (await response.json()) as FolderItem;
      setFolders((previous) => [...previous, folder]);
      setSelectedFolderId(folder.id);
      toast.success(`Folder “${folder.name}” created`);
    } catch {
      toast.error("Failed to create folder");
    }
  }

  async function handleTogglePublic() {
    const nextValue = !isVaultPublic;
    setIsVaultPublic(nextValue);

    try {
      const response = await fetch("/api/public/toggle", { method: "PATCH" });
      if (!response.ok) throw new Error("Update failed");
      const data = await response.json();
      setIsVaultPublic(Boolean(data.isVaultPublic));
      toast.success(
        data.isVaultPublic ? "Vault is now public" : "Vault is now private",
      );
    } catch {
      setIsVaultPublic(!nextValue);
      toast.error("Failed to update vault visibility");
    }
  }

  async function handleShareVault() {
    const userId = session?.user?.id;
    if (!userId) {
      toast.error("Unable to generate a vault link");
      return;
    }

    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/vault/${userId}`,
      );
      toast.success("Public vault link copied");
    } catch {
      toast.error("Unable to copy the vault link");
    }
  }

  function validateFile(file: File): string | null {
    if (!allowedTypes.includes(file.type)) {
      return `Unsupported file type (${file.type || "unknown"})`;
    }
    if (file.size > MAX_SIZE) {
      return `File too large (${formatSize(file.size)}). Maximum: ${formatSize(MAX_SIZE)}.`;
    }
    return null;
  }

  async function handleFiles(selectedFiles: File[]) {
    if (isUploading || !selectedFiles.length || isPublicView) return;

    const validFiles = selectedFiles.filter((file) => {
      const error = validateFile(file);
      if (error) toast.error(error, { description: file.name });
      return !error;
    });

    if (!validFiles.length) return;
    setIsUploading(true);

    try {
      for (const file of validFiles) {
        setUploadingFiles((previous) => [...previous, file.name]);
        const formData = new FormData();
        formData.append("file", file);
        if (selectedFolderId) formData.append("folderId", selectedFolderId);

        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 15000);

        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
            signal: controller.signal,
          });
          const data = await response.json();

          if (!response.ok) {
            toast.error(`${file.name}: ${data.error || "Upload failed"}`);
          } else {
            toast.success(`${file.name} added to ${destinationName}`);
          }
        } catch (error) {
          toast.error(
            error instanceof DOMException && error.name === "AbortError"
              ? `${file.name}: Upload timed out`
              : `${file.name}: Upload failed`,
          );
        } finally {
          window.clearTimeout(timeout);
          setUploadingFiles((previous) =>
            previous.filter((name) => name !== file.name),
          );
        }
      }

      const response = await fetch("/api/upload");
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files || []);
        setIsVaultPublic(Boolean(data.isVaultPublic));
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleAction(id: string, action: "view" | "download") {
    try {
      const endpoint = isPublicView
        ? `/api/public/file/${id}/${action}`
        : `/api/upload/${id}/${action}`;
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Action failed");
      const { url } = await response.json();

      if (action === "view") {
        router.push(
          `/file/${id}?${isPublicView ? "public=true" : "from=upload"}`,
        );
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

  function handleRename(file: FileItem) {
    setModal({
      isOpen: true,
      type: "rename",
      title: "Rename file",
      message: "Choose a clear name for this file.",
      file,
    });
  }

  function handleShare(id: string) {
    const file = files.find((item) => item.id === id);
    setModal({
      isOpen: true,
      type: "share",
      title: "Share file",
      message: "Select how long the secure link should stay active.",
      file,
    });
  }

  function handleDelete(file: FileItem) {
    setModal({
      isOpen: true,
      type: "confirm",
      title: "Delete file?",
      message: `Are you sure you want to permanently delete “${file.name}”?`,
      file,
    });
  }

  async function handleModalConfirm(value?: string) {
    const file = modal.file;
    if (!file) return;

    try {
      if (modal.type === "share") {
        const response = await fetch("/api/upload/share", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "file",
            resourceId: file.id,
            expiresInHours: value === "never" ? null : Number(value),
          }),
        });
        if (!response.ok) throw new Error("Share failed");
        const { url } = await response.json();
        await navigator.clipboard.writeText(url);
        toast.success("Secure link copied");
      }

      if (modal.type === "rename") {
        const name = value?.trim();
        if (!name || name === file.name) {
          toast.error("Enter a different file name");
          return;
        }

        const response = await fetch(`/api/upload/${file.id}/rename`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
        if (!response.ok) throw new Error("Rename failed");

        setFiles((previous) =>
          previous.map((item) =>
            item.id === file.id ? { ...item, name } : item,
          ),
        );
        toast.success("File renamed");
      }

      if (modal.type === "confirm") {
        const response = await fetch(`/api/upload/${file.id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Delete failed");

        setFiles((previous) => previous.filter((item) => item.id !== file.id));
        toast.success("File deleted");
      }
    } catch {
      toast.error("Action failed. Please try again.");
    } finally {
      setModal((previous) => ({ ...previous, isOpen: false }));
    }
  }

  if (status === "loading" && !isPublicView) {
    return <VaultLoading />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FAFAFA] text-neutral-900 dark:bg-[#0A0A0A] dark:text-neutral-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[20%] -top-[25%] h-[44rem] w-[44rem] rounded-full bg-blue-400/15 blur-[140px] dark:bg-blue-600/10" />
        <div className="absolute -right-[20%] top-[35%] h-[36rem] w-[36rem] rounded-full bg-indigo-400/10 blur-[130px] dark:bg-indigo-600/10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-7 sm:px-8 md:px-10 md:py-10 lg:px-16 lg:py-14">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: "easeOut" }}
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              <HardDrive size={14} />
              {isPublicView ? "Shared collection" : "Secure file vault"}
            </div>
            <h1 className="mt-3 font-serif text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
              {isPublicView ? (
                <>
                  <span className="italic">{ownerName}&apos;s</span> vault
                </>
              ) : (
                <>
                  Your <span className="italic">vault</span>
                </>
              )}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
              {isPublicView
                ? "Browse the files that have been shared with you."
                : "Store, organize, and share the files that matter to your work."}
            </p>
          </div>

          {!isPublicView && (
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-neutral-200/80 bg-white/70 p-2 shadow-sm backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/65">
              <button
                type="button"
                onClick={handleTogglePublic}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${isVaultPublic ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"}`}
              >
                {isVaultPublic ? <Globe size={15} /> : <Lock size={15} />}
                <span>{isVaultPublic ? "Public vault" : "Private vault"}</span>
                <span
                  className={`relative cursor-pointer inline-flex h-4 w-8 rounded-full transition-all duration-300 ${
                    isVaultPublic
                      ? "bg-emerald-500"
                      : "bg-neutral-300 dark:bg-neutral-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-all duration-300 ${
                      isVaultPublic ? "translate-x-4" : "translate-x-1"
                    }`}
                  />
                </span>
              </button>
              <button
                type="button"
                onClick={handleShareVault}
                disabled={!isVaultPublic}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <Share2 size={15} />
                Copy link
              </button>
            </div>
          )}
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.42, ease: "easeOut" }}
          className="mt-8 overflow-hidden rounded-[1.75rem] border border-neutral-200/80 bg-white/65 p-4 shadow-lg shadow-neutral-200/20 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/60 dark:shadow-none sm:p-5"
        >
          <div className="flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                {isPublicView ? "Folder collection" : "Upload destination"}
              </p>
              <h2 className="mt-1 flex items-center gap-2 font-serif text-2xl tracking-tight text-neutral-800 dark:text-neutral-100">
                <FolderOpen size={19} className="text-blue-500" />
                {isPublicView ? "Browse folders" : destinationName}
              </h2>
            </div>
            {!isPublicView && (
              <button
                type="button"
                onClick={() => setFolderModalOpen(true)}
                className="flex cursor-pointer items-center justify-center gap-2 self-start rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 sm:self-auto"
              >
                <FolderPlus size={15} className="text-blue-500" />
                New folder
              </button>
            )}
          </div>

          <div className="mt-5 flex gap-3 overflow-x-auto pb-1 pt-1 [scrollbar-width:thin]">
            <DestinationCard
              active={selectedFolderId === null}
              title="Main vault"
              subtitle={`${groupedFiles.rootFiles.length} file${groupedFiles.rootFiles.length === 1 ? "" : "s"}`}
              icon={<HardDrive size={18} />}
              onClick={() => setSelectedFolderId(null)}
            />
            {loadingFolders ? (
              <div className="flex min-w-36 items-center justify-center rounded-2xl border border-neutral-200 bg-white/60 dark:border-neutral-800 dark:bg-neutral-900/50">
                <Loader2 size={18} className="animate-spin text-neutral-400" />
              </div>
            ) : (
              folders.map((folder) => {
                const count = files.filter(
                  (file) => file.folderId === folder.id,
                ).length;
                return (
                  <DestinationCard
                    key={folder.id}
                    active={selectedFolderId === folder.id}
                    title={folder.name}
                    subtitle={`${count} file${count === 1 ? "" : "s"}`}
                    icon={
                      selectedFolderId === folder.id ? (
                        <FolderOpen size={18} />
                      ) : (
                        <Folder size={18} />
                      )
                    }
                    onClick={() => setSelectedFolderId(folder.id)}
                  />
                );
              })
            )}
            {!isPublicView && (
              <button
                type="button"
                onClick={() => setFolderModalOpen(true)}
                className="flex cursor-pointer min-w-36 flex-col items-start justify-between rounded-2xl border border-dashed border-neutral-300 bg-white/40 p-4 text-left text-neutral-400 transition-colors hover:border-blue-500/50 hover:bg-blue-50/50 hover:text-blue-500 dark:border-neutral-700 dark:bg-neutral-900/30 dark:hover:bg-blue-500/5"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
                  <FolderPlus size={17} />
                </span>
                <span className="mt-4 text-xs font-semibold">
                  Create folder
                </span>
              </button>
            )}
          </div>
        </motion.section>

        {!isPublicView && (
          <section className="mt-6">
            <AnimatePresence mode="wait">
              {isUploading ? (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.985 }}
                  className="relative overflow-hidden rounded-[2rem] border border-neutral-200/80 bg-white/70 p-10 shadow-xl shadow-neutral-200/20 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/65 dark:shadow-none sm:p-14"
                >
                  <div className="absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
                  <div className="relative mx-auto flex max-w-md flex-col items-center text-center">
                    <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-blue-500 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                      <Loader2 size={27} className="animate-spin" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                      Secure transfer
                    </p>
                    <h2 className="mt-2 font-serif text-2xl tracking-tight text-neutral-800 dark:text-white">
                      Adding files to {destinationName}
                    </h2>
                    <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                      {uploadingFiles[0] || "Preparing upload"}
                      {uploadingFiles.length > 1
                        ? ` and ${uploadingFiles.length - 1} more`
                        : ""}
                    </p>
                    <div className="mt-7 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2.6, ease: "easeInOut" }}
                        className="h-full bg-linear-to-r from-blue-500 to-indigo-500"
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                    if (event.dataTransfer.files.length)
                      void handleFiles(Array.from(event.dataTransfer.files));
                  }}
                  className={`group relative flex min-h-72 flex-col items-center justify-center overflow-hidden rounded-[2rem] border-2 border-dashed p-8 text-center transition-all duration-300 sm:p-12 ${isDragging ? "scale-[0.99] border-blue-500 bg-blue-50/50 shadow-xl shadow-blue-500/10 dark:bg-blue-500/10" : "border-neutral-200 bg-white/65 shadow-lg shadow-neutral-200/15 hover:border-neutral-300 hover:bg-white dark:border-neutral-800 dark:bg-neutral-900/60 dark:shadow-none dark:hover:border-neutral-700"}`}
                >
                  <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
                  <motion.div
                    animate={
                      isDragging
                        ? { scale: 1.12, rotate: 4 }
                        : { scale: 1, rotate: 0 }
                    }
                    className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border shadow-sm transition-colors ${isDragging ? "border-blue-500 bg-blue-500 text-white" : "border-neutral-200 bg-white text-neutral-400 group-hover:text-blue-500 dark:border-neutral-800 dark:bg-neutral-900"}`}
                  >
                    <Upload size={27} />
                  </motion.div>
                  <div className="relative mt-5">
                    <p className="font-serif text-2xl tracking-tight text-neutral-800 dark:text-white">
                      {isDragging
                        ? "Drop to upload"
                        : "Bring files into your vault"}
                    </p>
                    <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                      Drag files here, or choose them from your device.
                    </p>
                  </div>
                  <div className="relative mt-5 flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
                    <FolderOpen size={13} />
                    Uploading to {destinationName}
                  </div>
                  <label className="relative mt-6 flex cursor-pointer items-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-85 active:scale-[0.98] dark:bg-white dark:text-black">
                    <Upload size={15} />
                    Choose files
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      accept=".pdf,.doc,.docx,.pptx,.txt,.jpg,.jpeg,.png,.webp,.gif,.zip"
                      onChange={(event) => {
                        if (!event.target.files) return;
                        void handleFiles(Array.from(event.target.files));
                        event.target.value = "";
                      }}
                    />
                  </label>
                  <p className="relative mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                    PDF, Office, images, text & archives · up to{" "}
                    {formatSize(MAX_SIZE)}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}

        <section className="mt-10 md:mt-14">
          <div className="mb-5 flex items-end gap-4 px-1">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                {isPublicView ? "Shared assets" : "Vault contents"}
              </p>
              <h2 className="mt-1 font-serif text-2xl tracking-tight text-neutral-800 dark:text-neutral-100">
                {files.length} file{files.length === 1 ? "" : "s"} in your
                collection
              </h2>
            </div>
            <div className="mb-2 h-px flex-1 bg-neutral-200/70 dark:bg-neutral-800" />
          </div>

          {files.length === 0 && !loadingFolders ? (
            <EmptyVault
              isPublicView={isPublicView}
              destinationName={destinationName}
            />
          ) : (
            <div className="space-y-9">
              <style
                dangerouslySetInnerHTML={{
                  __html: `
      .premium-scrollbar{
        scrollbar-width:thin;
      }

      .premium-scrollbar::-webkit-scrollbar{
        width:6px;
      }

      .premium-scrollbar::-webkit-scrollbar-track{
        background:transparent;
      }

      .premium-scrollbar::-webkit-scrollbar-thumb{
        border-radius:999px;
        border:2px solid transparent;
        background-clip:padding-box;
        transition:all .25s ease;
      }

      /* Light */
      .premium-scrollbar::-webkit-scrollbar-thumb{
        background-color:rgba(0,0,0,.14);
      }

      .premium-scrollbar:hover::-webkit-scrollbar-thumb{
        background-color:rgba(0,0,0,.28);
      }

      /* Dark */
      .dark .premium-scrollbar::-webkit-scrollbar-thumb{
        background-color:rgba(255,255,255,.12);
      }

      .dark .premium-scrollbar:hover::-webkit-scrollbar-thumb{
        background-color:rgba(255,255,255,.25);
      }

      .premium-scrollbar::-webkit-scrollbar-thumb:active{
        background-color:rgba(59,130,246,.65);
      }
    `,
                }}
              />
              {groupedFiles.rootFiles.length > 0 && (
                <FileGroup
                  title="Main vault"
                  icon={<HardDrive size={15} className="text-neutral-400" />}
                  count={groupedFiles.rootFiles.length}
                >
                  <div className="p-2 premium-scrollbar space-y-3 max-h-70 overflow-y-auto">
                    {groupedFiles.rootFiles.map((file) => (
                      <FileRow
                        key={file.id}
                        file={file}
                        isPublicView={isPublicView}
                        onView={() => void handleAction(file.id, "view")}
                        onDownload={() =>
                          void handleAction(file.id, "download")
                        }
                        onRename={() => handleRename(file)}
                        onShare={() => handleShare(file.id)}
                        onDelete={() => handleDelete(file)}
                      />
                    ))}
                  </div>
                </FileGroup>
              )}
              {groupedFiles.folderGroups.map((group) => (
                <FileGroup
                  key={group.id}
                  title={group.name}
                  icon={<FolderOpen size={15} className="text-blue-500" />}
                  count={group.files.length}
                >
                  <div className="p-2 premium-scrollbar space-y-3 max-h-70 overflow-y-auto">
                    {group.files.map((file) => (
                      <FileRow
                        key={file.id}
                        file={file}
                        isPublicView={isPublicView}
                        onView={() => void handleAction(file.id, "view")}
                        onDownload={() =>
                          void handleAction(file.id, "download")
                        }
                        onRename={() => handleRename(file)}
                        onShare={() => handleShare(file.id)}
                        onDelete={() => handleDelete(file)}
                      />
                    ))}
                  </div>
                </FileGroup>
              ))}
            </div>
          )}
        </section>
      </div>

      <CustomModal
        isOpen={folderModalOpen}
        onClose={() => setFolderModalOpen(false)}
        type="folder"
        title="Create folder"
        message="Give this secure folder a clear name."
        onConfirm={handleCreateFolder}
      />
      <CustomModal
        isOpen={modal.isOpen}
        onClose={() => setModal((previous) => ({ ...previous, isOpen: false }))}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        defaultValue={modal.file?.name}
        onConfirm={handleModalConfirm}
      />
    </main>
  );
}

function DestinationCard({
  active,
  title,
  subtitle,
  icon,
  onClick,
}: {
  active: boolean;
  title: string;
  subtitle: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative cursor-pointer flex min-w-36 flex-col items-start overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200 ${active ? "border-neutral-900 bg-neutral-900 text-white shadow-md dark:border-white dark:bg-white dark:text-black" : "border-neutral-200 bg-white/75 text-neutral-600 shadow-sm hover:-translate-y-0.5 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/65 dark:text-neutral-300 dark:hover:border-neutral-700"}`}
    >
      {active && (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-white/15 dark:bg-black/10">
          <Check size={13} />
        </span>
      )}
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? "bg-white/15 dark:bg-black/10" : "bg-neutral-100 text-blue-500 dark:bg-neutral-800"}`}
      >
        {icon}
      </span>
      <span className="mt-4 max-w-full truncate text-xs font-semibold">
        {title}
      </span>
      <span
        className={`mt-1 text-[10px] font-bold uppercase tracking-wider ${active ? "text-white/65 dark:text-black/55" : "text-neutral-400 dark:text-neutral-500"}`}
      >
        {subtitle}
      </span>
    </button>
  );
}

function FileGroup({
  title,
  icon,
  count,
  children,
}: {
  title: string;
  icon: ReactNode;
  count: number;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2.5 px-1">
        {icon}
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-300">
          {title}
        </h3>
        <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500">
          {count}
        </span>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function FileRow({
  file,
  isPublicView,
  onView,
  onDownload,
  onRename,
  onShare,
  onDelete,
}: {
  file: FileItem;
  isPublicView: boolean;
  onView: () => void;
  onDownload: () => void;
  onRename: () => void;
  onShare: () => void;
  onDelete: () => void;
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/70 p-3 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md dark:border-neutral-800/80 dark:bg-neutral-900/65 dark:hover:border-neutral-700"
    >
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
        <div className="flex items-center gap-1 border-t border-neutral-100 pt-3 sm:border-t-0 sm:pt-0 dark:border-neutral-800">
          <FileActionButton
            label="View"
            icon={<Eye size={15} />}
            onClick={onView}
          />
          {!isPublicView && (
            <FileActionButton
              label="Rename"
              icon={<Type size={15} />}
              onClick={onRename}
            />
          )}
          <FileActionButton
            label="Download"
            icon={<Download size={15} />}
            onClick={onDownload}
            primary
          />
          {!isPublicView && (
            <FileActionButton
              label="Share"
              icon={<Share2 size={15} />}
              onClick={onShare}
            />
          )}
          {!isPublicView && (
            <button
              type="button"
              aria-label="Delete file"
              onClick={onDelete}
              className="ml-1 cursor-pointer rounded-xl p-2.5 text-neutral-300 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:text-neutral-600 dark:hover:bg-rose-500/10"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function FileActionButton({
  label,
  icon,
  onClick,
  primary = false,
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${primary ? "bg-neutral-900 text-white shadow-sm hover:opacity-80 dark:bg-white dark:text-black" : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"}`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function EmptyVault({
  isPublicView,
  destinationName,
}: {
  isPublicView: boolean;
  destinationName: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-white/45 px-6 py-14 text-center backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/35">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500">
        <HardDrive size={20} />
      </div>
      <h3 className="mt-4 font-serif text-xl text-neutral-700 dark:text-neutral-300">
        {isPublicView
          ? "Nothing has been shared yet"
          : `${destinationName} is ready`}
      </h3>
      <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500">
        {isPublicView
          ? "Check back once files are added to this collection."
          : "Choose a destination above, then drop in your first file."}
      </p>
    </div>
  );
}

function VaultLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0A]">
      <div className="flex flex-col items-center">
        <Loader2 size={28} className="animate-spin text-blue-500" />
        <p className="mt-4 font-serif text-lg italic text-neutral-500">
          Opening your vault
        </p>
      </div>
    </div>
  );
}
