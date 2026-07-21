"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  FileText,
  HardDrive,
  Home,
  LogOut,
  Moon,
  Plus,
  Settings,
  Sun,
  Upload,
} from "lucide-react";
import { useTheme } from "next-themes";
import Logo from "@/lib/logo";

type DashboardSession = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

type NavItem = {
  href: string;
  label: string;
  mobileLabel: string;
  icon: ReactNode;
  matches: (pathname: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Workspace",
    mobileLabel: "Home",
    icon: <Home size={18} />,
    matches: (pathname) => pathname === "/dashboard",
  },
  {
    href: "/dashboard/notes",
    label: "Notes archive",
    mobileLabel: "Notes",
    icon: <FileText size={18} />,
    matches: (pathname) => pathname.startsWith("/dashboard/notes"),
  },
  {
    href: "/dashboard/upload",
    label: "Vault assets",
    mobileLabel: "Vault",
    icon: <Upload size={18} />,
    matches: (pathname) => pathname.startsWith("/dashboard/upload"),
  },
  {
    href: "/dashboard/settings",
    label: "Preferences",
    mobileLabel: "Settings",
    icon: <Settings size={18} />,
    matches: (pathname) => pathname.startsWith("/dashboard/settings"),
  },
];

const MAX_STORAGE = 1024 * 1024 * 1024;

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export default function Dashboard({
  session,
  storageUsed,
  children,
}: {
  session?: DashboardSession | null;
  storageUsed: number;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const storagePercent = Math.min((storageUsed / MAX_STORAGE) * 100, 100);
  const nearLimit = storagePercent >= 80;
  const userName = session?.user?.name || "Your account";
  const userEmail = session?.user?.email || "paperless workspace";
  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  useEffect(() => {
    const handleThemeShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "j") {
        event.preventDefault();
        setTheme(isDark ? "light" : "dark");
      }
    };

    window.addEventListener("keydown", handleThemeShortcut);
    return () => window.removeEventListener("keydown", handleThemeShortcut);
  }, [isDark, setTheme]);

  const activeItem = NAV_ITEMS.find((item) => item.matches(pathname));

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] text-neutral-900 transition-colors duration-300 dark:bg-[#0A0A0A] dark:text-neutral-100">
      <aside className="sticky top-0 z-30 hidden h-screen w-[17.5rem] shrink-0 flex-col border-r border-neutral-200/80 bg-white/80 px-4 py-5 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-[#0D0D0D]/85 md:flex">
        <Link href="/dashboard" className="group flex items-center gap-3 rounded-2xl px-3 py-2 text-neutral-900 dark:text-white">
          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-blue-500/15 blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <Logo className="relative h-8 w-8 rotate-10 text-black transition-transform duration-300 group-hover:rotate-0 dark:text-white" />
          </div>
          <div>
            <p className="font-serif text-xl font-bold italic tracking-tight">paperless</p>
            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-400">Personal workspace</p>
          </div>
        </Link>

        <Link href="/dashboard/notes" className="group mt-7 flex items-center gap-3 rounded-xl bg-neutral-900 px-3.5 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-85 dark:bg-white dark:text-black">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/15 dark:bg-black/10">
            <Plus size={16} className="transition-transform duration-300 group-hover:rotate-90" />
          </span>
          Create a note
          <ArrowUpRight size={15} className="ml-auto opacity-70" />
        </Link>

        <nav className="mt-8 flex-1 space-y-1.5">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">Navigate</p>
          {NAV_ITEMS.map((item) => (
            <DesktopNavItem key={item.href} item={item} active={item.matches(pathname)} />
          ))}
        </nav>

        <div className="space-y-3 pt-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-neutral-200/80 bg-white/70 px-3.5 py-3 text-left text-neutral-500 shadow-sm transition-colors hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-white"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
              {isDark ? <Moon size={15} /> : <Sun size={15} />}
            </span>
            <span className="flex-1 text-xs font-semibold" suppressHydrationWarning>
              {isDark ? "Dark appearance" : "Light appearance"}
            </span>
            <kbd className="rounded border border-neutral-200 bg-white px-1.5 py-0.5 text-[9px] font-bold text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-500">⌘J</kbd>
          </button>

          <section className="rounded-2xl border border-neutral-200/80 bg-white/60 p-4 shadow-sm backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/55">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                <HardDrive size={13} />
                Storage
              </div>
              <span className={`text-[10px] font-bold ${nearLimit ? "text-amber-600 dark:text-amber-400" : "text-green-500 dark:text-green-400"}`}>
                {storagePercent.toFixed(2)}%
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold text-neutral-700 dark:text-neutral-200">{formatBytes(storageUsed)} <span className="font-normal text-neutral-400">of 1 GB</span></p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${storagePercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${nearLimit ? "bg-amber-500" : "bg-linear-to-r from-blue-500 to-emerald-500"}`}
              />
            </div>
          </section>

          <div className="group flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white/70 p-2.5 shadow-sm transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/65 dark:hover:border-neutral-700">
            {session?.user?.image ? (
              <img src={session.user.image} alt="Profile" className="h-9 w-9 shrink-0 rounded-xl border border-neutral-100 object-cover dark:border-neutral-800" />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-[11px] font-bold text-white dark:bg-white dark:text-black">
                {initials || "P"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-neutral-800 dark:text-neutral-200">{userName}</p>
              <p className="mt-0.5 truncate text-[10px] text-neutral-400 dark:text-neutral-500">{userEmail}</p>
            </div>
            <button type="button" aria-label="Sign out" title="Sign out" onClick={() => signOut({ callbackUrl: "/" })} className="rounded-lg cursor-pointer p-2 text-neutral-300 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:text-neutral-600 dark:hover:bg-rose-500/10">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200/80 bg-white/75 px-5 py-4 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-[#0D0D0D]/75 md:hidden">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Logo className="h-7 w-7 rotate-10 text-black dark:text-white" />
            <div>
              <p className="font-serif text-lg font-bold italic tracking-tight">paperless</p>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-neutral-400">{activeItem?.label || "Workspace"}</p>
            </div>
          </Link>
          <button type="button" aria-label="Toggle theme" onClick={toggleTheme} className="rounded-xl border border-neutral-200 bg-white p-2.5 text-neutral-500 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
            {isDark ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </header>

        <main className="relative min-h-0 flex-1 pb-24 md:pb-0">{children}</main>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-white/90 p-1.5 shadow-xl shadow-neutral-900/10 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/90 dark:shadow-black/30 md:hidden">
        {NAV_ITEMS.map((item) => (
          <MobileNavItem key={item.href} item={item} active={item.matches(pathname)} />
        ))}
        <button type="button" aria-label="Sign out" onClick={() => signOut({ callbackUrl: "/" })} className="flex min-w-13 flex-col items-center gap-1 rounded-xl px-2 py-2 text-neutral-400 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10">
          <LogOut size={18} />
          <span className="text-[9px] font-semibold">Exit</span>
        </button>
      </nav>
    </div>
  );
}

function DesktopNavItem({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link href={item.href} className="group relative block">
      <div className={`relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition-colors ${active ? "text-neutral-900 dark:text-white" : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"}`}>
        {active && <motion.div layoutId="desktop-nav-active" className="absolute inset-0 rounded-xl border border-neutral-200 bg-neutral-100 shadow-sm dark:border-neutral-700 dark:bg-neutral-800" transition={{ type: "spring", stiffness: 350, damping: 30 }} />}
        <span className={`relative z-10 transition-transform duration-300 ${active ? "scale-105 text-blue-500" : "group-hover:scale-105"}`}>{item.icon}</span>
        <span className="relative z-10 flex-1 font-medium">{item.label}</span>
        {active && <ChevronDot />}
      </div>
    </Link>
  );
}

function MobileNavItem({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link href={item.href} className={`relative flex min-w-13 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[9px] font-semibold transition-colors ${active ? "text-white dark:text-black" : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"}`}>
      {active && <motion.div layoutId="mobile-nav-active" className="absolute inset-0 rounded-xl bg-neutral-900 shadow-sm dark:bg-white" transition={{ type: "spring", stiffness: 350, damping: 30 }} />}
      <span className="relative z-10">{item.icon}</span>
      <span className="relative z-10">{item.mobileLabel}</span>
    </Link>
  );
}

function ChevronDot() {
  return <span className="relative z-10 h-1.5 w-1.5 rounded-full bg-blue-500" />;
}
