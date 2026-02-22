"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, X, Moon, Sun, HardDrive, Zap, Box, Lock, Check, FileText } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

// --- Types ---
interface LogoProps {
  className?: string;
}

interface FAQItemProps {
  question: string;
  answer: string;
}

// --- Minimalist Logo Component ---
const Logo: React.FC<LogoProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 6C4 4.89543 4.89543 4 6 4H14L20 10V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 4V10H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="8" y="12" width="8" height="2" fill="currentColor" />
    <rect x="8" y="16" width="5" height="2" fill="currentColor" />
  </svg>
);

// --- FAQ Item Component ---
const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className="border-b-2 border-black/5 dark:border-white/10 py-5">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex w-full items-center justify-between text-left font-bold text-lg text-black dark:text-white"
      >
        <span className="pr-4">{question}</span>
        <span className="text-2xl font-light text-neutral-400">{isOpen ? "−" : "+"}</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden text-neutral-600 dark:text-neutral-400 text-base leading-relaxed mt-4"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Landing: React.FC = () => {
  const [loginModal, setLoginModal] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setIsDark(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleTheme = () => setIsDark(!isDark);
  const manageSignin = () => setLoginModal(true);

  if (!mounted) return null;

  return (
    <div className={`${isDark ? 'dark' : ''} min-h-screen font-sans selection:bg-black/10 dark:selection:bg-white/20 transition-colors duration-500`}>
      <div className="min-h-screen bg-[#ffffff] dark:bg-[#0A0A0A] text-[#1A1A1A] dark:text-[#EDEDED] relative overflow-hidden transition-colors duration-500">

        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-neutral-200/50 dark:bg-neutral-800/30 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-neutral-200/50 dark:bg-neutral-800/30 blur-[120px] rounded-full pointer-events-none" />

        <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[92%] md:w-[90%] max-w-5xl z-50 flex justify-between items-center px-4 md:px-6 py-3 rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-black/40 border border-black/5 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})}>
            <div className="flex items-center justify-center p-1.5 rounded-lg bg-black dark:bg-white transition-transform group-hover:scale-105">
              <Logo className="text-white dark:text-black w-4 h-4 md:w-5 md:h-5" />
            </div>
            <span className="text-xs md:text-sm font-extrabold tracking-tighter uppercase text-black dark:text-white">paperless</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            <Link href="https://github.com/prodot-com/paperless" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1.5 group">
            Developer <ArrowRight size={10} className="transition-transform group-hover:translate-x-1"/>
            </Link>
            <Link href="https://probalghosh.dev" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1.5 group">
              Company <ArrowRight size={10} className="transition-transform group-hover:translate-x-1"/>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-neutral-600 dark:text-neutral-400"
              title="Toggle Theme (Cmd+J)"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              onClick={manageSignin}
              className="cursor-pointer bg-black dark:bg-white text-white dark:text-black px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-xs font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all active:scale-95 shadow-lg shadow-black/10 dark:shadow-white/5"
            >
              Vault Access
            </button>
          </div>
        </nav>

        <main className="relative pt-32 pb-16 md:pt-44 md:pb-20 px-6 max-w-5xl mx-auto z-10 flex flex-col items-center text-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -20, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block absolute -left-7 top-16 w-56 h-56 text-black dark:text-white opacity-80 pointer-events-none"
          >
            <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M40 140 L100 170 L160 140 M40 100 L100 130 L160 100 L100 70 Z" />
              <path d="M100 130 V170" />
              <circle cx="100" cy="50" r="12" />
              <path d="M85 75 L60 60" />
              <path d="M115 75 L140 60" />
              <circle cx="60" cy="60" r="6" />
              <circle cx="140" cy="60" r="6" />
              <circle cx="140" cy="40" r="4" />
              <path d="M140 60 L140 40" />
            </svg>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="hidden lg:block absolute right-0 bottom-56 w-48 h-48 text-black dark:text-white opacity-80 pointer-events-none"
          >
            <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M40 100 L100 80 L160 100 L100 120 Z" />
              <path d="M60 106 V140 Q100 160 140 140 V106" />
              <path d="M160 100 V130" />
              <circle cx="160" cy="130" r="4" fill="currentColor" />
            </svg>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-[85px] font-black tracking-tight leading-[1.1] md:leading-[1.05] text-black dark:text-white mb-6 w-full relative z-10"
          >
            Your all-in-one <br /> digital asset platform <br />
            <div className="relative inline-block mt-2">
              <span className="font-serif italic font-light text-5xl sm:text-6xl md:text-[95px] pr-4 md:pr-8">perfectly structured</span>
              {/* Hand-drawn Arrow */}
              <svg className="absolute -right-2 md:-right-8 bottom-[-5px] md:bottom-2 w-8 h-8 md:w-12 md:h-12 text-black dark:text-white" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 50 Q 45 45, 45 15" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M30 22 L 45 15 L 52 28" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-neutral-500 dark:text-neutral-400 mb-10 md:mb-12 max-w-2xl leading-relaxed font-normal px-2"
          >
            Managing your intellectual property is already challenging enough.<br className="hidden sm:block"/>
            Avoid further complications by ditching scattered files.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto relative z-20 mb-16"
          >
            <button 
              onClick={manageSignin}
              className="w-full sm:w-auto cursor-pointer px-8 py-3.5 rounded-xl text-sm font-bold text-black dark:text-white bg-transparent border-2 border-black dark:border-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
            >
              Start Organizing
            </button>
            <button 
              onClick={manageSignin}
              className="w-full sm:w-auto cursor-pointer px-8 py-3.5 rounded-xl text-sm font-bold text-white dark:text-black bg-black dark:bg-white border-2 border-black dark:border-white hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10 dark:shadow-white/10"
            >
              Upgrade to Pro
            </button>
          </motion.div>

        </main>

        <section id="features" className="relative z-10 py-24 md:py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 md:mb-20 text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-black dark:text-white mb-4 md:mb-6">Built for Focus. Designed for Control.</h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-lg sm:text-xl max-w-2xl mx-auto md:mx-0 font-light">Paperless keeps your notes and files structured, searchable, and secure — without clutter or complexity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                { icon: <Box className="w-6 h-6"/>, title: "Structured Notes", desc: "Create, edit, and instantly search your notes. Clean organization with fast indexing keeps your ideas accessible at all times." },
                { icon: <HardDrive className="w-6 h-6"/>, title: "Secure File Vault", desc: "Upload and manage PDFs, images, and documents with encrypted Cloudflare R2 storage and controlled access." },
                { icon: <Zap className="w-6 h-6"/>, title: "Real-Time Tracking", desc: "Monitor your vault usage with live storage metrics and capacity insights directly from your dashboard." }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 md:p-10 rounded-3xl bg-transparent border-2 border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white transition-all group"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-black dark:border-white flex items-center justify-center mb-6 text-black dark:text-white group-hover:scale-110 transition-transform bg-transparent">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-black dark:text-white tracking-tight">{feature.title}</h3>
                  <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="relative z-10 py-24 md:py-32 px-6 bg-neutral-50 dark:bg-neutral-900/20 border-y-2 border-black/5 dark:border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-black dark:text-white mb-4 md:mb-6">Simple, Transparent Plans</h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-lg sm:text-xl max-w-xl mx-auto font-light">Start free and scale as your digital workspace grows.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-8 md:p-10 rounded-3xl bg-transparent border-2 border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white transition-colors relative flex flex-col"
              >
                <h3 className="text-2xl md:text-3xl font-black text-black dark:text-white mb-2 tracking-tight">Base</h3>
                <div className="mb-6 flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-black tracking-tight text-black dark:text-white">Free</span>
                </div>
                <p className="text-base text-neutral-600 dark:text-neutral-400 mb-8 pb-8 border-b-2 border-black/10 dark:border-white/10 font-medium">Perfect for individuals organizing essential notes and documents.</p>
                
                <ul className="space-y-5 mb-10 flex-grow">
                  {["1GB Vault Storage limit", "2MB maximum file size upload", "Standard Search & Indexing", "Google Authentication"].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-sm md:text-base font-bold text-black dark:text-white">
                      <div className="p-1 rounded-full bg-black/5 dark:bg-white/10 flex-shrink-0"><Check className="w-4 h-4 text-black dark:text-white" strokeWidth={3}/></div> {item}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={manageSignin}
                  className="w-full py-4 rounded-xl border-2 border-black dark:border-white text-black dark:text-white font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-lg"
                >
                  Start Filing
                </button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-8 md:p-10 rounded-3xl bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white relative flex flex-col shadow-2xl"
              >
                <div className="inline-flex self-start px-3 py-1 bg-white/20 dark:bg-black/10 text-white dark:text-black text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full mb-4">Most Popular</div>
                <h3 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">Pro</h3>
                <div className="mb-6 flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-black tracking-tight">$8</span>
                  <span className="text-white/70 dark:text-black/70 font-bold text-sm md:text-base">/month</span>
                </div>
                <p className="text-base text-white/80 dark:text-black/80 mb-8 pb-8 border-b-2 border-white/20 dark:border-black/10 font-medium">For professionals managing larger files and extended storage needs.</p>
                
                <ul className="space-y-5 mb-10 flex-grow">
                  {["50GB Vault Storage limit", "25MB maximum file size upload", "Advanced Search Capabilities", "Priority email support"].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-sm md:text-base font-bold">
                      <div className="p-1 rounded-full bg-white/20 dark:bg-black/10 flex-shrink-0"><Check className="w-4 h-4" strokeWidth={3}/></div> {item}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={manageSignin}
                  className="w-full py-4 rounded-xl bg-white dark:bg-black text-black dark:text-white font-bold hover:scale-[1.02] transition-transform text-lg"
                >
                  Upgrade to Pro
                </button>
              </motion.div>

            </div>
          </div>
        </section>

        <section id="faq" className="relative z-10 py-24 md:py-32 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-black dark:text-white">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-2 border-t-2 border-black/5 dark:border-white/10">
              <FAQItem 
                question="Is my data secure?" 
                answer="Yes. All files are encrypted in transit and at rest. Authentication is securely handled through Google via NextAuth." 
              />
              <FAQItem 
                question="What happens when I reach my storage limit?" 
                answer="You will be notified in your dashboard. You can either delete files to free up space or upgrade your plan." 
              />
              <FAQItem 
                question="Can I export my data?" 
                answer="Yes. You can download your files and notes anytime — we believe in zero lock-in." 
              />
            </div>
          </div>
        </section>

        <footer className="bg-[#ffffff] dark:bg-[#0A0A0A] border-t-2 border-black/10 dark:border-white/10 pt-16 md:pt-20 transition-colors duration-500 relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-12 mb-12 text-center md:text-left">
              <div className="max-w-sm flex flex-col items-center md:items-start">
                <div className="flex items-center gap-3 mb-4 md:mb-6 group">
                  <div className="flex items-center justify-center p-2 rounded-lg bg-black dark:bg-white">
                    <Logo className="text-white dark:text-black w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="font-black tracking-tight uppercase text-xl md:text-2xl text-black dark:text-white leading-none">
                    Paperless
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end gap-6 md:gap-8 w-full md:w-auto">
                <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4">
                  {[
                    { label: "Github", href: "https://github.com/prodot-com/paperless" },
                    { label: "Contact", href: "https://probalghosh.dev" },
                    { label: "License", href: "#" },
                    { label: "Documentation", href: "#" },
                  ].map((link) => (
                    <a 
                      key={link.label}
                      href={link.href}
                      className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                <div className="text-center md:text-right w-full">
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-neutral-400 font-bold">
                    Built by <a href="https://probalghosh.dev" className="text-black dark:text-white hover:underline">Probal Ghosh</a>
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full relative text-center select-none overflow-hidden mt-6 md:mt-10">
              <h2 className="text-[16vw] md:text-[14vw] font-black text-neutral-400/75 dark:text-neutral-800/85 leading-none tracking-tighter transition-colors duration-500">
                PAPERLESS<span className="text-black dark:text-white">.</span>
              </h2>
              <div className="absolute bottom-0 w-full h-full bg-linear-to-t from-[#F9F9F7] dark:from-[#0A0A0A] via-transparent to-transparent" />
            </div>
          </div>
        </footer>

        {/* <footer className="bg-white dark:bg-[#0A0A0A] border-t border-neutral-200 dark:border-white/5 pt-20 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
            <div className="max-w-sm">
              <div className="flex items-center gap-3 mb-6 group">
                <div className="flex items-center justify-center">
                  <Logo className="dark:text-white text-black w-8 h-8 rotate-8" />
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
            <div className="absolute bottom-0 w-full h-full bg-linear-to-t from-[#F9F9F7] dark:from-[#0A0A0A] via-transparent to-transparent" />
          </div>
        </div>
      </footer> */}

        <AnimatePresence>
          {loginModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setLoginModal(false)}
                className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-md bg-white dark:bg-[#111] rounded-3xl shadow-2xl p-8 sm:p-10 border-2 border-black/10 dark:border-white/10 overflow-hidden"
              >
                <button onClick={() => setLoginModal(false)} className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-neutral-400 hover:text-black dark:hover:text-white transition-colors z-10">
                  <X size={20} strokeWidth={2.5} />
                </button>
                
                <div className="text-center relative z-10">
                  <div className="flex items-center justify-center mx-auto mb-6 sm:mb-8 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-black dark:bg-white shadow-xl shadow-black/10 dark:shadow-white/5 transform -rotate-6">
                    <Logo className="w-6 h-6 sm:w-8 sm:h-8 text-white dark:text-black" />
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2 text-black dark:text-white">Verify Identity</h2>
                  <p className="text-sm sm:text-base text-neutral-500 mb-6 sm:mb-8 max-w-xs mx-auto font-medium">Access your digital vault and manage your IP securely.</p>
                  
                  <button
                    onClick={() => {
                      alert("In production, this triggers: signIn('google', { callbackUrl: '/dashboard' })");
                      setLoginModal(false);
                    }}
                    className="cursor-pointer w-full flex items-center justify-center gap-3 bg-transparent border-2 border-black/20 dark:border-white/20 py-3.5 sm:py-4 rounded-xl font-bold hover:border-black dark:hover:border-white transition-all text-black dark:text-white active:scale-95 text-base sm:text-lg"
                  >
                    <GoogleIcon />
                    Continue with Google
                  </button>

                  <p className="text-[10px] text-neutral-400 mt-6 font-bold tracking-[0.2em] uppercase">
                    Secured via NextAuth
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        
      </div>
    </div>
  );
};

const GoogleIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.16H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.84l3.66-2.75z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.16l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default Landing;