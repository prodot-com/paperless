"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Note from "@/lib/logo";
import {
    FileText,
    Upload,
    Settings,
    Sun,
    Moon,
    LogOut,
    Home,
    ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard({
    session,
    storageUsed,
    children,
}: {
    session: any;
    storageUsed: number;
    children: React.ReactNode;
}) {
    const [isDark, setIsDark] = useState(false);
    const pathname = usePathname();

    const toggleTheme = () => {
        const html = document.documentElement;
        if (html.classList.contains("dark")) {
            html.classList.remove("dark");
            setIsDark(false);
        } else {
            html.classList.add("dark");
            setIsDark(true);
        }
    };

    const maxStorage = 1 * 1024 * 1024 * 1024;
    const percent = Math.min((storageUsed / maxStorage) * 100, 100);
    const roundedPercent = percent.toFixed(2);

    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#050505] text-[#1A1A1A] dark:text-neutral-100 flex flex-col md:flex-row transition-colors duration-500 selection:bg-blue-100">

            {/* --- DESKTOP SIDEBAR --- */}
            <aside className="hidden md:flex w-72 border-r border-neutral-100 dark:border-neutral-900 flex-col bg-white dark:bg-[#050505] sticky top-0 h-screen z-20">
              
                {/* Branding */}
                <div className="p-8 flex items-center gap-3 group cursor-default">
                    <div className="relative">
                        <Note className="text-3xl text-neutral-900 dark:text-white transition-transform group-hover:rotate-12" />
                        <div className="absolute -inset-1 bg-blue-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="font-serif italic text-xl tracking-tight">paperless</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1.5 mt-2">
                    <Link href="/dashboard" className="block">
                        <SidebarItem icon={<Home size={18} />} label="Workspace" active={pathname === "/dashboard"} />
                    </Link>
                    <Link href="/dashboard/notes" className="block">
                        <SidebarItem icon={<FileText size={18} />} label="Notes Archive" active={pathname.startsWith("/dashboard/notes")} />
                    </Link>
                    <Link href="/dashboard/upload" className="block">
                        <SidebarItem icon={<Upload size={18} />} label="Vault Assets" active={pathname.startsWith("/dashboard/upload")} />
                    </Link>
                    <Link href="/dashboard/settings" className="block">
                        <SidebarItem icon={<Settings size={18} />} label="System Prefs" active={pathname.startsWith("/dashboard/settings")} />
                    </Link>

                    <div className="pt-4 px-3">
                        <button
                            onClick={toggleTheme}
                            className="w-full cursor-pointer flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-all group"
                        >
                            <span className="text-xs font-bold uppercase tracking-widest">{isDark ? "Luminance" : "Obsidian"}</span>
                            {isDark ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                    </div>
                </nav>

                <div className="p-6 space-y-6">
                    <div className="bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-4">
                        <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 mb-3">
                            <span>Vault Load</span>
                            <span>{roundedPercent}%</span>
                        </div>
                        <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${percent}%` }}
                                className="h-full bg-blue-500" 
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 p-2 border border-neutral-100 dark:border-neutral-800 rounded-2xl bg-white dark:bg-[#0d0d0d] shadow-sm">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="relative shrink-0">
                                <img 
                                    src={session?.user?.image} 
                                    alt="profile" 
                                    className="w-9 h-9 rounded-xl object-cover grayscale hover:grayscale-0 transition-all" 
                                />
                                <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white dark:border-[#0d0d0d] w-3 h-3 rounded-full" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate">{session?.user?.name || "Probal Ghosh"}</p>
                                <p className="text-[10px] text-neutral-400 truncate flex items-center gap-1">
                                    {session?.user?.email}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => signOut({ callbackUrl: "/" })} 
                            className="p-2 cursor-pointer text-neutral-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            <header className="md:hidden flex items-center justify-between px-6 py-5 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-neutral-100 dark:border-neutral-900 sticky top-0 z-30">
                <div className="flex items-center gap-2">
                    <Note className="text-2xl" />
                    <span className="font-serif italic tracking-tight">paperless</span>
                </div>
                <button onClick={toggleTheme} className="p-2.5 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 text-neutral-500">
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </header>

            <main className="flex-1 overflow-y-auto pb-28 md:pb-0 relative">
                {children}
            </main>

            <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-50">
                <nav className="bg-white/80 dark:bg-black/80 backdrop-blur-2xl border border-neutral-200/50 dark:border-neutral-800/50 p-2 rounded-[2rem] shadow-2xl flex justify-between items-center px-4">
                    <MobileTab href="/dashboard" icon={<Home size={22} />} active={pathname === "/dashboard"} />
                    <MobileTab href="/dashboard/notes" icon={<FileText size={22} />} active={pathname.startsWith("/dashboard/notes")} />
                    <MobileTab href="/dashboard/upload" icon={<Upload size={22} />} active={pathname.startsWith("/dashboard/upload")} />
                    <MobileTab href="/dashboard/settings" icon={<Settings size={22} />} active={pathname.startsWith("/dashboard/settings")} />
                    <button onClick={() => signOut({ callbackUrl: "/" })} className="text-neutral-400 p-3 hover:text-red-500 transition-colors">
                        <LogOut size={22} />
                    </button>
                </nav>
            </div>
        </div>
    );
}

function SidebarItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
    return (
        <div className={`group cursor-pointer flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
            active 
            ? "bg-neutral-900 dark:bg-white text-white dark:text-black shadow-lg shadow-neutral-200 dark:shadow-none" 
            : "text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:text-neutral-900 dark:hover:text-white"
        }`}>
            <span className={`transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`}>
                {icon}
            </span>
            <span className="text-sm font-medium tracking-tight">{label}</span>
            {active && (
                <motion.div 
                    layoutId="sidebar-pill" 
                    className="ml-auto w-1 h-1 rounded-full bg-current" 
                />
            )}
        </div>
    );
}

function MobileTab({ href, icon, active }: { href: string; icon: React.ReactNode; active: boolean }) {
    return (
        <Link href={href} className={`relative p-3 rounded-2xl transition-all ${
            active ? "bg-black dark:bg-white text-white dark:text-black shadow-lg" : "text-neutral-400"
        }`}>
            {icon}
            {active && (
                <motion.div 
                    layoutId="mobile-dot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-current"
                />
            )}
        </Link>
    );
}