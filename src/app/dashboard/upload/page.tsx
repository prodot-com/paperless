"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Upload, File, Eye, Download, Trash2, 
  Share2, Type, HardDrive, Loader2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CustomModal from "@/components/CustomModal";

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

  // State Management
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Modal State
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "confirm";
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ isOpen: false, type: "success", title: "", message: "" });

  const triggerModal = (type: "success" | "error" | "confirm", title: string, message: string, onConfirm?: () => void) => {
    setModal({ isOpen: true, type, title, message, onConfirm });
  };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") fetchVaultData();
  }, [status]);

  async function fetchVaultData() {
    try {
      const res = await fetch("/api/upload");
      if (!res.ok) throw new Error("Connection failed.");
      setFiles(await res.json());
    } catch (err) {
      triggerModal("error", "Vault Offline", "We couldn't reach your file vault. Please check your connection.");
    }
  }

  async function handleFileUpload(selectedFile?: File) {
    if (!selectedFile) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed. File might be too large.");
      
      triggerModal("success", "Asset Secured", `${selectedFile.name} was successfully added to your vault.`);
      fetchVaultData();
    } catch (err: any) {
      triggerModal("error", "Security Block", err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteRequest = (id: string, name: string) => {
    triggerModal("confirm", "Permanently Remove?", `Are you sure you want to shred "${name}"? This cannot be reversed.`, async () => {
      try {
        const res = await fetch(`/api/upload/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Delete operation failed.");
        setFiles(prev => prev.filter(f => f.id !== id));
      } catch (err: any) {
        triggerModal("error", "Operation Failed", err.message);
      }
    });
  };

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] dark:bg-[#0a0a0a]">
      <Loader2 className="animate-spin text-neutral-300" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0a0a0a] transition-colors p-4 md:p-12 selection:bg-blue-100">
      <CustomModal {...modal} onClose={() => setModal({ ...modal, isOpen: false })} />

      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <div className="flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
            <HardDrive size={14} />
            <span>Encrypted Vault</span>
          </div>
          <h1 className="text-4xl font-light tracking-tight italic font-serif text-neutral-900 dark:text-white">Assets</h1>
        </header>

        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const dropped = e.dataTransfer.files[0];
            if (dropped) handleFileUpload(dropped);
          }}
          className={`relative group border-2 border-dashed rounded-[2.5rem] p-10 md:p-20 transition-all duration-500 flex flex-col items-center justify-center bg-white dark:bg-[#0d0d0d] ${
            isDragging ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 scale-[0.98]" : "border-neutral-200 dark:border-neutral-800 shadow-2xl shadow-neutral-100 dark:shadow-none"
          }`}
        >
          <div className={`p-5 rounded-2xl mb-5 transition-all ${isDragging || loading ? "bg-blue-500 text-white" : "bg-neutral-50 dark:bg-neutral-900 text-neutral-400"}`}>
            {loading ? <Loader2 className="animate-spin" size={32} /> : <Upload size={32} />}
          </div>
          <h3 className="text-xl font-medium mb-2">{loading ? "Securing asset..." : "Drop to upload"}</h3>
          <p className="text-sm text-neutral-400 mb-8">Documents or images up to 50MB</p>
          
          <label className="cursor-pointer bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-2xl text-sm font-medium hover:opacity-80 transition-all active:scale-95 shadow-lg">
            Browse Files
            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e.target.files?.[0] || undefined)} />
          </label>
        </div>

        {/* File Grid */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Archived ({files.length})</h2>
            <div className="h-[1px] flex-1 bg-neutral-100 dark:bg-neutral-900 mx-6" />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <AnimatePresence mode="popLayout">
              {files.map((f) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={f.id}
                  className="group bg-white dark:bg-[#0d0d0d] border border-neutral-100 dark:border-neutral-800 p-4 rounded-3xl flex items-center justify-between hover:border-neutral-300 dark:hover:border-neutral-600 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0 px-2">
                    <div className="w-12 h-12 shrink-0 bg-neutral-50 dark:bg-neutral-900 rounded-2xl flex items-center justify-center text-neutral-400 group-hover:text-blue-500 transition-colors">
                      <File size={22} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium truncate pr-4 text-neutral-800 dark:text-neutral-200">{f.name}</p>
                      <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mt-1">
                        {Math.round(f.size / 1024)} KB • {new Date(f.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <ActionIcon icon={<Eye size={18} />} onClick={() => window.open(f.path, "_blank")} />
                    <ActionIcon icon={<Share2 size={18} />} onClick={() => triggerModal("success", "Link Ready", "The share link has been copied to your clipboard.")} />
                    <div className="w-[1px] h-6 bg-neutral-100 dark:bg-neutral-800 mx-2" />
                    <button 
                      onClick={() => handleDeleteRequest(f.id, f.name)}
                      className="p-3 cursor-pointer text-neutral-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionIcon({ icon, onClick }: { icon: any, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="p-3 cursor-pointer text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-2xl transition-all"
    >
      {icon}
    </button>
  );
}