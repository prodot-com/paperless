"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, HelpCircle, Type } from "lucide-react";
import { useState, useEffect } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "error" | "confirm" | "rename";
  title: string;
  message: string;
  defaultValue?: string;
  onConfirm?: (value?: string) => void;
};

export default function CustomModal({ isOpen, onClose, type, title, message, defaultValue, onConfirm }: ModalProps) {
  const [inputValue, setInputValue] = useState(defaultValue || "");

  // Reset input value when modal opens with a new default
  useEffect(() => {
    if (isOpen) setInputValue(defaultValue || "");
  }, [isOpen, defaultValue]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-white/60 dark:bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-white dark:bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl p-8"
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-2xl mb-4 ${
                type === 'error' ? 'bg-red-50 text-red-500 dark:bg-red-500/10' : 
                type === 'rename' ? 'bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10' :
                'bg-blue-50 text-blue-500 dark:bg-blue-500/10'
              }`}>
                {type === 'error' ? <AlertCircle size={28} /> : 
                 type === 'rename' ? <Type size={28} /> : 
                 <HelpCircle size={28} />}
              </div>
              
              <h3 className="text-xl font-medium tracking-tight mb-2">{title}</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6 leading-relaxed">{message}</p>
              
              {type === "rename" && (
                <div className="w-full mb-8">
                  <input 
                    autoFocus
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="New file name..."
                  />
                </div>
              )}

              <div className="flex gap-3 w-full">
                {(type === 'confirm' || type === 'rename') && (
                  <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 font-medium text-sm hover:opacity-80 transition-all cursor-pointer">
                    Cancel
                  </button>
                )}
                <button 
                  onClick={() => { 
                    if(onConfirm) onConfirm(type === 'rename' ? inputValue : undefined); 
                    onClose(); 
                  }}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium text-sm transition-all shadow-sm cursor-pointer ${
                    type === 'error' ? 'bg-red-500 text-white' : 'bg-black dark:bg-white text-white dark:text-black'
                  }`}
                >
                  {type === 'error' ? 'Dismiss' : type === 'rename' ? 'Update' : 'Confirm'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}