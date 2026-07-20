"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  File,
  Eye,
  Download,
  Trash2,
  Share2,
  Type,
  HardDrive,
  Loader2,
  Folder,
  FolderPlus,
  FolderOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [loadingFolders, setLoadingFolders] = useState(true);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: "error" | "confirm" | "rename" | "share";
    title: string;
    message: string;
    file?: FileItem;
  }>({
    isOpen: false,
    type: "confirm",
    title: "",
    message: "",
  });

  const fetchFolders = async () => {
    try {
      setLoadingFolders(true);
      const res = await fetch("/api/folders");
      if (!res.ok) throw new Error("Failed to fetch folders");
      const data = await res.json();
      setFolders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFolders(false);
    }
  };

  const handleCreateFolder = async (name?: string) => {
    if (!name?.trim()) return;
    try {
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      setFolders((prev) => [...prev, data]);
      setSelectedFolderId(data.id);
      toast.success(`Folder "${data.name}" created`);
    } catch (err) {
      toast.error("Failed to create folder");
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/upload")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load files");
          return res.json();
        })
        .then(setFiles)
        .catch(() => {
          toast.error("Unable to load files");
        });
    }
  }, [status]);

  function formatSize(bytes: number) {
    const sizes = ["B", "KB", "MB", "GB"];
    let i = 0;
    while (bytes >= 1024 && i < sizes.length - 1) {
      bytes /= 1024;
      i++;
    }
    return `${bytes.toFixed(1)} ${sizes[i]}`;
  }

  function validateFile(file: File): string | null {
    if (!allowedTypes.includes(file.type)) {
      return `Unsupported file type (${file.type || "unknown"})`;
    }
    if (file.size > MAX_SIZE) {
      return `File too large (${formatSize(file.size)}). Max allowed is ${formatSize(MAX_SIZE)}.`;
    }
    return null;
  }

  async function handleFiles(selectedFiles: File[]) {
    if (loading || !selectedFiles.length) return;

    const validFiles: File[] = [];
    for (const file of selectedFiles) {
      const error = validateFile(file);
      if (error) {
        toast.error(error, { description: file.name });
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) return;
    setLoading(true);

    try {
      for (const file of validFiles) {
        setUploadingFiles((prev) => [...prev, file.name]);

        const formData = new FormData();
        formData.append("file", file);
        if (selectedFolderId) {
          formData.append("folderId", selectedFolderId);
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
            signal: controller.signal,
          });

          const data = await res.json();
          if (!res.ok) {
            toast.error(`${file.name}: ${data.error || "Upload failed"}`);
          } else {
            toast.success(`${file.name} uploaded`);
          }
        } catch (err: any) {
          if (err.name === "AbortError") {
            toast.error(`${file.name}: Upload timeout`);
          } else {
            toast.error(`${file.name}: Upload failed`);
          }
        } finally {
          clearTimeout(timeout);
          setUploadingFiles((prev) => prev.filter((f) => f !== file.name));
        }
      }

      const refreshed = await fetch("/api/upload");
      if (refreshed.ok) {
        setFiles(await refreshed.json());
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  // Group files by folder for organized rendering
  const groupedFiles = useMemo(() => {
    const rootFiles = files.filter((f) => !f.folderId);
    const folderGroups = folders.map((folder) => ({
      ...folder,
      files: files.filter((f) => f.folderId === folder.id),
    })).filter((group) => group.files.length > 0);

    return { rootFiles, folderGroups };
  }, [files, folders]);

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center animate-pulse text-neutral-400">
        Syncing vault...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0a0a0a] transition-colors p-4 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
              <HardDrive size={14} />
              <span>Digital Asset Manager</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight italic font-serif text-neutral-900 dark:text-white">
              File Vault
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-sm">
              Logged in as <span className="font-medium text-neutral-800 dark:text-neutral-200 block sm:inline">{session?.user?.email}</span>
            </p>
          </div>
        </header>

        {/* Smooth Folder Selection Ribbon */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Target Directory</h2>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar snap-x">
            {/* Root Option */}
            <button
              onClick={() => setSelectedFolderId(null)}
              className={`shrink-0 snap-start flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                selectedFolderId === null
                  ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 border border-blue-200 dark:border-blue-500/30"
                  : "bg-white dark:bg-neutral-900 text-neutral-500 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-sm"
              }`}
            >
              <HardDrive size={16} />
              Main Vault
            </button>

            {loadingFolders ? (
              <Loader2 size={16} className="animate-spin text-neutral-400 mx-4" />
            ) : (
              folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={`shrink-0 snap-start flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                    selectedFolderId === folder.id
                      ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 border border-blue-200 dark:border-blue-500/30 shadow-md shadow-blue-500/5"
                      : "bg-white dark:bg-neutral-900 text-neutral-500 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-sm"
                  }`}
                >
                  {selectedFolderId === folder.id ? <FolderOpen size={16} /> : <Folder size={16} />}
                  {folder.name}
                </button>
              ))
            )}

            {/* Create Folder Button */}
            <button
              onClick={() => setFolderModalOpen(true)}
              className="shrink-0 snap-start flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest bg-neutral-900 dark:bg-white text-white dark:text-black hover:opacity-80 transition-all shadow-md active:scale-95 ml-2"
            >
              <FolderPlus size={16} />
              New Folder
            </button>
          </div>
        </div>

        {/* Upload Zone */}
        <div className="relative w-full mb-16">
          <AnimatePresence mode="wait">
            {loading ? (
               <motion.div
                 key="uploading"
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0 }}
                 className="relative rounded-[2.5rem] p-14 flex flex-col items-center justify-center bg-white/70 dark:bg-[#0f0f0f]/70 backdrop-blur-2xl border border-neutral-200/60 dark:border-neutral-800/60 shadow-xl overflow-hidden"
               >
                 <div className="absolute inset-0 pointer-events-none">
                   <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-150 h-150 bg-blue-500/10 blur-[120px] rounded-full" />
                 </div>
                 <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
                   <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="relative mb-8">
                     <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full opacity-60" />
                     <div className="relative p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm text-blue-500">
                       <Upload size={30} />
                     </div>
                   </motion.div>
                   <motion.h3 className="text-xl font-medium tracking-tight font-serif italic text-neutral-900 dark:text-white mb-2" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}>
                     Uploading Securely
                   </motion.h3>
                   <p className="text-[11px] uppercase tracking-[0.25em] font-semibold text-blue-500/70 mb-8">Encrypting & Syncing</p>
                   <div className="w-full h-1 bg-neutral-200/60 dark:bg-neutral-800 rounded-full overflow-hidden">
                     <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 3.5, ease: "easeInOut" }} className="relative h-full bg-linear-to-r from-blue-500 to-indigo-500" />
                   </div>
                 </div>
               </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files.length > 0) handleFiles(Array.from(e.dataTransfer.files));
                }}
                className={`min-h-[280px] relative group border-2 border-dashed rounded-[2.5rem] p-12 transition-all duration-500 flex flex-col items-center justify-center bg-white dark:bg-[#0d0d0d] ${
                  isDragging
                    ? "border-blue-500 bg-blue-50/30 dark:bg-blue-900/10 scale-[0.99] shadow-2xl shadow-blue-500/5"
                    : "border-neutral-200 dark:border-neutral-800 shadow-xl shadow-neutral-100 dark:shadow-none hover:border-neutral-300 dark:hover:border-neutral-700"
                }`}
              >
                <motion.div
                  animate={isDragging ? { scale: 1.2, rotate: 5 } : { scale: 1 }}
                  className={`p-5 rounded-[1.8rem] mb-5 transition-colors shadow-sm ${
                    isDragging ? "bg-blue-500 text-white" : "bg-neutral-50 dark:bg-neutral-900 text-neutral-400 group-hover:text-blue-500"
                  }`}
                >
                  <Upload size={32} />
                </motion.div>
                <h3 className="text-lg font-medium mb-1 tracking-tight">
                  {isDragging ? "Drop to secure" : "Drop file to store"}
                </h3>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 mb-8 text-center max-w-xs">
                  Targeting: {selectedFolderId ? folders.find(f => f.id === selectedFolderId)?.name : "Main Vault"}
                </p>
                <label className="cursor-pointer bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-all active:scale-95 shadow-lg shadow-black/5 dark:shadow-none">
                  Browse File
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    accept=".pdf,.doc,.docx,.pptx,.txt,.jpg,.jpeg,.png,.webp,.gif,.zip"
                    onChange={(e) => {
                      if (!e.target.files) return;
                      handleFiles(Array.from(e.target.files));
                      e.target.value = "";
                    }}
                  />
                </label>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Grouped Assets List */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-neutral-400 shrink-0">
              Vault Contents ({files.length})
            </h2>
            <div className="h-[1px] flex-1 bg-neutral-100 dark:bg-neutral-900 mx-6" />
          </div>

          <div className="space-y-12">
            {files.length === 0 && (
              <p className="text-center py-10 text-neutral-400 italic font-serif">
                The vault is currently empty.
              </p>
            )}

            {/* Render Folders that have files */}
            {groupedFiles.folderGroups.map((group) => (
              <div key={group.id} className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <FolderOpen size={16} className="text-blue-500" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-300">
                    {group.name}
                  </h3>
                  <span className="text-[10px] text-neutral-400 font-medium bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded-md">
                    {group.files.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {group.files.map((f) => <FileRow key={f.id} file={f} />)}
                </div>
              </div>
            ))}

            {/* Render Main Vault / Uncategorized files */}
            {groupedFiles.rootFiles.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <HardDrive size={16} className="text-neutral-400" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Main Vault
                  </h3>
                </div>
                <div className="space-y-3">
                  {groupedFiles.rootFiles.map((f) => <FileRow key={f.id} file={f} />)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        <CustomModal
          isOpen={folderModalOpen}
          onClose={() => setFolderModalOpen(false)}
          type="folder"
          title="Create Directory"
          message="Enter a name for your secure folder."
          onConfirm={handleCreateFolder}
        />
        <CustomModal
          isOpen={modal.isOpen}
          onClose={() => setModal((prev) => ({ ...prev, isOpen: false }))}
          type={modal.type}
          title={modal.title}
          message={modal.message}
          defaultValue={modal.file?.name}
          onConfirm={handleModalConfirm}
        />
      </div>
    </div>
  );

  // Extracted Component for File Rows to keep code clean
  function FileRow({ file: f }: { file: FileItem }) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="group bg-white dark:bg-[#0d0d0d] border border-neutral-100 dark:border-neutral-800 p-3 md:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between hover:border-neutral-300 dark:hover:border-neutral-600 transition-all shadow-sm gap-4 ml-4 md:ml-6"
      >
        <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
          <div className="w-10 h-10 shrink-0 bg-neutral-50 dark:bg-neutral-900 rounded-xl flex items-center justify-center text-neutral-400 group-hover:text-blue-500 transition-colors">
            <File size={18} />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate pr-2 text-neutral-900 dark:text-white">
              {f.name}
            </p>
            <p className="text-[10px] text-neutral-400 uppercase tracking-tighter font-bold">
              {formatSize(f.size)} • {new Date(f.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-1 border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-50 dark:border-neutral-900">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <FileActionBtn icon={<Eye size={16} />} onClick={() => handleAction(f.id, "view")} label="View" />
            <FileActionBtn icon={<Type size={16} />} onClick={() => handleRename(f)} label="Rename" />
            <FileActionBtn icon={<Download size={16} />} onClick={() => handleAction(f.id, "download")} label="Save" />
            <FileActionBtn icon={<Share2 size={16} />} onClick={() => handleShare(f.id)} label="Share" />
          </div>
          <div className="w-px h-4 bg-neutral-100 dark:bg-neutral-800 mx-1 md:mx-2 shrink-0" />
          <button
            onClick={() => handleDelete(f)}
            className="p-2 cursor-pointer text-neutral-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all shrink-0"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </motion.div>
    );
  }

  // Action Handlers
  async function handleAction(id: string, action: string) {
    try {
      const res = await fetch(`/api/upload/${id}/${action}`);
      if (!res.ok) throw new Error("Action failed");
      const { url } = await res.json();
      if (action === "view") router.push(`/file/${id}?from=upload`);
      if (action === "download") {
        const link = document.createElement("a");
        link.href = url;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch {
      toast.error("Unable to perform action");
    }
  }

  function handleRename(f: FileItem) {
    setModal({ isOpen: true, type: "rename", title: "Rename File", message: "Enter a new name for this file.", file: f });
  }

  function handleShare(id: string) {
    const file = files.find((f) => f.id === id);
    setModal({ isOpen: true, type: "share", title: "Share File", message: "Select expiry duration", file });
  }

  function handleDelete(f: FileItem) {
    setModal({ isOpen: true, type: "confirm", title: "Delete File", message: "Are you sure you want to delete this file permanently?", file: f });
  }

  async function handleModalConfirm(value?: string) {
    if (!modal.file) return;
    try {
      if (modal.type === "share") {
        const expiresInHours = value === "never" ? null : Number(value);
        const res = await fetch("/api/upload/share", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "file", resourceId: modal.file.id, expiresInHours }),
        });
        if (!res.ok) throw new Error("Share failed");
        const { url } = await res.json();
        await navigator.clipboard.writeText(url);
        toast.success("Share link copied!");
      }
      if (modal.type === "rename") {
        if (!value || value.trim() === modal.file.name) {
          toast.error("Invalid file name");
          return;
        }
        const res = await fetch(`/api/upload/${modal.file.id}/rename`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: value.trim() }),
        });
        if (!res.ok) throw new Error();
        setFiles((prev) => prev.map((x) => (x.id === modal.file?.id ? { ...x, name: value.trim() } : x)));
        toast.success("File renamed successfully");
      }
      if (modal.type === "confirm") {
        const res = await fetch(`/api/upload/${modal.file.id}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
        setFiles((prev) => prev.filter((x) => x.id !== modal.file?.id));
        toast.success("File deleted successfully");
      }
    } catch {
      toast.error("Action failed. Please try again.");
    } finally {
      setModal((prev) => ({ ...prev, isOpen: false }));
    }
  }
}

function FileActionBtn({ icon, onClick, label }: { icon: any; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex cursor-pointer items-center gap-2 p-2 px-2 md:px-3 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg transition-all"
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider hidden xl:block">
        {label}
      </span>
    </button>
  );
}