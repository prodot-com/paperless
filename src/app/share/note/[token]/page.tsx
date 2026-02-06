import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function SharedNote({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const share = await prisma.shareToken.findUnique({ where: { token } });

  if (
    !share ||
    share.type !== "note" ||
    (share.expiresAt && share.expiresAt < new Date())
  ) {
    notFound();
  }

  const note = await prisma.note.findUnique({
    where: { id: share.resourceId },
  });

  if (!note) notFound();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{note.title}</h1>
      <p>{note.content}</p>
      <p style={{ opacity: 0.6 }}>Read-only</p>
    </div>
  );
}
