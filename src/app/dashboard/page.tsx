import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Workspace from "@/components/Workspace";

export default async function DashboardHome() {
  const session = await getServerSession(authOptions);

  const totalNotes = await prisma.note.count({
    where: { userId: session?.user?.id },
  });

  const totalFiles = await prisma.file.count({
    where: { userId: session?.user?.id },
  });

  const storageAgg = await prisma.file.aggregate({
    where: { userId: session?.user?.id },
    _sum: { size: true },
  });

  const recentFiles = await prisma.file.findMany({
    where: { userId: session?.user?.id },
    select: { name: true },
    orderBy: { createdAt: "desc" },
  });

  const recentNotes = await prisma.note.findMany({
    where: { userId: session?.user?.id },
    orderBy: { updatedAt: "desc" },
    take: 5,
    select: { id: true, title: true },
  });

  console.log(session?.user);
  const storageUsed = storageAgg._sum.size ?? 0;

  return (
    <Workspace
      totalNotes={totalNotes}
      totalFiles={totalFiles}
      storageUsed={storageUsed}
      recentNotes={recentNotes}
      recentFiles={recentFiles}
      session={session?.user}
    />
  );
}

// prisma.file.findMany({
//       where: { userId },
//       select: { size: true },
//     }),
//     prisma.note.findMany({
//       where: { userId },
//       orderBy: { updatedAt: "desc" },
//       take: 5,
//       select: { id: true, title: true },
//     }),
