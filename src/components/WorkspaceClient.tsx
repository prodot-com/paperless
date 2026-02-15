"use client";

import { useState } from "react";
import {
  Clock,
  FileText,
  HardDrive,
  Plus,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

type Props = {
  totalNotes: number;
  totalFiles: number;
  storageUsed: number;
  storageLimit: number;
  recentNotes: { id: string; title: string }[];
};

export default function WorkspaceClient({
  totalNotes,
  totalFiles,
  storageUsed,
  storageLimit,
  recentNotes,
}: Props) {
  const [lastSynced, setLastSynced] = useState(new Date());
  const [loading, setLoading] = useState(false);

  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
  }

  const storagePercent = Math.min(
    (storageUsed / storageLimit) * 100,
    100
  ).toFixed(1);

  async function refresh() {
    setLoading(true);
    location.reload();
  }

  return (
    <main className="p-10 bg-slate-50 dark:bg-[#050505] min-h-screen">

      {/* Header */}
      <div className="flex justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
            <Clock size={14} />
            Last synced: {lastSynced.toLocaleTimeString()}
          </div>
          <h1 className="text-4xl italic font-serif">Workspace</h1>
        </div>

        <button
          onClick={refresh}
          className="flex items-center gap-2 px-5 py-3 border rounded-xl bg-white dark:bg-neutral-900"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <StatBox label="Total Notes" value={totalNotes} />
        <StatBox label="Total Files" value={totalFiles} />
        <StatBox label="Storage Used" value={formatBytes(storageUsed)} />
      </div>

      {/* Storage Bar */}
      <div className="mb-12">
        <div className="flex justify-between text-xs mb-2">
          <span>Storage Usage</span>
          <span>{storagePercent}%</span>
        </div>
        <div className="h-2 bg-neutral-200 rounded-full">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${storagePercent}%` }}
          />
        </div>
      </div>

      {/* Recent Notes */}
      <h2 className="text-sm uppercase tracking-widest font-bold mb-4">
        Recent Notes
      </h2>

      <div className="space-y-3">
        {recentNotes.map((note) => (
          <Link
            key={note.id}
            href={`/notes/${note.id}`}
            className="block p-4 bg-white dark:bg-neutral-900 border rounded-xl hover:border-blue-500"
          >
            {note.title || "Untitled"}
          </Link>
        ))}
      </div>
    </main>
  );
}

function StatBox({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border">
      <p className="text-xs uppercase text-neutral-400 mb-2">{label}</p>
      <p className="text-2xl">{value}</p>
    </div>
  );
}
