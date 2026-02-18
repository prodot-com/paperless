"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Note from "@/lib/logo";
import { Sun, Moon, X, ArrowRight, ShieldCheck, Github, GithubIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image"; // Added for optimized image rendering
import Link from "next/link";

const Landing = () => {
  const [loginModal, setLoginModal] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.contains("dark")
      ? html.classList.remove("dark")
      : html.classList.add("dark");
  };

  const manageSignin = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      setLoginModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0a0a0a] text-[#1A1A1A] dark:text-neutral-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900 overflow-x-hidden transition-colors duration-300">
      <div className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 w-[140%] h-[400px] bg-gradient-to-b from-orange-400 via-blue-400 to-transparent dark:from-orange-600 dark:via-blue-600" />
      </div>
      
      <div className="fixed inset-0 z-0 opacity-20 dark:opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" className="fill-black dark:fill-white" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <nav className="z-20 fixed flex justify-between items-center px-5 md:px-8 py-4 md:py-6 backdrop-blur-md sticky top-0 transition-colors">
        <div 
          className="flex items-center gap-3 md:gap-2 group cursor-pointer relative" 
          onClick={() => router.push('/')}
        >
          <div className="relative flex items-center justify-center">
            
            <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 scale-150" />
            
            <Note className="relative z-10 text-2xl md:text-3xl text-neutral-900 dark:text-white" />
          </div>

          <div className="flex flex-col items-start leading-none">
            <span className="text-lg md:text-xl font-bold tracking-[-0.03em] uppercase text-neutral-900 dark:text-white ">
              paperless
            </span>
          </div>

        </div>
        
        <div className="flex items-center gap-4 md:gap-6 justify-center">
          <button 
            className="p-2 cursor-pointer border border-neutral-200 dark:border-neutral-800 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            onClick={toggleTheme}
          >
            <Sun className="h-5 w-5 dark:hidden" />
            <Moon className="h-5 w-5 hidden dark:block" />
          </button>
          <Link 
          href="https://github.com/prodot-com/paperless"
          target="_blank"
          className="cursor-pointer bg-[#1A1A1A] dark:bg-white text-white dark:text-black p-2 rounded-full hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-all shadow-sm active:scale-95"
          >
            <Github className="h-6 w-6 "/>
          </Link>
          <button 
            onClick={manageSignin}
            className="cursor-pointer bg-[#1A1A1A] dark:bg-white text-white dark:text-black px-5 py-3 md:py-2.5 rounded-full text-xs md:text-sm font-medium hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-sm active:scale-95"
          >
            {session ? "Go" : "Sign in"}
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto pt-16 md:pt-28 pb-16 md:pb-24 px-6">
        <div className="flex flex-col items-center text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-3 px-4 text-4xl sm:text-6xl md:text-8xl font-light tracking-tight leading-[1.2] md:leading-[1.1] text-neutral-900 dark:text-white w-full md:w-auto"
          >
            Thoughts, filed <br />
            <span className="font-serif italic text-neutral-400 dark:text-neutral-500 underline decoration-blue-500/20 underline-offset-8">effortlessly.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 max-w-2xl text-lg md:text-xl text-neutral-500 dark:text-neutral-400 font-light leading-relaxed px-2"
          >
            The minimalist digital vault for your intellectual property. 
            Store notes and assets in a distraction-free, high-fidelity environment.
          </motion.p>

          <div className="mt-10 md:mt-14 group relative w-full md:w-auto flex justify-center">
            <button 
              className="cursor-pointer relative z-10 w-full md:w-auto bg-black dark:bg-white text-white dark:text-black px-10 py-4 rounded-xl text-base md:text-lg font-medium hover:opacity-80 transition-all duration-500 flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/10 active:scale-95"
              onClick={manageSignin}
            >
              Enter the Vault
              <ArrowRight size={20} />
            </button>
            <div className="absolute inset-0 bg-blue-400/20 blur-3xl -z-10 group-hover:bg-blue-400/30 transition-all"></div>
          </div>
        </div>

      <div className="mt-24 md:mt-40 relative max-w-7xl md:max-w-6xl mx-auto md:px-4">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full aspect-video bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-none overflow-hidden"
          >

          <Image
            src="/light.png"
            alt="Paperless Dashboard Interface"
            fill
            className="object-contain p-1 md:p-2 dark:hidden"
            priority
          />

          <Image
            src="/dark.png"
            alt="Paperless Dashboard Interface Dark"
            fill
            className="object-contain p-1 md:p-2 hidden dark:block"
            priority
          />

            {/* <div className="absolute top-0 left-0 right-0 h-12 bg-white/20 dark:bg-black/20 backdrop-blur-md border-b border-white/10 dark:border-white/5 pointer-events-none flex items-center px-6">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/50" />
              </div>
            </div> */}
          </motion.div>
      </div>
      </main>

      <AnimatePresence>
        {loginModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLoginModal(false)}
              className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl p-10 overflow-hidden"
            >
              <button 
                onClick={() => setLoginModal(false)}
                className="absolute top-6 right-6 cursor-pointer text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 mb-6 bg-neutral-50 dark:bg-neutral-800 rounded-2xl flex items-center justify-center border border-neutral-100 dark:border-neutral-700 shadow-inner">
                  <Note className="text-3xl text-neutral-900 dark:text-white" />
                </div>
                
                <h2 className="text-2xl font-medium tracking-tight mb-2 italic font-serif">Welcome back</h2>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-8 leading-relaxed">
                  Your digital workspace is synced and ready.
                </p>

                <button
                  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                  className="cursor-pointer w-full flex items-center justify-center gap-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 py-4 px-4 rounded-xl font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all shadow-sm group active:scale-95"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.16H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.84l3.66-2.75z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.16l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="font-medium">Continue with Google</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    <footer className="relative w-full bg-white dark:bg-[#0a0a0a] overflow-hidden transition-colors">
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 pt-10 px-4">
        {[
          { label: "Github", href: "https://github.com/prodot-com/paperless" },
          { label: "Contact", href: "https://probalghosh.dev" },
          { label: "Documentation", href: "https://github.com/prodot-com/paperless/blob/main/README.md" },
          { label: "License", href: "https://github.com/prodot-com/paperless/tree/main?tab=GPL-3.0-1-ov-file#readme" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="group relative px-5 py-2 transition-all duration-300 active:scale-95"
          >
            <span className="relative z-10 text-[10px] md:text-xs uppercase tracking-[0.15em] text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
              {link.label}
            </span>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-1px bg-blue-500 transition-all duration-300 group-hover:w-1/3 opacity-50" />
          </a>
        ))}
      </div>

      <p className="mt-5 text-center text-xs md:text-sm text-gray-500 dark:text-neutral-600">
        Build by{" "}
        <a 
        href="https://probalghosh.dev"
        target="_blank">
          <span className="font-bold hover:underline cursor-pointer">Probal</span>
        </a>
      </p>
      <p className="mt-5 text-center text-xs md:text-sm text-gray-500 dark:text-neutral-600">
        © 2026 Notes Buddy. All rights reserved.
      </p>

      <div className="pointer-events-none select-none mt-5 text-center">
        <h1 className="text-[4rem] sm:text-[8rem] md:text-[14rem] font-extrabold text-gray-200 dark:text-neutral-900 leading-none mb-1">
          paperless<span className="text-indigo-600 font-normal">.</span>
        </h1>
        <div className="absolute bottom-0 w-full bg-linear-to-t from-gray-500/20 dark:from-neutral-900/40 via-transparent to-transparent h-5"></div>
      </div>
    </footer>
    </div>
  );
};

export default Landing;