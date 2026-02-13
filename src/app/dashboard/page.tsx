import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/Dashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/");
  }

  const totalSize = await prisma.file.aggregate({
    where: { userId: session.user.id },
    _sum: {
      size: true,
    },
  });

  const storageUsed = totalSize._sum.size || 0;

  return (
    <DashboardClient
      session={session}
      storageUsed={storageUsed}
    />
  );
}
