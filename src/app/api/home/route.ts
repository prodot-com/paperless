import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const [totalNotes, totalFiles, files, recentNotes] = await Promise.all([
    prisma.note.count({
      where: { userId },
    }),

    prisma.file.count({
      where: { userId },
    }),

    prisma.file.findMany({
      where: { userId },
      select: { size: true },
    }),

    prisma.note.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true },
    }),
  ]);

  const storageUsed = files.reduce((acc, file) => acc + file.size, 0);

  return NextResponse.json({
    totalNotes,
    totalFiles,
    storageUsed,
    storageLimit: 1 * 1024 * 1024 * 1024,
    recentNotes,
  });
}
