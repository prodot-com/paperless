"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sun, Moon, Monitor, HardDrive, User, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  session?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id: string;
  };
  storageUsed: number;
  totalFiles: number;
  totalNotes: number;
};

export default function SettingsClient({
  session,
  storageUsed,
  totalFiles,
  totalNotes,
}: Props) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  function formatBytes(bytes: number) {
    if (!bytes) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
  }

  const maxStorage = 1024 * 1024 * 1024; 
  const percent = Math.min((storageUsed / maxStorage) * 100, 100);

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen bg-[#FDFDFD] dark:bg-[#050505] transition-colors duration-700 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px]" 
        />
      </div>

      <div className="border relative z-10 mx-auto px-6 md:px-16 py-12 md:py-14 space-y-10">
        
        <header>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight italic font-serif text-neutral-900 dark:text-white">
            System Details
          </h1>
          <p className="text-neutral-400 text-sm mt-4 uppercase tracking-[0.2em] font-bold">
            Configure your digital workspace environment
          </p>
        </header>

        <section>
          <div className="flex items-center gap-2 mb-8 text-neutral-400">
            <User size={14} />
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold">Identity & Security</h2>
          </div>

          <div className="bg-white/40 dark:bg-neutral-900/40 backdrop-blur-2xl border border-neutral-100 dark:border-neutral-800 rounded-xl p-7 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
            <div className="relative group">
               <div className="absolute inset-0 bg-blue-500 rounded-xl blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
               {session?.image ? (
                <img
                  src={session.image}
                  alt="Avatar"
                  className="relative w-24 h-24 rounded-xl object-cover border border-white dark:border-neutral-800 shadow-xl shadow-neutral-200 dark:shadow-none"
                />
              ) : (
                <div className="relative w-24 h-24 rounded-[2rem] bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex items-center justify-center text-3xl font-serif italic">
                  {session?.email?.[0].toUpperCase()}
                </div>
              )}
            </div>

            <div className="text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <h3 className="text-2xl font-medium text-neutral-900 dark:text-white">
                  {session?.name || "User"}
                </h3>
                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-full uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-1.5">
                  <ShieldCheck size={12} /> Google Verified
                </span>
              </div>
              <p className="text-neutral-400 font-light italic font-serif">{session?.email}</p>
              {/* <p className="text-[10px] text-neutral-300 dark:text-neutral-700 uppercase tracking-widest mt-4">
                Internal UID: {session?.id.slice(0, 8)}...
              </p> */}
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-8 text-neutral-400">
            <Zap size={14} />
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold">Environment Appearance</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <ThemeCard
              label="Light"
              active={theme === "light"}
              icon={<Sun size={20} />}
              onClick={() => setTheme("light")}
            />
            <ThemeCard
              label="Dark"
              active={theme === "dark"}
              icon={<Moon size={20} />}
              onClick={() => setTheme("dark")}
            />
            <ThemeCard
              label="System"
              active={theme === "system"}
              icon={<Monitor size={20} />}
              onClick={() => setTheme("system")}
            />
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-8 text-neutral-400">
            <HardDrive size={14} />
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold">Storage Infrastructure</h2>
          </div>

          <div className="bg-white/40 dark:bg-neutral-900/40 backdrop-blur-2xl border border-neutral-100 dark:border-neutral-800 rounded-xl p-7 space-y-7">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-3xl font-light tracking-tighter text-neutral-900 dark:text-white italic font-serif">
                    {formatBytes(storageUsed)} <span className="text-sm not-italic font-sans text-neutral-400 uppercase font-bold tracking-widest ml-1">Allocated</span>
                  </p>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-300">
                   Plan Limit: {formatBytes(maxStorage)}
                </p>
              </div>

              <div className="relative w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute h-full bg-blue-500 rounded-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 border-t border-neutral-50 dark:border-neutral-800 pt-10">
              <div>
                <p className="uppercase text-[10px] tracking-[0.2em] font-bold text-neutral-400 mb-2">Total Archives</p>
                <p className="text-3xl text-neutral-900 dark:text-white font-light">
                  {totalFiles} <span className="text-xs text-neutral-300 uppercase font-bold ml-1">Assets</span>
                </p>
              </div>
              <div>
                <p className="uppercase text-[10px] tracking-[0.2em] font-bold text-neutral-400 mb-2">Knowledge Base</p>
                <p className="text-3xl text-neutral-900 dark:text-white font-light">
                  {totalNotes} <span className="text-xs text-neutral-300 uppercase font-bold ml-1">Sheets</span>
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}

function ThemeCard({ label, active, icon, onClick }: { label: string; active: boolean; icon: React.ReactNode; onClick: () => void; }) {
  return (
    <button
      onClick={onClick}
      className={`p-5 rounded-xl border transition-all duration-300 flex justify-center items-center gap-4 group
        ${active
            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 shadow-xl shadow-blue-500/5"
            : "border-neutral-100 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md hover:border-neutral-300 dark:hover:border-neutral-600"
        }`}
    >
      <div className={`p-3 rounded-xl transition-colors ${active ? "text-blue-500" : "text-neutral-300 group-hover:text-neutral-500"}`}>
        {icon}
      </div>
      <span className={`text-xs font-bold uppercase tracking-widest ${active ? "text-blue-600 dark:text-blue-400" : "text-neutral-400"}`}>
        {label}
      </span>
    </button>
  );
}