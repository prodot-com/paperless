"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Note from "@/lib/logo";
import { ArrowRight, Github, X, Sparkles, Layers, Shield, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

const Landing = () => {
  const [loginModal, setLoginModal] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const manageSignin = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      setLoginModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#1A1A1A] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 flex justify-between items-center
        px-6 py-3 rounded-2xl backdrop-blur-xl bg-white/60 border border-black/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
        
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => router.push('/')}>
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center transition-transform group-hover:rotate-6">
            <Note className="text-white w-5 h-5" />
          </div>
          <span className="text-sm font-bold tracking-tighter uppercase">paperless</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
          <Link href="https://github.com/prodot-com/paperless" className="hover:text-neutral-900 transition-colors flex items-center gap-1.5 group">
            Developer <ArrowRight size={10} className="transition-transform group-hover:translate-x-1"/>
          </Link>
          <Link href="https://probalghosh.dev" className="hover:text-neutral-900 transition-colors flex items-center gap-1.5 group">
            Company <ArrowRight size={10} className="transition-transform group-hover:translate-x-1"/>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={manageSignin}
            className="bg-black text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-black/10"
          >
            Enter Vault
          </button>
        </div>
      </nav>

      <main className="relative pt-44 pb-24 px-6 max-w-7xl mx-auto">
        
        <div className="flex flex-col items-center text-center mb-32">

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-[100px] font-medium tracking-tight leading-[0.9] text-black mb-10"
          >
            Your thoughts, <br />
            <span className="font-serif italic text-neutral-300">perfectly structured.</span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4"
          >
            <button 
              onClick={manageSignin}
              className="group bg-black text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:pr-10 transition-all flex items-center gap-3 shadow-2xl shadow-black/20"
            >
              Start Writing
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </main>

      <footer className="bg-white border-t border-neutral-200 pt-20">
        <div className="max-w-8xl mx-auto md:px-25 px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">

            <div className="max-w-sm">
              <div className="flex items-center gap-3 mb-6 group cursor-default">
                
                <div className="relative w-10 h-10 bg-neutral-900 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:rotate-6">
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-2xl" />
                  <Note className="relative text-white w-6 h-6" />
                </div>

                <div className="flex flex-col">
                  <span className="font-extrabold tracking-tight uppercase text-xl text-neutral-900 leading-none">
                    Paperless
                  </span>
                  <span className="text-xs text-neutral-400 tracking-wide mt-1">
                    Smart document storage
                  </span>
                </div>
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
                    target="_blank"
                    className="relative text-xs uppercase tracking-[0.18em] font-semibold text-neutral-500 transition-colors duration-300 hover:text-neutral-900"
                  >
                    {link.label}
                    <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-neutral-900 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}
              </div>
              
              <div className="text-center md:text-right w-full">
                <p className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
                  Built by <span className="text-neutral-900 font-semibold">Probal Ghosh</span>
                </p>
                <p className="text-xs uppercase tracking-widest text-neutral-300 mt-1">
                  © 2026 Paperless
                </p>
              </div>

            </div>
          </div>

          <div className="w-full relative text-center select-none">
            <h2 className="text-[17vw] md:text-[12vw] font-black text-neutral-500 leading-none tracking-tighter">
              PAPERLESS<span className="text-indigo-600">.</span>
            </h2>
            <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-white via-white/40 to-transparent" />
          </div>

        </div>
      </footer>

      <AnimatePresence>
        {loginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setLoginModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-[#F9F9F7] rounded-[32px] shadow-2xl p-12 overflow-hidden border border-white"
            >
              <button onClick={() => setLoginModal(false)} className="absolute top-8 right-8 text-neutral-400 hover:text-black transition-colors"><X size={24} /></button>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-black/20">
                  <Note className="text-3xl text-white" />
                </div>
                <h2 className="text-3xl font-medium tracking-tight mb-3">Welcome to the Vault</h2>
                <p className="text-neutral-500 mb-10 font-light">Your focus is waiting for you.</p>

                <button
                  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                  className="w-full flex items-center justify-center gap-4 bg-white border border-black/[0.05] py-4 rounded-2xl font-semibold hover:bg-neutral-50 transition-all shadow-sm active:scale-[0.98]"
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