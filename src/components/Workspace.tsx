"use client";

import { Clock, FileText, HardDrive, Plus, Search, User, ArrowRight, X, Database } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  totalNotes: number;
  totalFiles: number;
  storageUsed: number;

  recentNotes: {
    id: string;
    title: string | null;
  }[];

  recentFiles: {
    name: string;
  }[];

  session?: {
    name?: string,
    email?: string,
    image?: string,
    id: string
  }
};

export default function Workspace({
  totalNotes,
  totalFiles,
  storageUsed,
  recentNotes,
  recentFiles,
  session
}: Props) {

  const [search, setSearch] = useState("");
  const router = useRouter();
  const[isFocused, setIsFocused]=useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!search.trim()) return;
    setHasSearched(true);
    router.push(`/dashboard/notes?q=${encodeURIComponent(search)}`);
  };

  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
  }

  return (
    <main className="relative overflow-hidden min-h-screen w-full bg-[#FDFDFD] dark:bg-[#050505] transition-colors duration-700">
      
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.75, 0.25, 0.75] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/40 blur-[120px] dark:bg-blue-600/20" 
        />
      </div>

      <div className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto min-h-screen">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-2xl opacity-10 group-hover:opacity-30 transition-opacity" />
              {session?.image ? (
                <img 
                  src={session.image} 
                  alt="Avatar" 
                  className="relative w-16 h-16 rounded-[22px] border border-white dark:border-neutral-800 object-cover shadow-2xl shadow-neutral-200 dark:shadow-none"
                />
              ) : (
                <div className="relative w-16 h-16 rounded-[22px] bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex items-center justify-center text-xl font-serif italic shadow-sm">
                  {session?.email?.[0].toUpperCase() || <User size={24} />}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-light tracking-tight text-neutral-900 dark:text-white italic font-serif">
                Welcome, <span className="font-sans not-italic font-medium">{session?.name?.split(' ')[0] || "User"}</span>
              </h1>
              <p className="text-neutral-400 text-sm mt-1">{session?.email}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full md:w-auto">
            
            <div className={`relative flex items-center transition-all duration-500 group ${isFocused ? 'scale-[1.02]' : 'scale-100'}`}>
              <div className={`absolute inset-0 bg-blue-500/10 blur-xl transition-opacity duration-500 ${isFocused ? 'opacity-100' : 'opacity-0'}`} />
              
              <div className={`relative flex items-center bg-white/40 dark:bg-neutral-900/40 backdrop-blur-2xl border rounded-xl transition-all duration-300 ${isFocused ? 'border-neutral-900 dark:border-neutral-400 w-full md:w-72' : 'border-neutral-200 dark:border-neutral-800 w-full md:w-64'}`}>
                <Search className={`ml-4 transition-colors ${isFocused ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400'}`} size={18} />
                
                <input
                  value={search}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search the archive..."
                  className="bg-transparent px-3 py-3 rounded-2xl text-sm outline-none flex-1 text-neutral-900 dark:text-white placeholder:text-neutral-400/60"
                />

                <AnimatePresence>
                  {search && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setSearch("")}
                      className="p-1 mr-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                      <X size={14} />
                    </motion.button>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleSearch}
                  className={`cursor-pointer mr-1 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-tighter transition-all ${search.trim() && !hasSearched ? 'bg-neutral-900 text-white dark:bg-white dark:text-black opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                  Go
                </button>
              </div>
            </div>

            {/* <Link
              href="/notes"
              className="bg-[#1A1A1A] dark:bg-white text-white dark:text-black px-6 py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium hover:opacity-80 transition-all shadow-xl shadow-blue-500/10 active:scale-95"
            >
              <Plus size={18} />
              New Sheet
            </Link> */}
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          <StatBox label="Active Notes" value={totalNotes} icon={<FileText className="text-blue-500" size={16} />} />
          <StatBox label="Vault Assets" value={totalFiles} icon={<HardDrive className="text-emerald-500" size={16} />} />
          <StatBox label="Storage Capacity" value={formatBytes(storageUsed)} icon={<Database className="text-amber-500" size={16} />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Recent Sheets</h2>
            </div>
            <div className="grid gap-3">
              {recentNotes.length === 0 ? (
                <EmptyState message="The archive is silent." />
              ) : (
                recentNotes.map((note) => (
                  <Link
                    key={note.id}
                    href={`/dashboard/notes?id=${note.id}`}
                    className="group p-5 bg-white/20 dark:bg-[#0d0d0d]/40 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-2xl hover:border-blue-500 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-900 flex items-center justify-center text-neutral-400 group-hover:text-blue-500 transition-colors border border-neutral-100 dark:border-neutral-800">
                        <FileText size={18} />
                      </div>
                      <span className="font-medium text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white">
                        {note.title || "Untitled Draft"}
                      </span>
                    </div>
                    <ArrowRight size={16} className="text-neutral-200 group-hover:text-blue-500 transition-all" />
                  </Link>
                ))
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Vault Assets</h2>
            </div>
            <div className="grid gap-3">
              {recentFiles.length === 0 ? (
                <EmptyState message="The vault is empty." />
              ) : (
                recentFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-5 bg-white/40 dark:bg-[#0d0d0d]/40 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-2xl group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-900 flex items-center justify-center text-neutral-400 border border-neutral-100 dark:border-neutral-800">
                        <HardDrive size={18} />
                      </div>
                      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 truncate max-w-[200px]">
                        {file.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-neutral-300 uppercase italic">Recent</span>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}

function StatBox({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="bg-white/40 dark:bg-[#0d0d0d]/40 backdrop-blur-2xl border border-neutral-100 dark:border-neutral-800 p-5 rounded-xl shadow-sm group relative overflow-hidden transition-all hover:border-neutral-200 dark:hover:border-neutral-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
          {icon}
        </div>
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400">
          {label}
        </p>
      </div>
      <p className="text-4xl font-light tracking-tighter text-neutral-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="p-12 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-[2rem] flex flex-col items-center justify-center bg-neutral-50/20 dark:bg-neutral-900/10">
      <p className="text-xs font-light italic text-neutral-400 tracking-wide">{message}</p>
    </div>
  );
}