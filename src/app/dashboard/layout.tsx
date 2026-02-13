import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const storageAgg = await prisma.file.aggregate({
    where: { userId: session.user.id },
    _sum: { size: true },
  });

  const storageUsed = storageAgg._sum.size ?? 0;

  return (
    <Dashboard
      session={session}
      storageUsed={storageUsed}
    >
      {children}
    </Dashboard>
  );
}
