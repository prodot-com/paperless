"use client";

import { useState } from "react";

type Note = {
  id: string;
  title: string;
  content: string | null; // ✅ FIX
};

export default function EditNote({ note }: { note: Note }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content ?? "");

  async function save() {
    await fetch(`/api/notes/${note.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    setEditing(false);
    location.reload();
  }

  if (!editing) {
    return (
      <div>
        <h3>{note.title}</h3>
        <p>{note.content ?? ""}</p>
        <button onClick={() => setEditing(true)}>Edit</button>
      </div>
    );
  }

  return (
    <div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={save}>Save</button>
      <button onClick={() => setEditing(false)}>Cancel</button>
    </div>
  );
}
