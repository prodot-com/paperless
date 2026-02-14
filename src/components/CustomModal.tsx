"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: "success" | "error" | "confirm";
  onConfirm?: () => void;
};

export default function CustomModal({ isOpen, onClose, title, message, type, onConfirm }: ModalProps) {
  const iconMap = {
    success: <CheckCircle2 className="text-green-500" size={28} />,
    error: <AlertCircle className="text-red-500" size={28} />,
    confirm: <HelpCircle className="text-blue-500" size={28} />,
  };

  const bgMap = {
    success: "bg-green-50 dark:bg-green-500/10",
    error: "bg-red-50 dark:bg-red-500/10",
    confirm: "bg-blue-50 dark:bg-blue-500/10",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Glassmorphism Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-white/40 dark:bg-black/60 backdrop-blur-md"
          />
          
          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-white dark:bg-[#0d0d0d] border border-neutral-100 dark:border-neutral-800 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden transition-colors"
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-4 rounded-2xl mb-5 ${bgMap[type]}`}>
                {iconMap[type]}
              </div>
              
              <h3 className="text-xl font-medium tracking-tight mb-2 text-neutral-900 dark:text-white">
                {title}
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-8 leading-relaxed px-2">
                {message}
              </p>
              
              <div className="flex gap-3 w-full">
                {type === 'confirm' && (
                  <button 
                    onClick={onClose} 
                    className="flex-1 px-4 py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 font-medium text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  onClick={() => { 
                    if(type === 'confirm' && onConfirm) onConfirm(); 
                    onClose(); 
                  }}
                  className={`flex-1 px-4 py-3 rounded-2xl font-medium text-sm transition-all shadow-md cursor-pointer ${
                    type === 'error' 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-80'
                  }`}
                >
                  {type === 'confirm' ? 'Confirm' : 'Dismiss'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}