"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Check,
  HardDrive,
  LockKeyhole,
  Monitor,
  Moon,
  Palette,
  ShieldCheck,
  Sun,
  UserRound,
} from "lucide-react";
import DeleteComponent from "./deleteComponent";

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

const MAX_STORAGE = 1024 * 1024 * 1024;

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes.length - 1,
  );
  return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 1)} ${sizes[index]}`;
}

export default function SettingsClient({
  session,
  storageUsed,
  totalFiles,
  totalNotes,
}: Props) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const selectedTheme = mounted ? theme || "system" : "system";
  const isDark = mounted ? resolvedTheme === "dark" : false;
  const storagePercent = Math.min((storageUsed / MAX_STORAGE) * 100, 100);
  const nearLimit = storagePercent >= 80;
  const name = session?.name || "Your account";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FAFAFA] text-neutral-900 dark:bg-[#0A0A0A] dark:text-neutral-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          className="absolute -right-[15%] -top-[25%] h-[42rem] w-[42rem] rounded-full bg-blue-400/15 blur-[140px] dark:bg-blue-600/10"
        />
        <div className="absolute -bottom-[30%] -left-[15%] h-[34rem] w-[34rem] rounded-full bg-indigo-400/10 blur-[130px] dark:bg-indigo-600/10" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-8 sm:px-8 md:px-10 md:py-12 lg:px-16 lg:py-14">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: "easeOut" }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              <SettingsMark />
              Workspace preferences
            </div>
            <h1 className="mt-3 font-serif text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
              Make it <span className="italic">yours</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
              Manage how Paperless looks, how your workspace is protected, and
              the capacity available to your archive.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full border border-neutral-200/80 bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500 shadow-sm backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-400 sm:self-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Account secure
          </div>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.42, ease: "easeOut" }}
          className="mt-9 overflow-hidden rounded-[1.75rem] border border-neutral-200/80 bg-white/70 p-5 shadow-lg shadow-neutral-200/20 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/65 dark:shadow-none sm:p-7"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="relative shrink-0">
                <div className="absolute -inset-1 rounded-[1.3rem] bg-blue-500/15 blur-md" />
                {session?.image ? (
                  <img
                    src={session.image}
                    alt="Profile"
                    className="relative h-16 w-16 rounded-[1.1rem] border-2 border-white object-cover shadow-lg dark:border-neutral-800 sm:h-20 sm:w-20"
                  />
                ) : (
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-[1.1rem] border-2 border-white bg-linear-to-br from-white to-neutral-100 font-serif text-xl text-neutral-700 shadow-lg dark:border-neutral-700 dark:from-neutral-800 dark:to-neutral-900 dark:text-neutral-300 sm:h-20 sm:w-20 sm:text-2xl">
                    {initials || "P"}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500 dark:border-neutral-900">
                  <Check size={11} strokeWidth={3} className="text-white" />
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                  Account
                </p>
                <h2 className="mt-1 truncate font-serif text-2xl tracking-tight text-neutral-800 dark:text-white">
                  {name}
                </h2>
                <p className="mt-1 truncate text-sm text-neutral-500 dark:text-neutral-400">
                  {session?.email || "Signed in to Paperless"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start rounded-xl bg-emerald-50 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 sm:self-auto">
              <ShieldCheck size={14} />
              Verified sign-in
            </div>
          </div>
        </motion.section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.72fr)]">
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.42, ease: "easeOut" }}
          >
            <SectionHeading
              icon={<Palette size={15} />}
              eyebrow="Appearance"
              title="Choose your working mood"
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {mounted && (
                <>
                  <ThemeCard
                    label="Light"
                    description="Bright and crisp"
                    active={selectedTheme === "light"}
                    icon={<Sun size={19} />}
                    onClick={() => setTheme("light")}
                    preview="light"
                  />

                  <ThemeCard
                    label="Dark"
                    description="Easy on the eyes"
                    active={selectedTheme === "dark"}
                    icon={<Moon size={19} />}
                    onClick={() => setTheme("dark")}
                    preview="dark"
                  />

                  <ThemeCard
                    label="System"
                    description="Follows your device"
                    active={selectedTheme === "system"}
                    icon={<Monitor size={19} />}
                    onClick={() => setTheme("system")}
                    preview={isDark ? "dark" : "light"}
                  />
                </>
              )}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.42, ease: "easeOut" }}
          >
            <SectionHeading
              icon={<LockKeyhole size={15} />}
              eyebrow="Security"
              title="Protected by default"
            />
            <div className="mt-4 rounded-2xl border border-neutral-200/80 bg-white/65 p-5 shadow-sm backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/60">
              <SecurityRow
                title="Private by default"
                detail="Only you can access your notes and vault."
              />
              <SecurityRow
                title="Encrypted transfer"
                detail="Files are handled over a secure connection."
              />
              <SecurityRow
                title="Verified identity"
                detail="Your sign-in provider protects account access."
                last
              />
            </div>
          </motion.section>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.42, ease: "easeOut" }}
          className="mt-10"
        >
          <SectionHeading
            icon={<HardDrive size={15} />}
            eyebrow="Storage"
            title="Your archive capacity"
          />
          <div className="mt-4 overflow-hidden rounded-[1.75rem] border border-neutral-200/80 bg-white/70 shadow-lg shadow-neutral-200/20 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/65 dark:shadow-none">
            <div className="p-6 sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                    Storage used
                  </p>
                  <p className="mt-2 font-serif text-4xl tracking-tight text-neutral-900 dark:text-white">
                    {formatBytes(storageUsed)}
                  </p>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    of {formatBytes(MAX_STORAGE)} available in your workspace
                  </p>
                </div>
                <div
                  className={`rounded-xl px-3 py-2 text-xs font-semibold ${nearLimit ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"}`}
                >
                  {storagePercent.toFixed(1)}% used
                </div>
              </div>
              <div className="mt-7 h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${storagePercent}%` }}
                  transition={{ duration: 0.85, ease: "easeOut" }}
                  className={`h-full rounded-full ${nearLimit ? "bg-amber-500" : "bg-linear-to-r from-blue-500 to-emerald-500"}`}
                />
              </div>
            </div>
            <div className="grid border-t border-neutral-100 bg-neutral-50/55 dark:border-neutral-800 dark:bg-neutral-900/45 sm:grid-cols-2">
              <Metric
                label="Vault files"
                value={totalFiles}
                icon={<HardDrive size={17} />}
              />
              <Metric
                label="Saved notes"
                value={totalNotes}
                icon={<FileTextMark />}
                bordered
              />
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.42, ease: "easeOut" }}
          className="mt-10"
        >
          <SectionHeading
            icon={<UserRound size={15} />}
            eyebrow="Account"
            title="Account safety"
          />
          <div className="mt-4">
            <DeleteComponent />
          </div>
        </motion.section>
      </div>
    </main>
  );
}

