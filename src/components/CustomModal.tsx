"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  HelpCircle,
  Type,
  Skull,
  ChevronDown,
  Share2,
  FolderPlus,
} from "lucide-react";
import { useState, useEffect } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "error" | "confirm" | "rename" | "delete" | "share" | "folder";
  title: string;
  message: string;
  defaultValue?: string;
  onConfirm?: (value?: string) => void;
};

export default function CustomModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  defaultValue,
  onConfirm,
}: ModalProps) {
  const [inputValue, setInputValue] = useState(defaultValue || "");
  const [selected, setSelected] = useState("1");

  useEffect(() => {
    if (isOpen) setInputValue(defaultValue || "");
  }, [isOpen, defaultValue]);

  const styleConfig = {
    error: {
      icon: <AlertCircle size={26} strokeWidth={2} />,
      iconBg: "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-500",
      glow: "bg-red-500/15",
      buttonBg: "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20",
      buttonText: "Dismiss",
      eyebrow: "Notice",
      eyebrowColor: "text-red-600 dark:text-red-400",
      markRing: "border-red-500/40",
      markDot: "bg-red-500",
    },
    delete: {
      icon: <Skull size={26} strokeWidth={2} />,
      iconBg: "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-500",
      glow: "bg-red-500/15",
      buttonBg: "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20",
      buttonText: "Delete",
      eyebrow: "Danger zone",
      eyebrowColor: "text-red-600 dark:text-red-400",
      markRing: "border-red-500/40",
      markDot: "bg-red-500",
    },
    rename: {
      icon: <Type size={26} strokeWidth={2} />,
      iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
      glow: "bg-blue-500/15",
      buttonBg:
        "bg-neutral-900 hover:bg-black text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900",
      buttonText: "Update",
      eyebrow: "Rename",
      eyebrowColor: "text-blue-600 dark:text-blue-400",
      markRing: "border-blue-500/40",
      markDot: "bg-blue-500",
      inputFocus: "focus:ring-blue-500/10 focus:border-blue-500 dark:focus:border-blue-400",
    },
    share: {
      icon: <Share2 size={26} strokeWidth={2} />,
      iconBg:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
      glow: "bg-emerald-500/15",
      buttonBg:
        "bg-neutral-900 hover:bg-black text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900",
      buttonText: "Share",
      eyebrow: "Share access",
      eyebrowColor: "text-emerald-600 dark:text-emerald-400",
      markRing: "border-emerald-500/40",
      markDot: "bg-emerald-500",
      inputFocus: "focus:ring-emerald-500/10 focus:border-emerald-500 dark:focus:border-emerald-400",
    },
    confirm: {
      icon: <HelpCircle size={26} strokeWidth={2} />,
      iconBg:
        "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
      glow: "bg-indigo-500/15",
      buttonBg:
        "bg-neutral-900 hover:bg-black text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900",
      buttonText: "Confirm",
      eyebrow: "Confirmation",
      eyebrowColor: "text-indigo-600 dark:text-indigo-400",
      markRing: "border-indigo-500/40",
      markDot: "bg-indigo-500",
    },
    folder: {
      icon: <FolderPlus size={26} strokeWidth={2} />,
      iconBg:
        "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
      glow: "bg-amber-500/15",
      buttonBg:
        "bg-neutral-900 hover:bg-black text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900",
      buttonText: "Create",
      eyebrow: "New folder",
      eyebrowColor: "text-amber-600 dark:text-amber-400",
      markRing: "border-amber-500/40",
      markDot: "bg-amber-500",
      inputFocus: "focus:ring-amber-500/10 focus:border-amber-500 dark:focus:border-amber-400",
    },
  };

  const currentStyle = styleConfig[type];
  const inputFocus =
    "inputFocus" in currentStyle
      ? currentStyle.inputFocus
      : "focus:ring-blue-500/10 focus:border-blue-500 dark:focus:border-blue-400";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/40 dark:bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-100 overflow-hidden rounded-[1.75rem] border border-neutral-200/80 bg-white/70 shadow-lg shadow-neutral-200/20 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/65 dark:shadow-none"
          >
            <div className="flex flex-col items-center p-6 text-center sm:p-8">
              <div className="relative mb-5">
                <div
                  className={`absolute -inset-1 rounded-[1.3rem] blur-md ${currentStyle.glow}`}
                />
                <div
                  className={`relative rounded-2xl border border-black/5 p-4 shadow-sm dark:border-white/5 ${currentStyle.iconBg}`}
                >
                  {currentStyle.icon}
                </div>
              </div>

              <p
                className={`flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] ${currentStyle.eyebrowColor}`}
              >
                <span
                  className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${currentStyle.markRing}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${currentStyle.markDot}`} />
                </span>
                {currentStyle.eyebrow}
              </p>

              <h3 className="mt-2 font-serif text-2xl tracking-tight text-neutral-800 dark:text-white">
                {title}
              </h3>
              <p className="mt-2 max-w-[90%] text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                {message}
              </p>

              {(type === "rename" || type === "folder") && (
                <div className="mt-6 w-full">
                  <input
                    autoFocus
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className={`w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-[15px] text-neutral-900 placeholder:text-neutral-400 transition-all duration-300 focus:outline-none focus:ring-4 dark:border-neutral-700/80 dark:bg-neutral-900/50 dark:text-white ${inputFocus}`}
                    placeholder={
                      type === "folder" ? "Enter folder name..." : "Enter new name..."
                    }
                  />
                </div>
              )}

              {type === "share" && (
                <div className="mt-6 w-full">
                  <div className="relative">
                    <select
                      className={`w-full cursor-pointer appearance-none rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-[15px] font-medium text-neutral-900 transition-all duration-300 focus:outline-none focus:ring-4 dark:border-neutral-700/80 dark:bg-neutral-900/50 dark:text-white ${inputFocus}`}
                      value={selected}
                      onChange={(e) => setSelected(e.target.value)}
                    >
                      <option value="1">Expire in 1 Hour</option>
                      <option value="6">Expire in 6 Hours</option>
                      <option value="24">Expire in 24 Hours</option>
                      <option value="never">Never Expire</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-neutral-500 dark:text-neutral-400">
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex w-full gap-3">
                {type !== "error" && (
                  <button
                    onClick={onClose}
                    className="flex-1 cursor-pointer rounded-xl bg-neutral-100 px-4 py-3.5 text-[15px] font-medium text-neutral-700 transition-colors duration-200 hover:bg-neutral-200 dark:bg-neutral-800/80 dark:text-neutral-300 dark:hover:bg-neutral-700/80"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={() => {
                    if (onConfirm)
                      onConfirm(
                        type === "rename" || type === "folder"
                          ? inputValue
                          : type === "share"
                            ? selected
                            : undefined,
                      );
                    onClose();
                  }}
                  className={`flex-1 cursor-pointer rounded-xl px-4 py-3.5 text-[15px] font-medium shadow-sm transition-all duration-200 ${currentStyle.buttonBg} ${type === "error" ? "w-full" : ""}`}
                >
                  {currentStyle.buttonText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}