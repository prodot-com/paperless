"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Note from "@/lib/logo";
import { ArrowRight, X, Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";

const Landing = () => {
  const [loginModal, setLoginModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const manageSignin = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      setLoginModal(true);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F9F9F7] dark:bg-[#0A0A0A] text-[#1A1A1A] dark:text-[#EDEDED] font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900 transition-colors duration-500">
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 flex justify-between items-center
        px-6 py-3 rounded-xl backdrop-blur-xl bg-white/60 dark:bg-black/40 border border-black/15 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
        
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => router.push('/')}>
          <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center transition-transform group-hover:rotate-6">
            <Note className="text-white dark:text-black w-5 h-5" />
          </div>
          <span className="text-sm font-bold tracking-tighter uppercase text-black dark:text-white">paperless</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
          <Link href="https://github.com/prodot-com/paperless" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1.5 group">
            Developer <ArrowRight size={10} className="transition-transform group-hover:translate-x-1"/>
          </Link>
          <Link href="https://probalghosh.dev" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1.5 group">
            Company <ArrowRight size={10} className="transition-transform group-hover:translate-x-1"/>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-neutral-600 dark:text-neutral-400"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button 
            onClick={manageSignin}
            className="cursor-pointer bg-black dark:bg-white text-white dark:text-black px-5 py-2 rounded-xl text-xs font-bold hover:bg-indigo-600 dark:hover:bg-indigo-400 transition-all active:scale-95 shadow-lg shadow-black/10"
          >
            Vault
          </button>
        </div>
      </nav>

      <main className="relative pt-56 pb-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-32">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[100px] font-medium tracking-tight leading-[0.9] text-black dark:text-white mb-10"
          >
            Your thoughts, <br />
            <span className="font-serif italic text-neutral-300 dark:text-neutral-700">perfectly structured.</span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button 
              onClick={manageSignin}
              className="cursor-pointer group bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl text-lg font-semibold hover:pr-10 transition-all flex items-center gap-1 shadow-2xl shadow-black/20 dark:shadow-white/5"
            >
              Start Writing
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </main>

      <footer className="bg-white dark:bg-[#0A0A0A] border-t border-neutral-200 dark:border-white/5 pt-20 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
            <div className="max-w-sm">
              <div className="flex items-center gap-3 mb-6 group">
                <div className="w-10 h-10 bg-neutral-900 dark:bg-white rounded-2xl flex items-center justify-center transition-all group-hover:rotate-6">
                  <Note className="text-white dark:text-black w-6 h-6" />
                </div>
                <span className="font-extrabold tracking-tight uppercase text-xl text-neutral-900 dark:text-white leading-none">
                  Paperless
                </span>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-8 w-full md:w-auto">
              <div className="flex flex-wrap gap-x-10 gap-y-4">
                {[
                  { label: "Github", href: "https://github.com/prodot-com/paperless" },
                  { label: "Contact", href: "https://probalghosh.dev" },
                  { label: "License", href: "https://github.com/prodot-com/paperless/tree/main?tab=GPL-3.0-1-ov-file#readme" },
                  { label: "Documentation", href: "https://github.com/prodot-com/paperless/blob/main/README.md" },
                ].map((link) => (
                  <Link 
                    key={link.label}
                    href={link.href}
                    className="text-xs uppercase tracking-[0.18em] font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="text-center md:text-right w-full">
                <p className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
                  Built by <span className="text-neutral-900 dark:text-white font-semibold">Probal Ghosh</span>
                </p>
              </div>
            </div>
          </div>

          <div className="w-full relative text-center select-none overflow-hidden">
            <h2 className="text-[16vw] md:text-[12vw] font-black text-neutral-300 dark:text-neutral-800 leading-none tracking-tighter transition-colors duration-500">
              PAPERLESS<span className="text-indigo-600">.</span>
            </h2>
            <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-[#F9F9F7] dark:from-[#0A0A0A] via-transparent to-transparent" />
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {loginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setLoginModal(false)}
              className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-[#F9F9F7] dark:bg-[#111] rounded-[32px] shadow-2xl p-12 border border-white dark:border-white/10"
            >
              <button onClick={() => setLoginModal(false)} className="absolute top-8 right-8 text-neutral-400 hover:text-black dark:hover:text-white transition-colors"><X size={24} /></button>
              <div className="text-center">
                <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <Note className="text-3xl text-white dark:text-black" />
                </div>
                <h2 className="text-3xl font-medium tracking-tight mb-8 dark:text-white">Welcome to the Vault</h2>
                <button
                  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                  className="w-full flex items-center justify-center gap-4 bg-white dark:bg-neutral-900 border border-black/[0.05] dark:border-white/10 py-4 rounded-xl font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all text-black dark:text-white"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.16H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.84l3.66-2.75z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.16l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default Landing;