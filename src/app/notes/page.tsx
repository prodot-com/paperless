import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import  prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import NotesClient from "./NotesClient";
import EditNote from "./EditNotes";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { q } = await searchParams;
  const query = q ?? "";

  const notes = await prisma.note.findMany({
    where: {
      userId: session.user.id,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <h1>Your Notes</h1>

      <NotesClient />

      <form>
        <input
          name="q"
          placeholder="Search notes..."
          defaultValue={query}
        />
      </form>

      <hr />

      {notes.map((note) => (
        <EditNote key={note.id} note={note} />
      ))}
    </div>
  );
}
