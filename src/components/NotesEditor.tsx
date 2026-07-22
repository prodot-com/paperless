"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  FileText,
  Link2,
  Loader2,
  Menu,
  PenLine,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import CustomModal from "./CustomModal";

type Note = {
  id: string;
  title: string;
  content: string;
};

type LinkPreview = {
  title?: string;
  description?: string;
  image?: string;
};

type ModalState = {
  isOpen: boolean;
  type: "confirm" | "error";
  title: string;
  message: string;
  onConfirm?: () => void | Promise<void>;
};

function cleanUrl(url: string) {
  return url.replace(/[),.]+$/, "");
}

function extractUrls(text: string) {
  const matches = text.match(/https?:\/\/[^\s]+/g) || [];
  return [...new Set(matches.map(cleanUrl))];
}

function noteExcerpt(content: string) {
  const excerpt = content.replace(/\s+/g, " ").trim();
  return excerpt ? excerpt.slice(0, 72) : "No thoughts yet…";
}

function wordCount(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

function timeLabel(date: Date | null) {
  if (!date) return "Not saved yet";
  return `Saved ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

export default function NotesEditor({
  initialNotes,
  initialActiveId,
}: {
  initialNotes: Note[];
  initialActiveId?: string | null;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [activeId, setActiveId] = useState<string | null>(
    initialActiveId ?? null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [linkPreviews, setLinkPreviews] = useState<Record<string, LinkPreview>>(
    {},
  );
  const [openPreviews, setOpenPreviews] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const previousId = useRef<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestedPreviews = useRef(new Set<string>());

  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: "confirm",
    title: "",
    message: "",
  });

  const activeNote = useMemo(
    () => notes.find((note) => note.id === activeId),
    [activeId, notes],
  );

  const filteredNotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return notes;

    return notes.filter((note) => {
      const content = note.content.slice(0, 700).toLowerCase();
      return (
        note.title.toLowerCase().includes(query) || content.includes(query)
      );
    });
  }, [notes, searchQuery]);

  const activeUrls = useMemo(
    () => extractUrls(activeNote?.content || ""),
    [activeNote?.content],
  );
  const showingPreviews = openPreviews && activeUrls.length > 0;

  const saveNote = useCallback(async (note: Note) => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: note.title, content: note.content }),
      });

      if (!response.ok) throw new Error("Save failed");
      setLastSaved(new Date());
    } catch {
      toast.error("Failed to sync note");
    } finally {
      setIsSaving(false);
    }
  }, []);

  const fetchPreview = useCallback(async (url: string) => {
    if (requestedPreviews.current.has(url)) return;
    requestedPreviews.current.add(url);

    try {
      const response = await fetch("/api/link-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error("Preview failed");
      const preview = (await response.json()) as LinkPreview;
      setLinkPreviews((previous) => ({ ...previous, [url]: preview }));
    } catch {
      requestedPreviews.current.delete(url);
    }
  }, []);

  useEffect(() => {
    if (initialActiveId) return;
    const savedNote = localStorage.getItem("activeNote");
    if (savedNote && initialNotes.some((note) => note.id === savedNote)) {
      setActiveId(savedNote);
    }
  }, [initialActiveId, initialNotes]);

  useEffect(() => {
    if (activeId) localStorage.setItem("activeNote", activeId);
  }, [activeId]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable);

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }

      if (event.key === "/" && !isTyping && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    const urls = extractUrls(activeNote?.content || "");
    if (!urls.length) return;

    const timer = window.setTimeout(() => {
      urls.forEach((url) => void fetchPreview(url));
    }, 450);

    return () => window.clearTimeout(timer);
  }, [activeNote?.content, fetchPreview]);

  useEffect(() => {
    if (!activeNote) return;

    if (previousId.current !== activeNote.id) {
      previousId.current = activeNote.id;
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => void saveNote(activeNote), 750);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [activeNote, saveNote]);

  function updateField(field: "title" | "content", value: string) {
    if (!activeNote) return;
    setNotes((previous) =>
      previous.map((note) =>
        note.id === activeNote.id ? { ...note, [field]: value } : note,
      ),
    );
  }

  function selectNote(id: string) {
    setActiveId(id);
    setOpenPreviews(false);
    if (window.innerWidth < 768) setSidebarOpen(false);
  }

  async function refreshNotes() {
    try {
      setIsRefreshing(true);
      const response = await fetch("/api/notes");
      if (!response.ok) throw new Error("Refresh failed");

      const freshNotes = (await response.json()) as Note[];
      setNotes(freshNotes);
      if (activeId && !freshNotes.some((note) => note.id === activeId)) {
        setActiveId(freshNotes[0]?.id || null);
      }
      toast.success("Notes archive refreshed");
    } catch {
      toast.error("Failed to refresh notes");
    } finally {
      setIsRefreshing(false);
    }
  }

  async function createNote() {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled", content: "" }),
      });
      if (!response.ok) throw new Error("Create failed");

      const newNote = (await response.json()) as Note;
      setNotes((previous) => [newNote, ...previous]);
      setActiveId(newNote.id);
      setSearchQuery("");
      setOpenPreviews(false);
      if (window.innerWidth < 768) setSidebarOpen(false);
      toast.success("New note created");
    } catch {
      toast.error("Failed to create note");
    }
  }

  function handleDeleteRequest(id: string, title: string) {
    setModal({
      isOpen: true,
      type: "confirm",
      title: "Delete note?",
      message: `Are you sure you want to permanently delete "${title || "Untitled"}"?`,
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/notes/${id}`, {
            method: "DELETE",
          });
          if (!response.ok) throw new Error("Delete failed");

          const updatedNotes = notes.filter((note) => note.id !== id);
          setNotes(updatedNotes);
          if (activeId === id) setActiveId(updatedNotes[0]?.id || null);
          toast.success("Note deleted");
        } catch {
          toast.error("Delete failed");
        }
      },
    });
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#FAFAFA] font-sans text-neutral-900 dark:bg-[#0A0A0A] dark:text-neutral-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-96 w-96 rounded-full bg-blue-400/25 blur-[120px] dark:bg-blue-600/10" />
        <div className="absolute -bottom-52 -right-52 h-[34rem] w-[34rem] rounded-full bg-indigo-400/10 blur-[120px] dark:bg-indigo-600/10" />
      </div>

      <CustomModal
        {...modal}
        onClose={() => setModal((previous) => ({ ...previous, isOpen: false }))}
      />

      <AnimatePresence>
        {sidebarOpen && (
          <motion.button
            type="button"
            aria-label="Close notes archive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 z-20 bg-neutral-950/20 backdrop-blur-[2px] md:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`absolute inset-y-0 left-0 z-30 flex h-screen w-[min(22rem,88vw)] shrink-0 flex-col border-r border-neutral-200/80 bg-white/85 shadow-2xl shadow-neutral-900/10 backdrop-blur-xl transition-transform duration-300 dark:border-neutral-800/80 dark:bg-[#0D0D0D]/90 dark:shadow-black/40 md:relative md:w-[21rem] md:translate-x-0 md:shadow-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="border-b border-neutral-100 p-5 dark:border-neutral-800 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                <FileText size={14} />
                Notes archive
              </div>
              <h1 className="mt-2 font-serif text-2xl tracking-tight text-neutral-800 dark:text-white">
                Your sheets
              </h1>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                {notes.length} note{notes.length === 1 ? "" : "s"} in your
                archive
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-xl p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-800 dark:hover:text-white md:hidden"
            >
              <X size={17} />
            </button>
          </div>

          <button
            type="button"
            onClick={createNote}
            className="group cursor-pointer mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-85 active:scale-[0.98] dark:bg-white dark:text-black"
          >
            <Plus
              size={17}
              className="transition-transform duration-300 group-hover:rotate-90"
            />
            New note
          </button>

          <div className="relative mt-3">
            <Search
              size={16}
              className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${searchQuery ? "text-blue-500" : "text-neutral-400"}`}
            />
            <input
              ref={searchInputRef}
              placeholder="Search your notes…"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-16 text-sm text-neutral-800 outline-none transition-all placeholder:text-neutral-400 focus:border-blue-500/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:bg-[#111]"
            />
            {searchQuery ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-white"
              >
                <X size={14} />
              </button>
            ) : (
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-neutral-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-500">
                ⌘K
              </kbd>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-5 pb-3 pt-5 sm:px-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
            {searchQuery
              ? `${filteredNotes.length} matches`
              : "Recently edited"}
          </p>
          <button
            type="button"
            aria-label="Refresh notes"
            title="Refresh notes"
            onClick={refreshNotes}
            className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            <RefreshCcw
              size={14}
              className={isRefreshing ? "animate-spin" : ""}
            />
          </button>
        </div>

        <div className="custom-scrollbar flex-1 space-y-1 overflow-y-auto px-3 pb-6 sm:px-4">
          <AnimatePresence mode="popLayout">
            {filteredNotes.length ? (
              filteredNotes.map((note) => (
                <motion.div
                  layout
                  key={note.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  onClick={() => selectNote(note.id)}
                  className={`group relative cursor-pointer overflow-hidden rounded-xl border p-3.5 transition-all duration-200 ${note.id === activeId ? "border-neutral-300 bg-neutral-100 shadow-sm dark:border-neutral-700 dark:bg-neutral-800" : "border-transparent hover:border-neutral-200 hover:bg-neutral-50 dark:hover:border-neutral-800 dark:hover:bg-neutral-900"}`}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${note.id === activeId ? "bg-white text-blue-500 shadow-sm dark:bg-neutral-700" : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800"}`}
                    >
                      <FileText size={15} />
                    </div>
                    <div className="min-w-0 flex-1 pr-5">
                      <h2
                        className={`truncate text-sm font-semibold ${note.id === activeId ? "text-neutral-900 dark:text-white" : "text-neutral-600 dark:text-neutral-300"}`}
                      >
                        {note.title || "Untitled note"}
                      </h2>
                      <p className="mt-1 truncate text-[11px] leading-relaxed text-neutral-400 dark:text-neutral-500">
                        {noteExcerpt(note.content)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={`Delete ${note.title || "untitled note"}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeleteRequest(note.id, note.title);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-neutral-300 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100 focus:opacity-100 dark:text-neutral-600 dark:hover:bg-rose-500/10"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center px-6 py-16 text-center">
                <Search
                  size={24}
                  className="mb-3 text-neutral-300 dark:text-neutral-600"
                />
                <p className="font-serif text-lg text-neutral-600 dark:text-neutral-300">
                  {searchQuery ? "No matching notes" : "Your archive is empty"}
                </p>
                <p className="mt-1 text-xs leading-5 text-neutral-400">
                  {searchQuery
                    ? "Try another word or phrase."
                    : "Create a note to get started."}
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      <main className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="flex min-h-18 items-center justify-between border-b border-neutral-200/80 bg-white/65 px-4 py-3 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-[#0D0D0D]/65 sm:px-6 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open notes archive"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white md:hidden"
            >
              <Menu size={19} />
            </button>
            <div
              className={`h-2 w-2 shrink-0 rounded-full ${isSaving ? "animate-pulse bg-blue-500" : "bg-emerald-500"}`}
            />
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                {activeNote?.title || "No note selected"}
              </p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                {isSaving ? "Syncing changes" : timeLabel(lastSaved)}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {activeUrls.length > 0 && (
              <button
                type="button"
                onClick={() => setOpenPreviews((open) => !open)}
                className={`flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${showingPreviews ? "bg-neutral-900 text-white dark:bg-white dark:text-black" : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"}`}
              >
                {showingPreviews ? <EyeOff size={15} /> : <Eye size={15} />}
                <span className="hidden sm:inline">
                  {showingPreviews ? "Write" : "Links"}
                </span>
                <span className="hidden rounded-md bg-white/15 px-1.5 py-0.5 text-[10px] sm:inline dark:bg-black/10">
                  {activeUrls.length}
                </span>
              </button>
            )}
            <button
              type="button"
              aria-label="Refresh archive"
              title="Refresh archive"
              onClick={refreshNotes}
              className="rounded-xl cursor-pointer p-2.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
            >
              <RefreshCcw
                size={16}
                className={isRefreshing ? "animate-spin" : ""}
              />
            </button>
          </div>
        </header>

        <div className="custom-scrollbar relative flex-1 overflow-y-auto">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.045]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "25px 25px",
            }}
          />

          <AnimatePresence mode="wait">
            {activeNote ? (
              <motion.section
                key={`${activeId}-${showingPreviews ? "links" : "editor"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="relative mx-auto flex min-h-full w-full max-w-5xl flex-col px-4 py-5 sm:px-7 md:px-6 md:py-5"
              >
                <div className="flex min-h-[calc(100vh-9rem)] flex-1 flex-col rounded-[1.75rem] border border-neutral-200/80 bg-white/70 p-6 shadow-xl shadow-neutral-200/20 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/65 dark:shadow-none sm:p-8 md:p-12">
                  {showingPreviews ? (
                    <LinkDesk urls={activeUrls} previews={linkPreviews} />
                  ) : (
                    <>
                      <div className="mb-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                        <style
                          dangerouslySetInnerHTML={{
                            __html: `
      .premium-scrollbar{
        scrollbar-width:thin;
      }

      .premium-scrollbar::-webkit-scrollbar{
        width:6px;
      }

      .premium-scrollbar::-webkit-scrollbar-track{
        background:transparent;
      }

      .premium-scrollbar::-webkit-scrollbar-thumb{
        border-radius:999px;
        border:2px solid transparent;
        background-clip:padding-box;
        transition:all .25s ease;
      }

      /* Light */
      .premium-scrollbar::-webkit-scrollbar-thumb{
        background-color:rgba(0,0,0,.14);
      }

      .premium-scrollbar:hover::-webkit-scrollbar-thumb{
        background-color:rgba(0,0,0,.28);
      }

      /* Dark */
      .dark .premium-scrollbar::-webkit-scrollbar-thumb{
        background-color:rgba(255,255,255,.12);
      }

      .dark .premium-scrollbar:hover::-webkit-scrollbar-thumb{
        background-color:rgba(255,255,255,.25);
      }

      .premium-scrollbar::-webkit-scrollbar-thumb:active{
        background-color:rgba(59,130,246,.65);
      }
    `,
                          }}
                        />
                        <PenLine size={14} />
                        Writing space
                      </div>
                      <input
                        value={activeNote.title}
                        onChange={(event) =>
                          updateField("title", event.target.value)
                        }
                        className="w-full bg-transparent font-serif text-4xl tracking-tight text-neutral-900 outline-none placeholder:text-neutral-200 dark:text-white dark:placeholder:text-neutral-800 sm:text-5xl md:text-6xl"
                        placeholder="Untitled note"
                      />
                      <div className="my-7 h-px bg-neutral-200/80 dark:bg-neutral-800" />
                      <textarea
                        value={activeNote.content}
                        onChange={(event) =>
                          updateField("content", event.target.value)
                        }
                        className="min-h-[42vh] premium-scrollbar flex-1 resize-none bg-transparent text-base leading-8 text-neutral-600 outline-none placeholder:text-neutral-300 dark:text-neutral-300 dark:placeholder:text-neutral-600 sm:text-lg"
                        placeholder="Start writing your thoughts…"
                      />
                      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-5 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400 dark:border-neutral-800">
                        <div className="flex items-center gap-4">
                          <span>{wordCount(activeNote.content)} words</span>
                          <span>{activeNote.content.length} characters</span>
                        </div>
                        <span className="flex items-center gap-1.5">
                          {isSaving ? (
                            <Loader2
                              size={12}
                              className="animate-spin text-blue-500"
                            />
                          ) : (
                            <Check size={12} className="text-emerald-500" />
                          )}
                          {isSaving ? "Saving" : "Autosave on"}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </motion.section>
            ) : (
              <EmptyEditor
                onCreate={createNote}
                onOpenArchive={() => setSidebarOpen(true)}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function LinkDesk({
  urls,
  previews,
}: {
  urls: string[];
  previews: Record<string, LinkPreview>;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
        <Link2 size={14} />
        Linked references
      </div>
      <h2 className="mt-3 font-serif text-3xl tracking-tight text-neutral-800 dark:text-white">
        Your link desk
      </h2>
      <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
        Reference cards found in this note. Open any source in a new tab.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {urls.map((url, index) => {
          const preview = previews[url];
          return (
            <motion.a
              key={url}
              href={url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500/30 hover:shadow-lg dark:border-neutral-800 dark:bg-[#111]"
            >
              <div className="relative flex aspect-[16/8] items-center justify-center overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                {preview?.image ? (
                  <img
                    src={preview.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <Link2
                    size={26}
                    className="text-neutral-300 dark:text-neutral-600"
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <h3 className="min-w-0 flex-1 line-clamp-2 font-serif text-lg leading-snug text-neutral-800 transition-colors group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400">
                    {preview?.title || new URL(url).hostname}
                  </h3>
                  <ExternalLink
                    size={15}
                    className="mt-1 shrink-0 text-neutral-300 dark:text-neutral-600"
                  />
                </div>
                <p className="mt-2 line-clamp-3 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                  {preview?.description || url}
                </p>
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}

function EmptyEditor({
  onCreate,
  onOpenArchive,
}: {
  onCreate: () => void;
  onOpenArchive: () => void;
}) {
  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-neutral-200 bg-white text-blue-500 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
        <FileText size={32} />
      </div>
      <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
        Notes archive
      </p>
      <h2 className="mt-2 font-serif text-3xl tracking-tight text-neutral-800 dark:text-white">
        A clear page is waiting.
      </h2>
      <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-500 dark:text-neutral-400">
        Open a note from your archive, or start a fresh thought whenever
        you&apos;re ready.
      </p>
      <div className="mt-7 flex gap-3">
        <button
          type="button"
          onClick={onCreate}
          className="flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-80 dark:bg-white dark:text-black"
        >
          <Plus size={16} /> New note
        </button>
        <button
          type="button"
          onClick={onOpenArchive}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 md:hidden"
        >
          Open archive
        </button>
      </div>
    </div>
  );
}
