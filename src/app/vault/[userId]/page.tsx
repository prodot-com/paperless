"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  File,
  Eye,
  Download,
  HardDrive,
  Loader2,
  Folder,
  FolderOpen,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

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

export default function PublicVaultPage() {
  const router = useRouter();
  const params = useParams();
  const publicUserId = params.userId as string;

  const [ownerName, setOwnerName] = useState<string>("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [loadingFolders, setLoadingFolders] = useState(true);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchVaultData = async () => {
      if (!publicUserId) return;
      try {
        setLoadingFolders(true);
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
        setLoadingFolders(false);
      }
    };

    fetchVaultData();
  }, [publicUserId]);

  function formatSize(bytes: number) {
    const sizes = ["B", "KB", "MB", "GB"];
    let i = 0;
    while (bytes >= 1024 && i < sizes.length - 1) {
      bytes /= 1024;
      i++;
    }
    return `${bytes.toFixed(1)} ${sizes[i]}`;
  }

  async function handleAction(id: string, action: string) {
    try {
      const res = await fetch(`/api/public/file/${id}/${action}`);
      if (!res.ok) throw new Error("Action failed");
      const { url } = await res.json();
      
      if (action === "view") {
        router.push(`/file/${id}?public=true`);
      }
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

  const groupedFiles = useMemo(() => {
    const rootFiles = files.filter((f) => !f.folderId);
    const folderGroups = folders
      .map((folder) => ({
        ...folder,
        files: files.filter((f) => f.folderId === folder.id),
      }))
      .filter((group) => group.files.length > 0);

    return { rootFiles, folderGroups };
  }, [files, folders]);

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
              {ownerName ? `${ownerName}'s File Vault` : "File Vault"}
            </h1>
          </div>
        </header>

        {/* Smooth Folder Selection Ribbon */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Browsing Directory
            </h2>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar snap-x">
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
              <Loader2
                size={16}
                className="animate-spin text-neutral-400 mx-4"
              />
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
                  {selectedFolderId === folder.id ? (
                    <FolderOpen size={16} />
                  ) : (
                    <Folder size={16} />
                  )}
                  {folder.name}
                </button>
              ))
            )}
          </div>
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
            {files.length === 0 && !loadingFolders && (
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
                  {group.files.map((f) => (
                    <FileRow key={f.id} file={f} />
                  ))}
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
                  {groupedFiles.rootFiles.map((f) => (
                    <FileRow key={f.id} file={f} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

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
              {formatSize(f.size)} •{" "}
              {new Date(f.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-1 border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-50 dark:border-neutral-900">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <FileActionBtn
              icon={<Eye size={16} />}
              onClick={() => handleAction(f.id, "view")}
              label="View"
            />
            <FileActionBtn
              icon={<Download size={16} />}
              onClick={() => handleAction(f.id, "download")}
              label="Save"
            />
          </div>
        </div>
      </motion.div>
    );
  }
}

function FileActionBtn({
  icon,
  onClick,
  label,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
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