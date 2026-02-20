"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Note from "@/lib/logo";
import { ArrowRight, Github, X, Sparkles, Layers, Shield, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
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
      {/* Dynamic Background Noise/Texture */}
      {/* <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" /> */}
      
      {/* Minimalist Floating Nav */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 flex justify-between items-center
        px-6 py-3 rounded-2xl backdrop-blur-xl bg-white/60 border border-black/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
        
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => router.push('/')}>
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center transition-transform group-hover:rotate-6">
            <Note className="text-white w-5 h-5" />
          </div>
          <span className="text-sm font-bold tracking-tighter uppercase">paperless</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
          <Link href="#features" className="hover:text-black transition-colors">Capability</Link>
          <Link href="https://github.com/prodot-com/paperless" className="hover:text-black transition-colors">Source</Link>
          <Link href="https://probalghosh.dev" className="hover:text-black transition-colors">Curator</Link>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={manageSignin}
            className="bg-black text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-black/10"
          >
            {session ? "Dashboard" : "Enter Vault"}
          </button>
        </div>
      </nav>

      <main className="relative pt-44 pb-24 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-8"
          >
            <Sparkles size={12} /> High-Fidelity Workspace
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-[100px] font-medium tracking-tight leading-[0.9] text-black mb-10"
          >
            Your thoughts, <br />
            <span className="font-serif italic text-neutral-300">perfectly structured.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl text-lg md:text-xl text-neutral-500 font-light leading-relaxed mb-12"
          >
            The hybrid space where notes meet files. A digital archive designed for the minimalists who demand organization without the effort.
          </motion.p>

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

        {/* Feature Grid - The "Architecture" */}
        <section id="features" className="grid md:grid-cols-3 gap-6 mb-40">
          <FeatureCard 
            icon={<Layers size={20} />}
            title="Unified Context"
            desc="Link PDFs, images, and voice notes directly into your markdown sentences."
          />
          <FeatureCard 
            icon={<Search size={20} />}
            title="Deep Recall"
            desc="AI-powered search that finds text inside your uploaded scans and handwritten notes."
          />
          <FeatureCard 
            icon={<Shield size={20} />}
            title="Private by Design"
            desc="Local-first synchronization. Your data stays within your encrypted vault."
          />
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="bg-white border-t border-black/[0.05] pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                  <Note className="text-white w-4 h-4" />
                </div>
                <span className="font-bold tracking-tighter uppercase">paperless</span>
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Redefining digital documentation through minimalist architecture and intelligent organization.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <FooterGroup title="Product" links={["Features", "Desktop App", "Mobile"]} />
              <FooterGroup title="Company" links={["About", "Privacy", "Status"]} />
              <FooterGroup title="Connect" links={["Github", "Twitter", "Email"]} />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-black/[0.05] gap-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              © 2026 Paperless Workspace. All Rights Reserved.
            </p>
            <div className="flex items-center gap-8">
              <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black">Terms</Link>
              <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black">Privacy</Link>
            </div>
          </div>

          {/* <div className="mt-20 overflow-hidden pointer-events-none select-none">
             <h1 className="text-[15vw] font-black text-black/[0.02] leading-none text-center">
              PAPERLESS
             </h1>
          </div> */}
        </div>
      </footer>

      {/* Re-styled Login Modal */}
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

// --- Helper Components ---

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-10 rounded-[32px] bg-white border border-black/[0.03] hover:border-indigo-200 transition-all group">
    <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center mb-6 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-neutral-500 leading-relaxed font-light">{desc}</p>
  </div>
);

const FooterGroup = ({ title, links }: { title: string, links: string[] }) => (
  <div className="flex flex-col gap-4">
    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">{title}</span>
    {links.map(link => (
      <Link key={link} href="#" className="text-sm text-neutral-500 hover:text-black transition-colors font-light">{link}</Link>
    ))}
  </div>
);

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.16H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.84l3.66-2.75z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.16l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default Landing;