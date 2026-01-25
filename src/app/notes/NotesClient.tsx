"use client";

import { useState } from "react";

export default function NotesClient() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function createNote() {
    setLoading(true);

    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    setTitle("");
    setContent("");
    setLoading(false);

    location.reload(); // simple + effective
  }

  return (
    <div>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={createNote} disabled={loading}>
        {loading ? "Saving..." : "Add Note"}
      </button>
    </div>
  );
}
