"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Note from "@/lib/logo";
import { Sun,Moon, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { signIn } from "next-auth/react";

const Landing = () => {
  const [loginModal, setLoginModal] = useState(false);
  const router = useRouter();

  const toggleTheme = () => {
  const html = document.documentElement;
  html.classList.contains("dark")
    ? html.classList.remove("dark")
    : html.classList.add("dark");
  };


  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0a0a0a] text-[#1A1A1A] dark:text-neutral-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900 overflow-x-hidden transition-colors duration-300">
      
      <div className="fixed inset-0 z-0 opacity-20 dark:opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" className="fill-black dark:fill-white" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <nav className="relative z-20 flex justify-between items-center px-5 md:px-8 py-4 md:py-6 backdrop-blur-md bg-white/70 dark:bg-[#0a0a0a]/70 border-b border-neutral-100 dark:border-neutral-800 sticky top-0 transition-colors">
        <div className="flex items-center gap-2 md:gap-3 group cursor-pointer">
          <Note className="text-2xl md:text-3xl text-neutral-900 dark:text-white"/>
          <span className="text-lg md:text-xl font-medium tracking-tight group-hover:opacity-60 transition-opacity">paperless</span>
        </div>
        
        <div className="flex items-center gap-6 justify-center">
          <div className="border flex gap-1 p-2 border-neutral-500 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
          onClick={toggleTheme}
          >
            <Sun/>
          </div>
          <button 
            onClick={() => setLoginModal(true)}
            className="bg-[#1A1A1A] dark:bg-white text-white dark:text-black px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-sm"
          >
            Sign in
          </button>
        </div>
      </nav>

    
      <main className="relative z-10 max-w-6xl mx-auto pt-10 md:pt-23 pb-16 md:pb-20 px-6">
        <div className="flex flex-col items-center text-center">

          <h1 className="border-dashed border-2 py-3 px-4 md:py-1.5 md:px-5 text-4xl sm:text-6xl md:text-8xl font-light tracking-tight leading-[1.2] md:leading-[1.1] text-neutral-900 dark:text-white border-neutral-300 dark:border-neutral-800 bg-gray-400/10 backdrop-blur-[4px] w-full md:w-auto">
            Thoughts, filed <br />
            <span className="font-serif italic text-neutral-400 dark:text-neutral-500">effortlessly.</span>
          </h1>

          <p className="mt-6 md:mt-10 max-w-2xl text-lg md:text-xl text-neutral-500 dark:text-neutral-400 font-light leading-relaxed px-2">
            A frictionless interface for your notes and documents. 
            No distractions, just a clean canvas for your digital life.
          </p>

          <div className="mt-8 md:mt-12 group relative w-full md:w-auto flex justify-center">
            <button 
              className="relative z-10 w-full md:w-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-8 py-4 rounded-xl text-base md:text-lg font-medium hover:border-neutral-900 dark:hover:border-white transition-all duration-500 flex items-center justify-center gap-3 shadow-xl shadow-neutral-100 dark:shadow-none"
              onClick={()=>setLoginModal(true)}
            >
              Get Started
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            <div className="absolute inset-0 bg-blue-400/10 blur-3xl -z-10 group-hover:bg-blue-400/20 transition-all"></div>
          </div>
        </div>

        <div className="mt-20 md:mt-32 relative max-w-4xl mx-auto h-[300px] md:h-[400px]">
            <div className="absolute top-4 left-1/2 -translate-x-[48%] w-[95%] md:w-full h-full bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl shadow-sm rotate-[-2deg]"></div>
            <div className="absolute top-2 left-1/2 -translate-x-[49%] w-[95%] md:w-full h-full bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl shadow-md rotate-[1deg]"></div>
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden">
              <div className="flex gap-2 md:gap-4 mb-6 md:mb-8">
                <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-neutral-100 dark:bg-neutral-800" />
                <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-neutral-100 dark:bg-neutral-800" />
                <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-neutral-100 dark:bg-neutral-800" />
              </div>
              <div className="space-y-3 md:space-y-4">
                <div className="h-6 md:h-8 bg-neutral-50 dark:bg-neutral-800 rounded w-1/3 animate-pulse" />
                <div className="h-3 md:h-4 bg-neutral-50 dark:bg-neutral-800 rounded w-full" />
                <div className="h-3 md:h-4 bg-neutral-50 dark:bg-neutral-800 rounded w-5/6" />
                <div className="h-3 md:h-4 bg-neutral-50 dark:bg-neutral-800 rounded w-4/6" />
                
                <div className="mt-6 md:mt-12 border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-xl p-6 md:p-12 flex flex-col items-center justify-center bg-neutral-50/50 dark:bg-neutral-800/30">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-neutral-300 dark:text-neutral-700 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round"/></svg>
                    <span className="text-neutral-400 dark:text-neutral-600 text-xs md:text-sm font-medium">Drop files to attach</span>
                </div>
              </div>
            </div>
        </div>
      </main>

            <AnimatePresence>
        {loginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
              className="relative w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-8 overflow-hidden"
            >
              <button 
                onClick={() => setLoginModal(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 mb-6 bg-neutral-50 dark:bg-neutral-800 rounded-xl flex items-center justify-center border border-neutral-100 dark:border-neutral-700">
                  <Note className="text-2xl text-neutral-900 dark:text-white" />
                </div>
                
                <h2 className="text-2xl font-medium tracking-tight mb-2">Welcome back</h2>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-8">
                  Your digital workspace is waiting.
                </p>

                <button
                  onClick={() => signIn("google")}
                  className="w-full flex items-center justify-center gap-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 py-3.5 px-4 rounded-xl font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all shadow-sm group"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.16H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.84l3.66-2.75z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.16l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="group-hover:translate-x-0.5 transition-transform">Continue with Google</span>
                </button>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    <footer className="relative w-full bg-white dark:bg-[#0a0a0a] overflow-hidden transition-colors">
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 pt-8 px-4">
        {[
          "Contact Us",
          "Shipping & Delivery",
          "Privacy Policy",
          "Cancellation & Refund Policy",
          "Terms of Conditions",
        ].map((item) => (
          <button
            key={item}
            className="rounded-full bg-gray-100 dark:bg-neutral-900 px-4 md:px-5 py-2 text-xs md:text-sm text-gray-700 dark:text-neutral-400 hover:bg-gray-200 dark:hover:bg-neutral-800 transition"
          >
            {item}
          </button>
        ))}
      </div>

      <p className="mt-6 text-center text-xs md:text-sm text-gray-500 dark:text-neutral-600">
        © 2026 Notes Buddy. All rights reserved.
      </p>

      <div className="pointer-events-none select-none mt-5 text-center">
        <h1 className="text-[4rem] sm:text-[8rem] md:text-[14rem] font-extrabold text-gray-200 dark:text-neutral-900 leading-none mb-1">
          paperless<span className="text-indigo-600 font-normal">.</span>
        </h1>
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-gray-500/20 dark:from-neutral-900/40 via-transparent to-transparent h-5"></div>
      </div>
    </footer>
    </div>
  );
};

export default Landing;