function SettingsMark() {
  return (
    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-blue-500/40">
      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
    </span>
  );
}

function SectionHeading({
  icon,
  eyebrow,
  title,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
        {icon}
        {eyebrow}
      </p>
      <h2 className="mt-1 font-serif text-2xl tracking-tight text-neutral-800 dark:text-neutral-100">
        {title}
      </h2>
    </div>
  );
}

function ThemeCard({
  label,
  description,
  active,
  icon,
  onClick,
  preview,
}: {
  label: string;
  description: string;
  active: boolean;
  icon: ReactNode;
  onClick: () => void;
  preview: "light" | "dark";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${active ? "border-neutral-900 bg-neutral-900 text-white shadow-lg dark:border-white dark:bg-white dark:text-black" : "border-neutral-200 bg-white/70 text-neutral-700 shadow-sm hover:-translate-y-0.5 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-300 dark:hover:border-neutral-700"}`}
    >
      {active && (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-white/15 dark:bg-black/10">
          <Check size={13} />
        </span>
      )}
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${active ? "bg-white/15 dark:bg-black/10" : "bg-neutral-100 text-blue-500 dark:bg-neutral-800"}`}
      >
        {icon}
      </div>
      <div
        className={`mt-5 h-10 rounded-lg border p-1.5 ${preview === "dark" ? "border-white/10 bg-neutral-800" : "border-neutral-200 bg-neutral-50"}`}
      >
        <div
          className={`h-1.5 w-1/2 rounded-full ${preview === "dark" ? "bg-neutral-600" : "bg-neutral-300"}`}
        />
        <div
          className={`mt-1.5 h-1.5 w-3/4 rounded-full ${preview === "dark" ? "bg-neutral-700" : "bg-neutral-200"}`}
        />
      </div>
      <p className="mt-4 text-sm font-semibold">{label}</p>
      <p
        className={`mt-1 text-[11px] ${active ? "text-white/60 dark:text-black/55" : "text-neutral-400 dark:text-neutral-500"}`}
      >
        {description}
      </p>
    </button>
  );
}

function SecurityRow({
  title,
  detail,
  last = false,
}: {
  title: string;
  detail: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex gap-3 py-3 ${last ? "" : "border-b border-neutral-100 dark:border-neutral-800"}`}
    >
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10">
        <Check size={12} strokeWidth={3} />
      </span>
      <div>
        <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
          {title}
        </p>
        <p className="mt-0.5 text-[11px] leading-5 text-neutral-400 dark:text-neutral-500">
          {detail}
        </p>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  icon,
  bordered = false,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  bordered?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-6 py-5 sm:px-7 ${bordered ? "border-t border-neutral-100 dark:border-neutral-800 sm:border-l sm:border-t-0" : ""}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-blue-500 shadow-sm dark:bg-neutral-800">
        {icon}
      </span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
          {label}
        </p>
        <p className="mt-1 font-serif text-2xl text-neutral-800 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

function FileTextMark() {
  return <span className="text-lg leading-none">⌁</span>;
}
