"use client"

import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { useState } from 'react';
import { ShieldAlert, Trash2 } from 'lucide-react';
import CustomModal from '@/components/CustomModal'; // Ensure correct path

const DeleteComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function handleDeleteAccount() {
    const toastId = toast.loading("Deleting account data...");

    try {
      const res = await fetch("/api/account/delete", {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      toast.success("Account deleted successfully", { id: toastId });
      
      setTimeout(async () => {
        await signOut({ callbackUrl: "/" });
      }, 1000);
      
    } catch {
      toast.error("Account deletion process failed", { id: toastId });
    }
  }

  return (
    <div className="space-y-6">
      <CustomModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="delete" 
        title="Permanently Delete Account?"
        message="This action is irreversible. Your entire digital archive, including all notes and files, will be deleted from Paperless."
        onConfirm={handleDeleteAccount}
      />

      <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors">
        <div className="flex items-center gap-5 text-center md:text-left">
          <div className="p-4 bg-white dark:bg-red-900/20 rounded-2xl shadow-sm text-red-500">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h4 className="text-lg font-medium text-neutral-900 dark:text-white">Danger Zone</h4>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light italic font-serif">
              Permanently remove your digital footprint from Paperless.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="group relative cursor-pointer px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-red-500/20 active:scale-95 flex items-center gap-3 overflow-hidden"
        >
          <Trash2 size={16} className="group-hover:rotate-12 transition-transform" />
          <span>Delete Account</span>
          
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </button>
      </div>
    </div>
  )
}

export default DeleteComponent