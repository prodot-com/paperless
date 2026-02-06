"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type FileItem = {
  id: string;
  name: string;
  path: string;
  size: number;
  createdAt: string;
};

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔐 Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // 📂 Fetch user files
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/upload")
        .then((res) => res.json())
        .then(setFiles);
    }
  }, [status]);

  async function uploadFile() {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    setFile(null);
    setLoading(false);

    // refresh list
    const res = await fetch("/api/upload");
    setFiles(await res.json());
  }

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>File Upload</h1>
      <p>Logged in as {session?.user?.email}</p>

      <div style={{ marginTop: "1rem" }}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button onClick={uploadFile} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <hr style={{ margin: "2rem 0" }} />

<h2>Your Files</h2>

{files.length === 0 && <p>No files uploaded</p>}

{files.map((f) => (
  <div
    key={f.id}
    style={{
      display: "flex",
      gap: "1rem",
      alignItems: "center",
      marginBottom: "0.5rem",
    }}
  >
    {/* 👁️ VIEW */}
    <a href={f.path} target="_blank">
      {f.name}
    </a>

    <button
  onClick={async () => {
    const res = await fetch(`/api/upload/${f.id}/view`);
    const { url } = await res.json();
    window.open(url, "_blank");
  }}
>
  View
</button>

<button
  onClick={async () => {
    const newName = prompt("Rename file", f.name);
    if (!newName || newName === f.name) return;

    await fetch(`/api/upload/${f.id}/rename`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });

    setFiles((prev) =>
      prev.map((x) => (x.id === f.id ? { ...x, name: newName } : x))
    );
  }}
>
  Rename
</button>


<button
  onClick={async () => {
    const res = await fetch(`/api/upload/${f.id}/download`);
    const { url } = await res.json();
    window.open(url, "_blank");
  }}
>
  Download
</button>



    <span>({Math.round(f.size / 1024)} KB)</span>

    {/* 🗑️ DELETE */}
    <button
      onClick={async () => {
        if (!confirm("Delete this file?")) return;

        await fetch(`/api/upload/${f.id}`, {
          method: "DELETE",
        });

        setFiles((prev) => prev.filter((x) => x.id !== f.id));
      }}
    >
      Delete
    </button>
  </div>
))}

    </div>
  );
}
