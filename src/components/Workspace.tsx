"use client";

import { Clock, FileText, HardDrive, Plus, Search } from "lucide-react";
import Link from "next/link";

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
}: Props) {
  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
  }

  return (
    <main className="relative overflow-y-auto min-h-screen w-full">
      <div className="relative z-10 p-8 md:p-12 mx-auto min-h-screen bg-slate-50 dark:bg-[#050505] overflow-hidden">

        {/* Background Glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/70 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-blue-500/70 blur-[120px]" />

        {/* Header */}
        <header className="relative z-20 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-black dark:text-neutral-100 text-sm mb-2">
              <Clock size={14} />
              <span>Workspace Overview</span>
            </div>
            <h1 className="text-4xl dark:text-white tracking-tight italic font-serif">
              Dashboard
            </h1>
          </div>

          <div className="flex gap-3">
            <Link
              href="/notes"
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-5 py-3 rounded-xl flex items-center gap-2 text-sm font-medium hover:border-neutral-900 dark:hover:border-neutral-400 transition-all"
            >
              <Search size={18} />
              <span className="hidden sm:inline">Browse Notes</span>
            </Link>

            <Link
              href="/notes"
              className="bg-[#1A1A1A] dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-lg"
            >
              <Plus size={18} />
              New Note
            </Link>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <StatBox label="Total Notes" value={totalNotes} />
          <StatBox label="Attached Files" value={totalFiles} />
          <StatBox label="Space Used" value={formatBytes(storageUsed)} />
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Recent Notes */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4">
              Recent Notes
            </h2>

            <div className="space-y-3">
              {recentNotes.length === 0 ? (
                <p className="text-neutral-400 text-sm">No recent notes</p>
              ) : (
                recentNotes.map((note) => (
                  <Link
                    key={note.id}
                    href="/notes"
                    className="block p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-blue-500 transition-all"
                  >
                    <p className="font-medium">
                      {note.title || "Untitled"}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Recent Files */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4">
              Recent Files
            </h2>

            <div className="space-y-3">
              {recentFiles.length === 0 ? (
                <p className="text-neutral-400 text-sm">No recent files</p>
              ) : (
                recentFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl"
                  >
                    <HardDrive size={16} className="text-emerald-500" />
                    <span className="truncate">{file.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}

/* ---------- Sub Components ---------- */

function StatBox({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="relative z-20 bg-white dark:bg-neutral-900/50 border border-neutral-300 dark:border-neutral-800 p-6 rounded-2xl">
      <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-2">
        {label}
      </p>
      <p className="text-3xl font-light tracking-tight">{value}</p>
    </div>
  );
}
