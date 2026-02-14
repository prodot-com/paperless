"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Loader2, Trash2, Plus, FileText, Search, Clock, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CustomModal from "./CustomModal";

type Note = {
  id: string;
  title: string;
  content: string;
};

export default function NotesEditor({
  initialNotes,
}: {
  initialNotes: Note[];
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [activeId, setActiveId] = useState<string | null>(initialNotes[0]?.id ?? null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Modal State for Deletion
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: "confirm" | "error";
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ isOpen: false, type: "confirm", title: "", message: "" });

  const activeNote = notes.find((n) => n.id === activeId);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  function updateField(field: "title" | "content", value: string) {
    if (!activeNote) return;
    setNotes((prev) =>
      prev.map((n) => (n.id === activeNote.id ? { ...n, [field]: value } : n))
    );
  }

  useEffect(() => {
    if (!activeNote) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { saveNote(); }, 800);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [activeNote?.title, activeNote?.content]);

  async function saveNote() {
    if (!activeNote) return;
    try {
      setIsSaving(true);
      const res = await fetch(`/api/notes/${activeNote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: activeNote.title,
          content: activeNote.content,
        }),
      });
      if (!res.ok) throw new Error();
    } catch {
      toast.error("Failed to sync note");
    } finally {
      setIsSaving(false);
    }
  }

  async function createNote() {
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled", content: "" }),
      });
      if (!res.ok) throw new Error();
      const newNote = await res.json();
      setNotes((prev) => [newNote, ...prev]);
      setActiveId(newNote.id);
      toast.success("New sheet added");
    } catch {
      toast.error("Failed to create note");
    }
  }

  const handleDeleteRequest = (id: string, title: string) => {
    setModal({
      isOpen: true,
      type: "confirm",
      title: "Shred Note?",
      message: `Are you sure you want to permanently delete "${title || 'Untitled'}"?`,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error();
          setNotes((prev) => prev.filter((n) => n.id !== id));
          if (activeId === id) setActiveId(notes.find(n => n.id !== id)?.id ?? null);
          toast.success("Note shredded");
        } catch {
          toast.error("Delete failed");
        }
      }
    });
  };

  return (
    <div className="flex h-screen bg-[#FDFDFD] dark:bg-[#0a0a0a] transition-colors overflow-hidden">
      <CustomModal {...modal} onClose={() => setModal({ ...modal, isOpen: false })} />

      {/* Sidebar - Digital Filing Cabinet */}
      <aside className="w-[320px] md:w-[380px] border-r border-neutral-100 dark:border-neutral-800 flex flex-col bg-white dark:bg-[#0a0a0a]">
        <div className="p-6">
          <button
            onClick={createNote}
            className="w-full flex items-center justify-center gap-2 mb-6 px-4 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:opacity-80 transition-all shadow-lg shadow-neutral-200 dark:shadow-none"
          >
            <Plus size={18} /> New Note
          </button>
          
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input 
              placeholder="Search notes..." 
              className="w-full bg-neutral-50 dark:bg-neutral-900 border-none rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:ring-1 ring-neutral-200 dark:ring-neutral-800"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setActiveId(note.id)}
              className={`group p-4 rounded-2xl cursor-pointer transition-all duration-200 flex justify-between items-center ${
                note.id === activeId
                  ? "bg-neutral-50 dark:bg-neutral-900 translate-x-1 shadow-sm"
                  : "hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-2 h-2 rounded-full shrink-0 ${note.id === activeId ? 'bg-blue-500 animate-pulse' : 'bg-neutral-200 dark:bg-neutral-800 group-hover:bg-neutral-300'}`} />
                <div className="truncate">
                  <p className={`text-sm font-medium truncate ${note.id === activeId ? 'text-neutral-900 dark:text-white' : 'text-neutral-500'}`}>
                    {note.title || "Untitled"}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1 font-bold">
                    {note.content ? `${note.content.substring(0, 20)}...` : "Empty sheet"}
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteRequest(note.id, note.title);
                }}
                className="opacity-0 group-hover:opacity-100 p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Editor Surface */}
      <main className="flex-1 flex flex-col relative">
        {/* Subtle Background SVG Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="editor-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#editor-grid)" />
          </svg>
        </div>

        <header className="relative z-10 px-8 py-6 flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 backdrop-blur-sm bg-white/50 dark:bg-black/50">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
            <Clock size={12} />
            <span>{isSaving ? "Syncing to vault..." : "Saved to vault"}</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">Markdown View</button>
          </div>
        </header>

        <div className="flex-1 relative z-10 overflow-y-auto px-8 py-12 md:px-20 lg:px-32 max-w-5xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {activeNote ? (
              <motion.div 
                key={activeId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full flex flex-col"
              >
                <input
                  value={activeNote.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="text-4xl md:text-5xl font-serif italic tracking-tight w-full mb-10 outline-none bg-transparent placeholder:text-neutral-200 dark:placeholder:text-neutral-800"
                  placeholder="The Title..."
                />

                <textarea
                  value={activeNote.content}
                  onChange={(e) => updateField("content", e.target.value)}
                  className="flex-1 w-full resize-none outline-none bg-transparent text-lg font-light leading-relaxed text-neutral-700 dark:text-neutral-300 placeholder:text-neutral-200 dark:placeholder:text-neutral-800"
                  placeholder="Start your digital legacy here..."
                />
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-900 rounded-3xl flex items-center justify-center border border-neutral-100 dark:border-neutral-800">
                  <FileText className="text-neutral-200 dark:text-neutral-800" size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-medium">No sheet selected</h3>
                  <p className="text-sm text-neutral-400 font-light">Choose a note from the archive or create a new entry.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}