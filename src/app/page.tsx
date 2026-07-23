"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  X,
  Moon,
  Sun,
  HardDrive,
  Zap,
  FileText,
  Lock,
  Check,
  Box,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Logo from "@/lib/logo";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

const INK = "#1C1912";
const INK_DARK = "#EDE8DA";
const PAPER = "#F4F1E8";
const PAPER_DARK = "#14120E";
const GRAPHITE = "#6E6656";
const GRAPHITE_DARK = "#9C9484";
const STAMP = "#9B2226";
const STAMP_DARK = "#C6483C";
const LEDGER_BLUE = "#2B4570";
const LEDGER_BLUE_DARK = "#7DA0C4";

interface FAQItemProps {
  index: number;
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ index, question, answer }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className="border-b-2 border-[#1C1912]/10 dark:border-[#EDE8DA]/10 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left gap-4"
      >
        <span className="flex items-baseline gap-4">
          <span className="font-mono-case text-xs text-[#9B2226] dark:text-[#C6483C] font-bold tracking-[0.15em] shrink-0">
            Q{String(index).padStart(2, "0")}
          </span>
          <span className="font-bold text-lg md:text-xl text-[#1C1912] dark:text-[#EDE8DA]">
            {question}
          </span>
        </span>
        <span className="text-2xl font-light text-[#6E6656] dark:text-[#9C9484] shrink-0">
          {isOpen ? "\u2212" : "+"}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden text-[#6E6656] dark:text-[#9C9484] text-base leading-relaxed mt-4 pl-0 md:pl-12"
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
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const manageSignin = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      setLoginModal(true);
    }
  };

  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen font-['Inter'] selection:bg-[#9B2226]/20 dark:selection:bg-[#C6483C]/30 transition-colors duration-500">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,500;1,9..144,600&family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800;900&display=swap");
        .font-display {
          font-family: "Fraunces", serif;
        }
        .font-mono-case {
          font-family: "JetBrains Mono", monospace;
        }
        @keyframes inkSpread {
          0% {
            transform: scale(0.4);
            opacity: 0.6;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
        .ink-spread {
          animation: inkSpread 1.6s ease-out 1s 1 both;
        }
        @media (prefers-reduced-motion: reduce) {
          .ink-spread {
            animation: none;
            display: none;
          }
        }
      `}</style>

      <div className="min-h-screen bg-[#F5F5F3] dark:bg-[#000000] text-[#1C1912] dark:text-[#EDE8DA] relative overflow-hidden transition-colors duration-500">
        <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[92%] md:w-[90%] max-w-5xl z-50 flex justify-between items-center px-4 md:px-6 py-3 rounded-lg backdrop-blur-xl bg-[#F8F8F7]/20 dark:bg-[#14120E]/20 border border-[#1C1912]/10 dark:border-[#EDE8DA]/10 shadow-[0_8px_32px_rgba(28,25,18,0.06)]">
          <div
            className="flex items-center gap-1.5 group cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="flex items-center justify-center transition-transform group-hover:scale-105">
              <Logo className="text-[#1C1912] dark:text-[#EDE8DA] w-4 h-4 md:w-6 md:h-6" />
            </div>
            <span className="text-xs md:text-[16px] font-extrabold tracking-tighter uppercase text-[#1C1912] dark:text-[#EDE8DA]">
              paperless
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[11px] font-mono-case font-bold uppercase tracking-[0.2em] text-[#6E6656] dark:text-[#9C9484]">
            <Link
              href="https://github.com/prodot-com/paperless"
              className="hover:text-[#1C1912] dark:hover:text-[#EDE8DA] transition-colors flex items-center gap-1.5 group"
            >
              Developer{" "}
              <ArrowRight
                size={10}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="https://probalghosh.dev"
              className="hover:text-[#1C1912] dark:hover:text-[#EDE8DA] transition-colors flex items-center gap-1.5 group"
            >
              Company{" "}
              <ArrowRight
                size={10}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 cursor-pointer rounded-md cursor-po hover:bg-[#1C1912]/5 dark:hover:bg-[#EDE8DA]/10 transition-colors text-[#6E6656] dark:text-[#9C9484]"
            >
              {resolvedTheme === "dark" ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>
            <button
              onClick={manageSignin}
              className="cursor-pointer bg-[#1C1912] dark:bg-[#EDE8DA] text-[#F4F1E8] dark:text-[#14120E] px-4 md:px-6 py-2 md:py-2.5 rounded-sm text-xs font-mono-case font-bold uppercase tracking-[0.1em] hover:bg-[#332E22] dark:hover:bg-white transition-all active:scale-95 shadow-lg shadow-[#1C1912]/10 dark:shadow-black/20"
            >
              {session ? "Enter" : "Join"}
            </button>
          </div>
        </nav>

        <main className="relative pt-32 pb-16 md:pt-48 md:pb-20 px-6 max-w-5xl mx-auto z-10 flex flex-col items-center text-center">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_31px,#DDD5BE_32px)] dark:bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_31px,#2A2418_32px)] opacity-40 pointer-events-none" />

          <div className="hidden md:block absolute left-16 top-0 bottom-0 w-px bg-[#9B2226]/20 dark:bg-[#C6483C]/25 pointer-events-none" />

          <div className="absolute -left-28 -top-28 w-[420px] h-[420px] rounded-full border-[3px] border-[#9B2226]/10 dark:border-[#C6483C]/10 pointer-events-none" />
          <div className="absolute -right-20 top-15 w-[300px] h-[300px] rounded-full border-[3px] border-[#2B4570]/10 dark:border-[#7DA0C4]/15 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, x: -20, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 2, delay: 0.6 }}
            className="hidden lg:block absolute -left-4 top-34 rotate-45 w-40 h-48 text-[#1C1912] dark:text-[#EDE8DA] opacity-70 pointer-events-none"
          >
            <svg
              viewBox="0 0 200 200"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M75 40 L75 145 Q75 175 105 175 Q135 175 135 145 L135 55 Q135 35 115 35 Q95 35 95 55 L95 130" />
              <path d="M75 40 Q75 25 90 25" />
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 3, delay: 0.5 }}
            className="hidden lg:block absolute -left-1 bottom-40 w-40 h-48 text-black dark:text-white opacity-80 pointer-events-none"
          >
            <svg
              viewBox="0 0 200 200"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M40 100 L100 80 L160 100 L100 120 Z" />
              <path d="M60 106 V140 Q100 160 140 140 V106" />
              <path d="M160 100 V130" />
              <circle cx="160" cy="130" r="4" fill="currentColor" />
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 1.5, rotate: 14 }}
            animate={{ opacity: 1, scale: 1, rotate: 6 }}
            transition={{
              type: "spring",
              stiffness: 170,
              damping: 14,
              delay: 0.85,
            }}
            className="hidden lg:block absolute -right-20 bottom-45 w-48 h-40 z-20 select-none pointer-events-none"
          >
            <svg
              width="98"
              height="98"
              viewBox="0 0 92 92"
              className="text-[#9B2226] dark:text-[#C6483C]"
            >
              <circle
                cx="46"
                cy="46"
                r="44"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle
                cx="46"
                cy="46"
                r="34"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              <path
                id="postmarkArc"
                d="M 10 46 A 36 36 0 0 1 82 46"
                fill="none"
              />
              <text
                fontSize="8"
                fontWeight="700"
                letterSpacing="2"
                fill="currentColor"
                className="font-mono-case"
              >
                <textPath
                  href="#postmarkArc"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  RÉSUMÉ ENCLOSED
                </textPath>
              </text>
              <text
                x="46"
                y="52"
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                letterSpacing="1"
                fill="currentColor"
                className="font-mono-case"
              >
                2026
              </text>
              <line
                x1="14"
                y1="60"
                x2="78"
                y2="34"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <line
                x1="19"
                y1="67"
                x2="80"
                y2="42"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 1.6, rotate: -26 }}
            animate={{ opacity: 1, scale: 1, rotate: -9 }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 13,
              delay: 0.65,
            }}
            className="hidden sm:block absolute right-4 top-28 md:right-16 md:top-34 z-20 select-none pointer-events-none"
          >
            <div className="relative">
              <div className="ink-spread absolute inset-0 rounded-full border-2 border-[#9B2226] dark:border-[#C6483C]" />
              <div className="border-[3px] border-[#9B2226] dark:border-[#C6483C] rounded-sm px-1 py-1">
                <div className="border border-[#9B2226]/70 dark:border-[#C6483C]/70 px-3 py-2 text-center">
                  <p className="font-mono-case text-[10px] md:text-xs font-bold tracking-[0.3em] text-[#9B2226] dark:text-[#C6483C]">
                    FILED
                  </p>
                  <p className="font-mono-case text-[8px] md:text-[9px] tracking-[0.2em] mt-0.5 text-[#9B2226]/80 dark:text-[#C6483C]/80">
                    NO. 2026-01
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-mono-case text-[11px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#9B2226] dark:text-[#C6483C] mb-6 relative z-10"
          >
            Digital Vault — Case No. 2026-01
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="font-display text-5xl sm:text-6xl md:text-[76px] font-bold tracking-tight leading-[1.1] text-[#1C1912] dark:text-[#EDE8DA] mb-6 w-full relative z-10"
          >
            Every note and file,
            <br />
            <span className="italic font-medium text-[#9B2226] dark:text-[#C6483C]">
              in one place, for good.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-base sm:text-lg md:text-xl text-[#6E6656] dark:text-[#9C9484] mb-8 max-w-2xl leading-relaxed font-normal px-2 relative z-10"
          >
            Managing your intellectual property is hard enough. Paperless gives
            your notes and files a permanent, searchable address — so nothing
            gets buried in another folder.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto relative z-20 mb-6"
          >
            <button
              onClick={manageSignin}
              className="w-full sm:w-auto cursor-pointer px-8 py-3.5 rounded-sm text-sm font-mono-case font-bold uppercase tracking-[0.1em] text-[#F4F1E8] dark:text-[#14120E] bg-[#1C1912] dark:bg-[#EDE8DA] border-2 border-[#1C1912] dark:border-[#EDE8DA] hover:bg-[#332E22] dark:hover:bg-white transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#1C1912]/10 dark:shadow-black/20"
            >
              Start Filing
            </button>
            <button
              onClick={scrollToPricing}
              className="w-full sm:w-auto cursor-pointer px-8 py-3.5 rounded-sm text-sm font-mono-case font-bold uppercase tracking-[0.1em] text-[#1C1912] dark:text-[#EDE8DA] bg-transparent border-2 border-[#1C1912] dark:border-[#EDE8DA] hover:bg-[#1C1912]/5 dark:hover:bg-[#EDE8DA]/10 transition-colors flex items-center justify-center gap-2"
            >
              View Plans
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-2 text-[11px] font-mono-case uppercase tracking-[0.15em] text-[#6E6656] dark:text-[#9C9484] relative z-10"
          >
            <Lock size={12} /> Encrypted vault &middot; Google sign-in &middot;
            No lock-in
          </motion.div>
        </main>

        <section
          id="features"
          className="bg-[#f2f0ea] dark:bg-[#14120E] relative z-10 py-24 md:py-32 px-6 border-t-2 border-[#1C1912]/10 dark:border-[#EDE8DA]/10"
        >
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 md:mb-20 text-center md:text-left">
              <p className="font-mono-case text-xs font-bold uppercase tracking-[0.3em] text-[#9B2226] dark:text-[#C6483C] mb-4">
                The System
              </p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#1C1912] dark:text-[#EDE8DA] mb-4 md:mb-6">
                Built like a filing system, not a folder full of clutter.
              </h2>
              <p className="text-[#6E6656] dark:text-[#9C9484] text-lg sm:text-xl max-w-2xl mx-auto md:mx-0 font-normal">
                Paperless keeps your notes and files structured, searchable, and
                secure — every entry has a number, and every number has a place.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  icon: <FileText className="w-6 h-6" />,
                  no: "01",
                  title: "Structured Notes",
                  desc: "Create, edit, and instantly search your notes. Clean organization with fast indexing keeps your ideas accessible at all times.",
                },
                {
                  icon: <HardDrive className="w-6 h-6" />,
                  no: "02",
                  title: "Secure File Vault",
                  desc: "Upload and manage PDFs, images, and documents with encrypted Cloudflare R2 storage and controlled access.",
                },
                {
                  icon: <Zap className="w-6 h-6" />,
                  no: "03",
                  title: "Real-Time Tracking",
                  desc: "Monitor your vault usage with live storage metrics and capacity insights directly from your dashboard.",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 md:p-10 rounded-sm bg-transparent border-2 border-[#1C1912]/10 dark:border-[#EDE8DA]/10 hover:border-[#1C1912] dark:hover:border-[#EDE8DA] transition-all group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-full border-2 border-[#1C1912] dark:border-[#EDE8DA] flex items-center justify-center text-[#1C1912] dark:text-[#EDE8DA] group-hover:scale-110 transition-transform bg-transparent">
                      {feature.icon}
                    </div>
                    <span className="font-mono-case text-xs font-bold tracking-[0.2em] text-[#9B2226] dark:text-[#C6483C]">
                      NO. {feature.no}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-[#1C1912] dark:text-[#EDE8DA] tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-base text-[#6E6656] dark:text-[#9C9484] leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="pricing"
          className="relative z-10 py-24 md:py-32 px-6 bg-[#EDE9DB] dark:bg-[#1A170F] border-y-2 border-[#1C1912]/10 dark:border-[#EDE8DA]/10"
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 md:mb-20">
              <p className="font-mono-case text-xs font-bold uppercase tracking-[0.3em] text-[#9B2226] dark:text-[#C6483C] mb-4">
                Plans — Ledger
              </p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#1C1912] dark:text-[#EDE8DA] mb-4 md:mb-6">
                Three ways to file everything.
              </h2>
              <p className="text-[#6E6656] dark:text-[#9C9484] text-lg sm:text-xl max-w-xl mx-auto font-normal">
                Start free and scale as your digital workspace grows.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-8 md:p-10 rounded-sm bg-transparent border-2 border-[#1C1912]/20 dark:border-[#EDE8DA]/20 hover:border-[#1C1912] dark:hover:border-[#EDE8DA] transition-colors relative flex flex-col"
              >
                <p className="font-mono-case text-[11px] font-bold tracking-[0.2em] text-[#6E6656] dark:text-[#9C9484] mb-2">
                  TIER — 01
                </p>
                <h3 className="text-2xl md:text-3xl font-black text-[#1C1912] dark:text-[#EDE8DA] mb-2 tracking-tight">
                  Base
                </h3>
                <div className="mb-6 flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-black tracking-tight text-[#1C1912] dark:text-[#EDE8DA]">
                    Free
                  </span>
                </div>
                <p className="text-base text-[#6E6656] dark:text-[#9C9484] mb-8 pb-8 border-b-2 border-[#1C1912]/10 dark:border-[#EDE8DA]/10 font-medium">
                  Perfect for individuals organizing essential notes and
                  documents.
                </p>

                <ul className="space-y-5 mb-10 grow">
                  {[
                    "1GB Vault Storage limit",
                    "2MB maximum file size upload",
                    "Standard Search & Indexing",
                    "Google Authentication",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-4 text-sm md:text-base font-bold text-[#1C1912] dark:text-[#EDE8DA]"
                    >
                      <div className="p-1 rounded-full bg-[#1C1912]/5 dark:bg-[#EDE8DA]/10 shrink-0">
                        <Check
                          className="w-4 h-4 text-[#1C1912] dark:text-[#EDE8DA]"
                          strokeWidth={3}
                        />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={manageSignin}
                  className="w-full py-4 rounded-sm border-2 border-[#1C1912] dark:border-[#EDE8DA] text-[#1C1912] dark:text-[#EDE8DA] font-mono-case font-bold uppercase tracking-[0.1em] hover:bg-[#1C1912]/5 dark:hover:bg-[#EDE8DA]/10 transition-colors text-base"
                >
                  Start Filing
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-8 md:p-10 rounded-sm bg-[#1C1912] dark:bg-[#EDE8DA] text-[#F4F1E8] dark:text-[#14120E] border-2 border-[#1C1912] dark:border-[#EDE8DA] relative flex flex-col shadow-2xl"
              >
                <div className="absolute -top-3 -right-3 border-2 border-[#9B2226] dark:border-[#C6483C] bg-[#F4F1E8] dark:bg-[#14120E] rounded-sm px-3 py-1 rotate-[-4deg] shadow-lg">
                  <span className="font-mono-case text-[10px] font-bold uppercase tracking-[0.15em] text-[#9B2226] dark:text-[#C6483C]">
                    Most Filed
                  </span>
                </div>
                <p className="font-mono-case text-[11px] font-bold tracking-[0.2em] text-[#F4F1E8]/60 dark:text-[#14120E]/60 mb-2">
                  TIER — 02
                </p>
                <h3 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">
                  Pro
                </h3>
                <div className="mb-6 flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-black tracking-tight">
                    $8
                  </span>
                  <span className="text-[#F4F1E8]/70 dark:text-[#14120E]/70 font-bold text-sm md:text-base">
                    /month
                  </span>
                </div>
                <p className="text-base text-[#F4F1E8]/80 dark:text-[#14120E]/80 mb-8 pb-8 border-b-2 border-[#F4F1E8]/20 dark:border-[#14120E]/20 font-medium">
                  For professionals managing larger files and extended storage
                  needs.
                </p>

                <ul className="space-y-5 mb-10 grow">
                  {[
                    "50GB Vault Storage limit",
                    "25MB maximum file size upload",
                    "Advanced Search Capabilities",
                    "Priority email support",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-4 text-sm md:text-base font-bold"
                    >
                      <div className="p-1 rounded-full bg-[#F4F1E8]/20 dark:bg-[#14120E]/10 shrink-0">
                        <Check className="w-4 h-4" strokeWidth={3} />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={manageSignin}
                  className="w-full py-4 rounded-sm bg-[#F4F1E8] dark:bg-[#14120E] text-[#1C1912] dark:text-[#EDE8DA] font-mono-case font-bold uppercase tracking-[0.1em] hover:scale-[1.02] transition-transform text-base"
                >
                  Upgrade to Pro
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 md:p-10 rounded-sm bg-transparent border-2 border-[#1C1912]/20 dark:border-[#EDE8DA]/20 hover:border-[#1C1912] dark:hover:border-[#EDE8DA] transition-colors relative flex flex-col"
              >
                <p className="font-mono-case text-[11px] font-bold tracking-[0.2em] text-[#6E6656] dark:text-[#9C9484] mb-2">
                  TIER — 03
                </p>
                <h3 className="text-2xl md:text-3xl font-black text-[#1C1912] dark:text-[#EDE8DA] mb-2 tracking-tight flex items-center gap-2">
                  Enterprise{" "}
                  <Box className="w-5 h-5 text-[#9B2226] dark:text-[#C6483C]" />
                </h3>

                <div className="mb-6 flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-black tracking-tight text-[#1C1912] dark:text-[#EDE8DA]">
                    Custom
                  </span>
                </div>

                <p className="text-base text-[#6E6656] dark:text-[#9C9484] mb-8 pb-8 border-b-2 border-[#1C1912]/10 dark:border-[#EDE8DA]/10 font-medium">
                  For organizations requiring unlimited storage and dedicated
                  infrastructure.
                </p>

                <ul className="space-y-5 mb-10 grow">
                  {[
                    "Unlimited Vault Storage",
                    "Unlimited file size uploads",
                    "Team Collaboration",
                    "Dedicated Support & SLA",
                    "Custom Integrations",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-4 text-sm md:text-base font-bold text-[#1C1912] dark:text-[#EDE8DA]"
                    >
                      <div className="p-1 rounded-full bg-[#1C1912]/5 dark:bg-[#EDE8DA]/10 shrink-0">
                        <Check
                          className="w-4 h-4 text-[#1C1912] dark:text-[#EDE8DA]"
                          strokeWidth={3}
                        />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={manageSignin}
                  className="w-full py-4 rounded-sm border-2 border-[#1C1912] dark:border-[#EDE8DA] text-[#1C1912] dark:text-[#EDE8DA] font-mono-case font-bold uppercase tracking-[0.1em] hover:bg-[#1C1912]/5 dark:hover:bg-[#EDE8DA]/10 transition-colors text-base"
                >
                  Contact Sales
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="faq" className="relative z-10 py-24 md:py-32 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <p className="font-mono-case text-xs font-bold uppercase tracking-[0.3em] text-[#9B2226] dark:text-[#C6483C] mb-4">
                Questions On Record
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#1C1912] dark:text-[#EDE8DA]">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-2 border-t-2 border-[#1C1912]/10 dark:border-[#EDE8DA]/10">
              <FAQItem
                index={1}
                question="Is my data secure?"
                answer="Yes. All files are encrypted in transit and at rest. Authentication is securely handled through Google via NextAuth."
              />
              <FAQItem
                index={2}
                question="What happens when I reach my storage limit?"
                answer="You will be notified in your dashboard. You can either delete files to free up space or upgrade your plan."
              />
              <FAQItem
                index={3}
                question="Can I export my data?"
                answer="Yes. You can download your files and notes anytime — we believe in zero lock-in."
              />
            </div>
          </div>
        </section>

        <footer className="bg-[#F4F1E8] dark:bg-[#14120E] border-t-2 border-[#1C1912]/10 dark:border-[#EDE8DA]/10 pt-16 md:pt-20 transition-colors duration-500 relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-12 mb-12 text-center md:text-left">
              <div className="max-w-sm flex flex-col items-center md:items-start">
                <div className="flex items-center gap-1 mb-4 md:mb-6 group">
                  <div className="flex items-center justify-center p-2">
                    <Logo className="text-[#1C1912] dark:text-[#EDE8DA] w-5 h-5 md:w-7 md:h-7" />
                  </div>
                  <span className="font-black tracking-tight uppercase text-xl md:text-2xl text-[#1C1912] dark:text-[#EDE8DA] leading-none">
                    Paperless
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end gap-6 md:gap-8 w-full md:w-auto">
                <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4">
                  {[
                    {
                      label: "Github",
                      href: "https://github.com/prodot-com/paperless",
                    },
                    { label: "Contact", href: "https://probalghosh.dev" },
                    {
                      label: "License",
                      href: "https://github.com/prodot-com/paperless/tree/main?tab=GPL-3.0-1-ov-file#readme",
                    },
                    {
                      label: "Documentation",
                      href: "https://github.com/prodot-com/paperless/blob/main/README.md",
                    },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="font-mono-case text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold text-[#6E6656] dark:text-[#9C9484] hover:text-[#1C1912] dark:hover:text-[#EDE8DA] transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                <div className="text-center md:text-right w-full">
                  <p className="font-mono-case text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#6E6656] dark:text-[#9C9484] font-bold">
                    Built by{" "}
                    <a
                      href="https://probalghosh.dev"
                      className="text-[#1C1912] dark:text-[#EDE8DA] hover:underline"
                    >
                      Probal Ghosh
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full relative text-center select-none overflow-hidden mt-6 md:mt-10">
              <h2 className="font-display text-[16vw] md:text-[14vw] font-bold text-[#1C1912]/10 dark:text-[#EDE8DA]/10 leading-none tracking-tighter transition-colors duration-500">
                PAPERLESS
                <span className="text-[#9B2226] dark:text-[#C6483C]">.</span>
              </h2>
              <div className="absolute bottom-0 w-full h-full bg-linear-to-t from-[#F4F1E8] dark:from-[#14120E] via-transparent to-transparent" />
            </div>
          </div>
        </footer>

        <AnimatePresence>
          {loginModal && (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLoginModal(false)}
                className="absolute inset-0 bg-[#F4F1E8]/85 dark:bg-[#14120E]/85 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-md bg-[#F4F1E8] dark:bg-[#1A170F] rounded-sm shadow-2xl p-8 sm:p-10 border-2 border-[#1C1912]/10 dark:border-[#EDE8DA]/10 overflow-hidden"
              >
                <button
                  onClick={() => setLoginModal(false)}
                  className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 rounded-full hover:bg-[#1C1912]/5 dark:hover:bg-[#EDE8DA]/10 text-[#6E6656] dark:text-[#9C9484] hover:text-[#1C1912] dark:hover:text-[#EDE8DA] transition-colors z-10"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>

                <div className="text-center relative z-10">
                  <div className="flex items-center justify-center mx-auto mb-6 sm:mb-8 w-14 h-14 sm:w-16 sm:h-16 rounded-sm border-2 border-[#9B2226] dark:border-[#C6483C] transform -rotate-6">
                    <Logo className="w-6 h-6 sm:w-8 sm:h-8 text-[#1C1912] dark:text-[#EDE8DA]" />
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mb-2 text-[#1C1912] dark:text-[#EDE8DA]">
                    Verify Identity
                  </h2>
                  <p className="text-sm sm:text-base text-[#6E6656] dark:text-[#9C9484] mb-6 sm:mb-8 max-w-xs mx-auto font-medium">
                    Access your digital vault and manage your IP securely.
                  </p>

                  <button
                    onClick={() =>
                      signIn("google", { callbackUrl: "/dashboard" })
                    }
                    className="cursor-pointer w-full flex items-center justify-center gap-3 bg-transparent border-2 border-[#1C1912]/20 dark:border-[#EDE8DA]/20 py-3.5 sm:py-4 rounded-sm font-bold hover:border-[#1C1912] dark:hover:border-[#EDE8DA] transition-all text-[#1C1912] dark:text-[#EDE8DA] active:scale-95 text-base sm:text-lg"
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
    </div>
  );
};

const GoogleIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.16H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.84l3.66-2.75z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.16l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export default Landing;
