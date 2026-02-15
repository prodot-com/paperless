"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { toast } from "sonner";
import {
    Loader2,
    Trash2,
    Plus,
    FileText,
    Search,
    Clock,
    X,
    ChevronLeft, 
    MoreVertical,
    Menu,
    RefreshCw,
    RefreshCcw, 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CustomModal from "./CustomModal";

type Note = {
    id: string;
    title: string;
    content: string;
};

export default function NotesEditor({
    initialNotes,
    initialActiveId
}: {
    initialNotes: Note[];
    initialActiveId?: string | null
}) {
    const [notes, setNotes] = useState(initialNotes);
    const [activeId, setActiveId] = useState<string | null>(
  initialActiveId ?? null
);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    

    const previousId = useRef<string | null>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const [modal, setModal] = useState<{
        isOpen: boolean;
        type: "confirm" | "error";
        title: string;
        message: string;
        onConfirm?: () => void;
    }>({
        isOpen: false,
        type: "confirm",
        title: "",
        message: "",
    });

    const activeNote = notes.find((n) => n.id === activeId);

    useEffect(() => {
    const saved = localStorage.getItem("activeNote");
    const isMobile = window.innerWidth < 768;

    if (!isMobile && saved) {
        setActiveId(saved);
    }

    if (isMobile) {
        setSidebarOpen(true);
    }
    }, []);

    useEffect(() => {
        if (activeId) {
            localStorage.setItem("activeNote", activeId);
        }
    }, [activeId]);

    const filteredNotes = useMemo(() => {
        const searchStr = searchQuery.toLowerCase();
        return notes.filter((note) => {
            const safeContent = note.content.slice(0, 500);
            return (
                note.title.toLowerCase().includes(searchStr) ||
                safeContent.toLowerCase().includes(searchStr)
            );
        });
    }, [notes, searchQuery]);

    function updateField(field: "title" | "content", value: string) {
        if (!activeNote) return;
        setNotes((prev) =>
            prev.map((n) =>
                n.id === activeNote.id ? { ...n, [field]: value } : n
            )
        );
    }

    useEffect(() => {
        if (!activeNote) return;
        if (previousId.current !== activeNote.id) {
            previousId.current = activeNote.id;
            return;
        }
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
            setLastSaved(new Date());
        } catch {
            toast.error("Failed to sync note");
        } finally {
            setIsSaving(false);
        }
    }

    async function refreshNotes() {
    try {
        setIsRefreshing(true)
        setIsSaving(true);

        const res = await fetch("/api/notes", {
            method: "GET",
        });

        if (!res.ok) throw new Error();

        const freshNotes = await res.json();
        setNotes(freshNotes);

        toast.success("Vault refreshed");
        setIsRefreshing(false)
    } catch {
        toast.error("Failed to refresh");
        setIsRefreshing(false)
    } finally {
        setIsSaving(false);
        setIsRefreshing(false)
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
            setSearchQuery("");
            setSidebarOpen(false);
            toast.success("New sheet added");
        } catch {
            toast.error("Failed to create note");
        }
    }

    function handleDeleteRequest(id: string, title: string) {
        setModal({
            isOpen: true,
            type: "confirm",
            title: "Shred Note?",
            message: `Are you sure you want to permanently delete "${title || "Untitled"}"?`,
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
                    if (!res.ok) throw new Error();
                    setNotes((prev) => {
                        const updated = prev.filter((n) => n.id !== id);
                        if (activeId === id) setActiveId(updated[0]?.id ?? null);
                        return updated;
                    });
                    toast.success("Note shredded");
                } catch {
                    toast.error("Delete failed");
                }
            },
        });
    }

    return (
        <div className="flex h-screen bg-[#FDFDFD] dark:bg-[#0a0a0a] transition-colors overflow-hidden font-sans relative">
            <CustomModal
                {...modal}
                onClose={() => setModal({ ...modal, isOpen: false })}
            />

            
            <aside className={`
                absolute md:relative z-30 h-full bg-white dark:bg-[#0a0a0a] transition-all duration-300 ease-in-out
                w-full md:w-[320px] lg:w-[380px] border-r border-neutral-100 dark:border-neutral-800 flex flex-col
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}>
                <div className="p-6">
                    <button
                        onClick={createNote}
                        className="w-full group relative flex items-center justify-center gap-2 mb-6 px-4 py-3 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-sm font-medium hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-neutral-200 dark:shadow-none"
                    >
                        <Plus size={18} className="transition-transform group-hover:rotate-90" />
                        New Sheet
                    </button>

                    <div className="relative group">
                        <Search size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${searchQuery ? "text-blue-500" : "text-neutral-400"}`} />
                        <input
                            placeholder="Search through vault..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-transparent focus:border-neutral-200 dark:focus:border-neutral-800 rounded-2xl py-3 pl-11 pr-10 text-[13px] outline-none transition-all placeholder:text-neutral-400"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-10 custom-scrollbar">
                    <AnimatePresence mode="popLayout">
                        {filteredNotes.length > 0 ? (
                            filteredNotes.map((note) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={note.id}
                                    onClick={() => {
                                        setActiveId(note.id);
                                        if (window.innerWidth < 768) setSidebarOpen(false);
                                    }}
                                    className={`group relative p-4 rounded-[20px] cursor-pointer transition-all duration-300 overflow-hidden ${
                                        note.id === activeId
                                            ? "bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-sm"
                                            : "hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 border border-transparent"
                                    }`}
                                >
                                    <div className="flex flex-col gap-1 pr-6">
                                        <h3 className={`text-sm font-medium truncate tracking-tight ${note.id === activeId ? "text-neutral-900 dark:text-white" : "text-neutral-600 dark:text-neutral-400"}`}>
                                            {note.title || "Untitled sheet"}
                                        </h3>
                                        <p className="text-[11px] text-neutral-400 leading-relaxed truncate font-light">
                                            {note.content ? note.content.slice(0, 45) : "No thoughts yet..."}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteRequest(note.id, note.title); }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 md:opacity-0 group-hover:opacity-100 p-2.5 text-neutral-300 hover:text-red-500 rounded-xl transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </motion.div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 px-6 opacity-30 text-center">
                                <Search size={32} className="mb-3" />
                                <p className="text-xs font-light italic tracking-wide">The archive is silent.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </aside>

            <main className="flex-1 flex flex-col relative bg-[#FDFDFD] dark:bg-[#0a0a0a] min-w-0">
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
                    <svg width="100%" height="100%">
                        <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                    </svg>
                </div>

            <header className="relative z-10 px-6 md:px-10 py-5 md:py-7 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-black/70 backdrop-blur-xl">

            <div className="flex items-center gap-3">

                <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 -ml-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors"
                >
                <ChevronLeft size={20} />
                </button>
                <div
                className={`w-2 h-2 rounded-full ${
                    isSaving ? "bg-blue-500 animate-pulse" : "bg-green-500"
                }`}
                />

                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400 select-none">
                {isSaving
                    ? "Syncing..."
                    : lastSaved
                    ? `Saved • ${lastSaved.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}`
                    : "Draft"}
                </span>
            </div>

            <button
                onClick={refreshNotes}
                className="flex items-center gap-2 px-1 py-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
                <RefreshCcw
                size={17}
                className={isRefreshing ? "animate-spin" : ""}
                />
                
            </button>

            </header>


                <div className="flex-1 relative z-10 overflow-y-auto w-full max-w-5xl mx-auto custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {activeNote ? (
                            <motion.div
                                key={activeId}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                                className="h-full flex flex-col px-6 md:px-24 py-10 md:py-16"
                            >
                                <input
                                    value={activeNote.title}
                                    onChange={(e) => updateField("title", e.target.value)}
                                    className="text-3xl md:text-6xl font-serif italic tracking-tight w-full mb-6 md:mb-12 outline-none bg-transparent placeholder:text-neutral-200 dark:placeholder:text-neutral-800 text-neutral-900 dark:text-white"
                                    placeholder="The Title..."
                                />

                                <textarea
                                    value={activeNote.content}
                                    onChange={(e) => updateField("content", e.target.value)}
                                    className="flex-1 w-full resize-none outline-none bg-transparent text-base md:text-xl leading-[1.8] font-light text-neutral-600 dark:text-neutral-400 placeholder:text-neutral-200 dark:placeholder:text-neutral-800 pb-20"
                                    placeholder="Pour your thoughts..."
                                />
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center gap-6 text-neutral-300 dark:text-neutral-800 transition-opacity p-6">
                                <div className="w-20 h-20 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-[30px] flex items-center justify-center animate-pulse">
                                    <FileText size={40} strokeWidth={1} />
                                </div>
                                <button 
                                    onClick={() => setSidebarOpen(true)}
                                    className="md:hidden px-6 py-2 bg-neutral-100 dark:bg-neutral-900 rounded-full text-xs font-medium"
                                >
                                    Open Archive
                                </button>
                                <p className="text-sm font-light italic hidden md:block">Select an archive to begin.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}