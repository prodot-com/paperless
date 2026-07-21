"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Clock,
  Database,
  FilePlus2,
  FileText,
  HardDrive,
  Plus,
  Search,
  ShieldCheck,
  Upload,
  User,
  X,
} from "lucide-react";

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
    name?: string;
    email?: string;
    image?: string;
    id: string;
  };
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

const MAX_STORAGE = 1024 * 1024 * 1024;

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
  return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 1)} ${sizes[index]}`;
}

export default function Workspace({
  totalNotes,
  totalFiles,
  storageUsed,
  recentNotes,
  recentFiles,
  session,
}: Props) {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const storagePercent = Math.min((storageUsed / MAX_STORAGE) * 100, 100);
  const firstName = session?.name?.trim().split(" ")[0] || "there";

  const handleSearch = () => {
    const query = search.trim();
    if (!query) return;
    router.push(`/dashboard/notes?q=${encodeURIComponent(query)}`);
  };

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      const target = event.target;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable);

      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey && !isTyping) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FAFAFA] font-sans text-neutral-900 selection:bg-blue-500/25 dark:bg-[#0A0A0A] dark:text-neutral-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.22, 0.38, 0.22] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -left-[20%] -top-[22%] h-[48rem] w-[48rem] rounded-full bg-blue-400/20 blur-[140px] dark:bg-blue-600/10"
        />
        <motion.div
          animate={{ scale: [1, 1.14, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 23, repeat: Infinity, ease: "linear" }}
          className="absolute -right-[20%] top-[35%] h-[40rem] w-[40rem] rounded-full bg-indigo-400/15 blur-[140px] dark:bg-indigo-600/10"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-5 py-6 sm:px-8 md:gap-10 md:px-10 md:py-10 lg:px-16 lg:py-14">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <div className="relative shrink-0">
              <div className="absolute -inset-1 rounded-[1.35rem] bg-linear-to-br from-blue-500/55 to-indigo-500/50 blur-md" />
              {session?.image ? (
                <img
                  src={session.image}
                  alt="Profile"
                  className="relative h-14 w-14 rounded-[1.15rem] border-2 border-white object-cover shadow-lg dark:border-neutral-800 sm:h-20 sm:w-20"
                />
              ) : (
                <div className="relative flex h-14 w-14 items-center justify-center rounded-[1.15rem] border-2 border-white bg-linear-to-br from-white to-neutral-100 font-serif text-xl text-neutral-700 shadow-lg dark:border-neutral-700 dark:from-neutral-800 dark:to-neutral-900 dark:text-neutral-300 sm:h-16 sm:w-16 sm:text-2xl">
                  {session?.email?.charAt(0).toUpperCase() || <User size={23} />}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#FAFAFA] bg-emerald-500 dark:border-[#0A0A0A]">
                <Check size={9} strokeWidth={3} className="text-white" />
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                Your workspace
              </p>
              <h1 className="mt-1 font-serif text-3xl tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
                Welcome, <span className="italic">{firstName}</span>
              </h1>
              <p className="mt-1 truncate text-sm text-neutral-500 dark:text-neutral-400">
                {session?.email || "Your ideas and files, all in one place."}
              </p>
            </div>
          </div>

          <div className="w-full lg:w-auto">
            <div className={`relative rounded-2xl transition-all duration-300 ${isFocused ? "scale-[1.01] ring-4 ring-blue-500/15" : "hover:scale-[1.005]"}`}>
              <div className={`absolute inset-0 rounded-2xl border bg-white/70 shadow-sm backdrop-blur-xl transition-colors dark:bg-neutral-900/70 ${isFocused ? "border-blue-500/50" : "border-neutral-200/80 dark:border-neutral-800"}`} />
              <div className="relative flex items-center px-2 py-1.5 sm:w-[360px]">
                <Search size={18} className={`ml-2.5 shrink-0 transition-colors ${isFocused ? "text-blue-500" : "text-neutral-400"}`} />
                <input
                  ref={searchInputRef}
                  value={search}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(event) => event.key === "Enter" && handleSearch()}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search notes…"
                  className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm font-medium text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white"
                />
                <AnimatePresence initial={false}>
                  {search ? (
                    <motion.button
                      type="button"
                      aria-label="Clear search"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setSearch("")}
                      className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
                    >
                      <X size={14} />
                    </motion.button>
                  ) : (
                    <kbd className="mr-1.5 hidden rounded-md border border-neutral-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-neutral-400 sm:block dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-500">
                      /
                    </kbd>
                  )}
                </AnimatePresence>
                <button
                  type="button"
                  onClick={handleSearch}
                  aria-label="Search notes"
                  className={`ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${search.trim() ? "bg-neutral-900 text-white shadow-sm hover:opacity-80 dark:bg-white dark:text-black" : "pointer-events-none bg-neutral-100 text-neutral-300 dark:bg-neutral-800 dark:text-neutral-600"}`}
                >
                  <ArrowRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]"
        >
          <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[1.75rem] border border-neutral-200/80 bg-white/70 p-6 shadow-lg shadow-neutral-200/20 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/65 dark:shadow-none sm:p-7">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                <ShieldCheck size={14} />
                Personal knowledge hub
              </div>
              <h2 className="mt-3 max-w-xl font-serif text-2xl tracking-tight text-neutral-800 sm:text-3xl dark:text-white">
                Your work is organized, protected, and ready when you are.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                Capture a thought, store a document, or pick up where you left off.
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-3 rounded-[1.75rem] border border-neutral-200/80 bg-white/70 p-3 shadow-sm backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/65">
            <QuickAction href="/dashboard/notes" icon={<FilePlus2 size={18} />} label="New note" />
            <QuickAction href="/dashboard/upload" icon={<Upload size={18} />} label="Add file" subtle />
          </motion.div>
        </motion.section>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 md:grid-cols-3"
        >
          <motion.div variants={itemVariants}>
            <StatCard label="Active notes" value={totalNotes} icon={<FileText size={18} />} accent="blue" detail="Your writing archive" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard label="Vault assets" value={totalFiles} icon={<HardDrive size={18} />} accent="emerald" detail="Files stored securely" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StorageCard storageUsed={storageUsed} storagePercent={storagePercent} />
          </motion.div>
        </motion.section>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-7 lg:grid-cols-2 lg:gap-8"
        >
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <SectionHeader title="Recent notes" href="/dashboard/notes" label="Open archive" />
            <div className="space-y-3">
              {recentNotes.length ? (
                recentNotes.map((note, index) => (
                  <Link
                    key={note.id}
                    href={`/dashboard/notes?id=${note.id}`}
                    className="group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/70 p-3.5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500/30 hover:shadow-md dark:border-neutral-800/80 dark:bg-neutral-900/60"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 text-blue-500 dark:border-neutral-800 dark:bg-neutral-800/70">
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-neutral-700 transition-colors group-hover:text-neutral-900 dark:text-neutral-300 dark:group-hover:text-white">
                        {note.title || "Untitled draft"}
                      </p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Note {recentNotes.length - index}
                      </p>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 dark:bg-neutral-800 dark:text-neutral-400">
                      <ChevronRight size={16} />
                    </div>
                  </Link>
                ))
              ) : (
                <EmptyState icon={<FileText size={22} />} title="No notes yet" message="Start with a fresh page and build your archive." actionHref="/dashboard/notes" actionLabel="Create note" />
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <SectionHeader title="Recent files" href="/dashboard/upload" label="Open vault" />
            <div className="space-y-3">
              {recentFiles.length ? (
                recentFiles.map((file, index) => (
                  <Link
                    key={`${file.name}-${index}`}
                    href="/dashboard/upload"
                    className="group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/70 p-3.5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-md dark:border-neutral-800/80 dark:bg-neutral-900/60"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 text-emerald-500 dark:border-neutral-800 dark:bg-neutral-800/70">
                      <HardDrive size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-neutral-700 transition-colors group-hover:text-neutral-900 dark:text-neutral-300 dark:group-hover:text-white">
                        {file.name}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        <Clock size={11} /> Recently added
                      </p>
                    </div>
                    <ArrowUpRight size={16} className="text-neutral-300 transition-colors group-hover:text-emerald-500 dark:text-neutral-600" />
                  </Link>
                ))
              ) : (
                <EmptyState icon={<HardDrive size={22} />} title="Your vault is empty" message="Bring documents, images, and files into one secure place." actionHref="/dashboard/upload" actionLabel="Upload file" />
              )}
            </div>
          </motion.div>
        </motion.section>
      </div>
    </main>
  );
}

function QuickAction({ href, icon, label, subtle = false }: { href: string; icon: ReactNode; label: string; subtle?: boolean }) {
  return (
    <Link href={href} className={`flex min-w-28 flex-1 flex-col items-center justify-center gap-2 rounded-2xl px-4 py-4 text-xs font-semibold transition-all sm:min-w-32 ${subtle ? "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800" : "bg-neutral-900 text-white shadow-sm hover:opacity-85 dark:bg-white dark:text-black"}`}>
      {icon}
      {label}
    </Link>
  );
}

function StatCard({ label, value, icon, accent, detail }: { label: string; value: string | number; icon: ReactNode; accent: "blue" | "emerald"; detail: string }) {
  const iconClass = accent === "blue" ? "text-blue-500 bg-blue-50 dark:bg-blue-500/10" : "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/70 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800/80 dark:bg-neutral-900/65">
      <div className={`absolute -right-7 -top-7 h-24 w-24 rounded-full opacity-50 blur-2xl ${accent === "blue" ? "bg-blue-500/15" : "bg-emerald-500/15"}`} />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-neutral-400">{label}</p>
          <p className="mt-3 font-serif text-4xl tracking-tight text-neutral-900 dark:text-white">{value}</p>
          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">{detail}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>{icon}</div>
      </div>
    </div>
  );
}

function StorageCard({ storageUsed, storagePercent }: { storageUsed: number; storagePercent: number }) {
  const nearLimit = storagePercent >= 80;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/70 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800/80 dark:bg-neutral-900/65">
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-neutral-400">Storage used</p>
          <p className="mt-3 font-serif text-3xl tracking-tight text-neutral-900 dark:text-white">{formatBytes(storageUsed)}</p>
          <p className={`mt-2 text-xs ${nearLimit ? "text-amber-600 dark:text-amber-400" : "text-neutral-500 dark:text-neutral-400"}`}>{storagePercent.toFixed(2)}% of 1 GB available</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-500/10">
          <Database size={18} />
        </div>
      </div>
      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
        <motion.div initial={{ width: 0 }} animate={{ width: `${storagePercent}%` }} transition={{ duration: 0.8, ease: "easeOut" }} className={`h-full rounded-full ${nearLimit ? "bg-amber-500" : "bg-linear-to-r from-blue-500 to-emerald-500"}`} />
      </div>
    </div>
  );
}

function SectionHeader({ title, href, label }: { title: string; href: string; label: string }) {
  return (
    <div className="flex items-center justify-between px-1">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">Keep moving</p>
        <h2 className="mt-1 font-serif text-2xl tracking-tight text-neutral-800 dark:text-neutral-100">{title}</h2>
      </div>
      <Link href={href} className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-neutral-500 transition-colors hover:bg-white hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white">
        <span className="hidden sm:inline">{label}</span>
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

function EmptyState({ icon, title, message, actionHref, actionLabel }: { icon: ReactNode; title: string; message: string; actionHref: string; actionLabel: string }) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-white/45 px-6 py-8 text-center backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/35">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500">{icon}</div>
      <h3 className="font-serif text-lg text-neutral-700 dark:text-neutral-300">{title}</h3>
      <p className="mt-1 max-w-xs text-sm leading-6 text-neutral-400 dark:text-neutral-500">{message}</p>
      <Link href={actionHref} className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
        <Plus size={14} />
        {actionLabel}
      </Link>
    </div>
  );
}
