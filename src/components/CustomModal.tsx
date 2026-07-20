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
      icon: <AlertCircle size={28} strokeWidth={2} />,
      iconBg: "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-500",
      buttonBg: "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20",
      buttonText: "Dismiss",
    },
    delete: {
      icon: <Skull size={28} strokeWidth={2} />,
      iconBg: "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-500",
      buttonBg: "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20",
      buttonText: "Delete",
    },
    rename: {
      icon: <Type size={28} strokeWidth={2} />,
      iconBg:
        "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
      buttonBg:
        "bg-neutral-900 hover:bg-black text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900",
      buttonText: "Update",
    },
    share: {
      icon: <Share2 size={28} strokeWidth={2} />,
      iconBg:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
      buttonBg:
        "bg-neutral-900 hover:bg-black text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900",
      buttonText: "Share",
    },
    confirm: {
      icon: <HelpCircle size={28} strokeWidth={2} />,
      iconBg:
        "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
      buttonBg:
        "bg-neutral-900 hover:bg-black text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900",
      buttonText: "Confirm",
    },
    folder: {
      icon: <FolderPlus size={28} strokeWidth={2} />,
      iconBg:
        "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
      buttonBg:
        "bg-neutral-900 hover:bg-black text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900",
      buttonText: "Create",
    },
  };

  const currentStyle = styleConfig[type];

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
            className="relative w-full max-w-100 bg-white dark:bg-[#0A0A0A] border border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 sm:p-8 flex flex-col items-center text-center">
              <div
                className={`p-4 rounded-2xl mb-5 shadow-sm border border-black/5 dark:border-white/5 ${currentStyle.iconBg}`}
              >
                {currentStyle.icon}
              </div>

              <h3 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-2">
                {title}
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-[15px] mb-8 leading-relaxed max-w-[90%]">
                {message}
              </p>

              {type === "rename" && (
                <div className="w-full mb-8 relative group">
                  <input
                    autoFocus
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700/80 rounded-xl px-4 py-3.5 text-[15px] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
                    placeholder="Enter new name..."
                  />
                </div>
              )}

              {type === "folder" && (
                <div className="w-full mb-8 relative group">
                  <input
                    autoFocus
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700/80 rounded-xl px-4 py-3.5 text-[15px] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
                    placeholder="Enter folder name..."
                  />
                </div>
              )}

              {type === "share" && (
                <div className="w-full mb-8 relative">
                  <div className="relative">
                    <select
                      className="w-full appearance-none bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700/80 rounded-xl px-4 py-3.5 text-[15px] font-medium text-neutral-900 dark:text-white cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
                      value={selected}
                      onChange={(e) => setSelected(e.target.value)}
                    >
                      <option value="1">Expire in 1 Hour</option>
                      <option value="6">Expire in 6 Hours</option>
                      <option value="24">Expire in 24 Hours</option>
                      <option value="never">Never Expire</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-500 dark:text-neutral-400">
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 w-full mt-auto">
                {type !== "error" && (
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800/80 dark:hover:bg-neutral-700/80 font-medium text-[15px] text-neutral-700 dark:text-neutral-300 transition-colors duration-200 cursor-pointer"
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
                  className={`flex-1 px-4 py-3.5 rounded-xl font-medium text-[15px] transition-all duration-200 shadow-sm cursor-pointer ${currentStyle.buttonBg} ${type === "error" ? "w-full" : ""}`}
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
