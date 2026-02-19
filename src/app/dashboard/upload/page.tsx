"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Upload, 
  File, 
  MoreVertical, 
  Eye, 
  Download, 
  Trash2, 
  Share2, 
  Type, 
  Search,
  HardDrive,
  Loader2
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
};

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: "error" | "confirm" | "rename";
    title: string;
    message: string;
    file?: FileItem;
  }>({
    isOpen: false,
    type: "confirm",
    title: "",
    message: "",
  });


  function validateFile(file: File): string | null {
  if (!allowedTypes.includes(file.type)) {
    return "Unsupported file type.";
  }

  if (file.size > MAX_SIZE) {
    return "File exceeds size limit.";
  }

  return null;
}

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

async function uploadFile(selectedFile?: File) {
  const fileToUpload = selectedFile || file;
  if (!fileToUpload) return;

  const validationError = validateFile(fileToUpload);

  if (validationError) {
    setModal({
      isOpen: true,
      type: "error",
      title: "Upload Blocked",
      message: validationError,
    });
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", fileToUpload);

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await uploadRes.json();

    if (!uploadRes.ok) {
      throw new Error(data.error || "Upload failed");
    }

    toast.success("File uploaded successfully");

    const res = await fetch("/api/upload");
    if (!res.ok) throw new Error("Failed to refresh file list");

    setFiles(await res.json());
  } catch (err: any) {
    setModal({
      isOpen: true,
      type: "error",
      title: "Upload Failed",
      message: err.message || "Something went wrong",
    });
  } finally {
    setLoading(false);
    setFile(null);
  }
}



  if (status === "loading") return <div className="p-12 animate-pulse text-neutral-400">Syncing vault...</div>;

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0a0a0a] transition-colors p-4 md:p-12">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
              <HardDrive size={14} />
              <span>Digital Asset Manager</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight italic font-serif text-neutral-900 dark:text-white">File Vault</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-sm">
              Logged in as <span className="font-medium text-neutral-800 dark:text-neutral-200 block sm:inline">{session?.user?.email}</span>
            </p>
          </div>
        </header>

        <div className="relative w-full">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="uploading"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-3xl p-14 flex flex-col items-center justify-center 
                          bg-white/70 dark:bg-[#0f0f0f]/70 
                          backdrop-blur-2xl 
                          border border-neutral-200/60 dark:border-neutral-800/60 
                          shadow-[0_40px_120px_-20px_rgba(0,0,0,0.15)]
                          overflow-hidden"
              >
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute -top-40 left-1/2 -translate-x-1/2 
                                  w-[600px] h-[600px] 
                                  bg-blue-500/10 dark:bg-blue-500/5 
                                  blur-[120px] rounded-full" />
                </div>

                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <motion.div
                    animate={{ x: ["-120%", "120%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 h-[1px] w-[50%] 
                              bg-gradient-to-r from-transparent via-blue-500/70 to-transparent 
                              blur-sm opacity-60"
                  />
                </div>

                <div className="relative z-10 flex flex-col items-center w-full max-w-sm">

                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="relative mb-10"
                  >
                    <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full opacity-60" />
                    
                    <div className="relative p-6 rounded-2xl 
                                    bg-white dark:bg-neutral-900 
                                    border border-neutral-200 dark:border-neutral-800 
                                    shadow-sm text-blue-500">
                      <Upload size={30} />
                    </div>
                  </motion.div>

                  <div className="text-center space-y-2 mb-8">
                    <motion.h3
                      className="text-xl font-medium tracking-tight font-serif italic 
                                text-neutral-900 dark:text-white"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Uploading Securely
                    </motion.h3>

                    <p className="text-[11px] uppercase tracking-[0.25em] 
                                  font-semibold text-blue-500/70">
                      Encrypting & Syncing
                    </p>
                  </div>

                  <div className="w-full h-[4px] bg-neutral-200/60 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3.5, ease: "easeInOut" }}
                      className="relative h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    >
                      <div className="absolute inset-0 blur-sm opacity-60 bg-blue-400" />
                    </motion.div>
                  </div>

                  <p className="mt-6 text-[11px] text-neutral-400 font-medium tracking-wide">
                    Please keep this window open
                  </p>
                </div>
              </motion.div>

            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const droppedFile = e.dataTransfer.files[0];
                  if (droppedFile) uploadFile(droppedFile);
                }}
                className={`min-h-70 relative group border-2 border-dashed rounded-xl p-12 transition-all duration-500 flex flex-col items-center justify-center bg-white dark:bg-[#0d0d0d] ${
                  isDragging
                    ? "border-blue-500 bg-blue-50/30 dark:bg-blue-900/10 scale-[0.99] shadow-2xl shadow-blue-500/5"
                    : "border-neutral-200 dark:border-neutral-800 shadow-xl shadow-neutral-100 dark:shadow-none hover:border-neutral-300 dark:hover:border-neutral-700"
                }`}
              >
                <motion.div
                  animate={isDragging ? { scale: 1.2, rotate: 5 } : { scale: 1 }}
                  className={`p-5 rounded-[1.8rem] mb-5 transition-colors shadow-sm ${
                    isDragging
                      ? "bg-blue-500 text-white"
                      : "bg-neutral-50 dark:bg-neutral-900 text-neutral-400 group-hover:text-neutral-600"
                  }`}
                >
                  <Upload size={32} />
                </motion.div>

                <h3 className="text-lg font-medium mb-1 tracking-tight">
                  {isDragging ? "Drop to secure" : "Drop file to store"}
                </h3>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 mb-8">
                  PDF • Word • Image • ZIP (Max 1MB)
                </p>

                <label className="cursor-pointer bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-xl text-sm font-medium hover:opacity-80 transition-all active:scale-95 shadow-lg shadow-black/5 dark:shadow-none">
                  Browse File
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.pptx,.txt,.jpg,.jpeg,.png,.webp,.gif,.zip"
                    onChange={(e) => uploadFile(e.target.files?.[0] || undefined)}
                  />
                </label>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 md:mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-neutral-400 shrink-0">Stored Assets ({files.length})</h2>
            <div className="h-1px flex-1 bg-neutral-100 dark:bg-neutral-900 mx-4 md:mx-6" />
          </div>

          <div className="space-y-4 md:space-y-3">
            <AnimatePresence>
              {files.length === 0 && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-neutral-300 italic">The vault is currently empty.</motion.p>
              )}
              {files.map((f) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={f.id}
                  className="group bg-white dark:bg-[#0d0d0d] border border-neutral-100 dark:border-neutral-800 p-3 md:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between hover:border-neutral-300 dark:hover:border-neutral-600 transition-all shadow-sm gap-4"
                >
                  <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 shrink-0 bg-neutral-50 dark:bg-neutral-900 rounded-xl flex items-center justify-center text-neutral-400 group-hover:text-blue-500 transition-colors">
                      <HardDrive size={20} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium truncate pr-2">{f.name}</p>
                      <p className="text-[10px] text-neutral-400 uppercase tracking-tighter font-bold">
                        {Math.round(f.size / 1024)} KB • {new Date(f.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-1 border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-50 dark:border-neutral-900">
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                        <FileActionBtn icon={<Eye size={16} />} onClick={() => handleAction(f.id, 'view')} label="View" />
                        <FileActionBtn icon={<Type size={16} />} onClick={() => handleRename(f)} label="Rename" />
                        <FileActionBtn icon={<Download size={16} />} onClick={() => handleAction(f.id, 'download')} label="Save" />
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
              ))}
            </AnimatePresence>
          </div>
        </div>
        <CustomModal
        isOpen={modal.isOpen}
        onClose={() =>
          setModal((prev) => ({ ...prev, isOpen: false }))
        }
        type={modal.type}
        title={modal.title}
        message={modal.message}
        defaultValue={modal.file?.name}
        onConfirm={handleModalConfirm}
      />
      </div>
    </div>
  );

  async function handleAction(id: string, action: string) {
    try {
      const res = await fetch(`/api/upload/${id}/${action}`);
      if (!res.ok) throw new Error("Action failed");

      const { url } = await res.json();
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Unable to perform action");
    }
  }

  function handleRename(f: FileItem) {
    setModal({
      isOpen: true,
      type: "rename",
      title: "Rename File",
      message: "Enter a new name for this file.",
      file: f,
    });
  }

  async function handleShare(id: string) {
    try {
      const res = await fetch("/api/share/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "file", resourceId: id, expiresInHours: 24 }),
      });

      if (!res.ok) throw new Error("Share failed");

      const { url } = await res.json();
      await navigator.clipboard.writeText(url);

      toast.success("Share link copied to clipboard");
    } catch {
      toast.error("Unable to create share link");
    }
  }

  function handleDelete(f: FileItem) {
    setModal({
      isOpen: true,
      type: "confirm",
      title: "Delete File",
      message: "Are you sure you want to delete this file permanently?",
      file: f,
    });
  }

  async function handleModalConfirm(value?: string) {
    if (!modal.file) return;

    try {
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

        setFiles((prev) =>
          prev.map((x) =>
            x.id === modal.file?.id ? { ...x, name: value.trim() } : x
          )
        );

        toast.success("File renamed successfully");
      }

      if (modal.type === "confirm") {
        const res = await fetch(`/api/upload/${modal.file.id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error();

        setFiles((prev) =>
          prev.filter((x) => x.id !== modal.file?.id)
        );

        toast.success("File deleted successfully");
      }
    } catch {
      toast.error("Action failed. Please try again.");
    } finally {
      setModal((prev) => ({ ...prev, isOpen: false }));
    }
  }
}

function FileActionBtn({ icon, onClick, label }: { icon: any, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className="flex cursor-pointer items-center gap-2 p-2 px-2 md:px-3 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg transition-all"
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider hidden lg:block">{label}</span>
    </button>
  );
}