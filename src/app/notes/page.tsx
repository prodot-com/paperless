import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import NotesClient from "./NotesClient";
import EditNote from "./EditNotes";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const query = searchParams.q || "";

  const notes = await prisma.note.findMany({
    where: {
      userId: session.user.id,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div>
      <h1>Your Notes</h1>

      <NotesClient />

      <form>
        <input name="q" placeholder="Search notes..." defaultValue={query} />
      </form>

      <hr />

      {notes.length === 0 && <p>No notes found</p>}

      {notes.map((note) => (
        <EditNote key={note.id} note={note} />
      ))}

      {notes.map((note) => (
        <div key={note.id}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
        </div>
      ))}
    </div>
  );
}
