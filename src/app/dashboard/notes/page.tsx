import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import NotesEditor from "@/components/NotesEditor";

export default async function NotesPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = await searchParams;   // 👈 MUST await
  const query = params?.q ?? "";

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
  <NotesEditor
    initialNotes={notes.map((note) => ({
      id: note.id,
      title: note.title,
      content: note.content ?? "", // ✅ fix here
    }))}
  />
);

}
