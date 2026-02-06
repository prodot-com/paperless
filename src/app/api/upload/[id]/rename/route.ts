import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { name } = await req.json();

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }

  const file = await prisma.file.findUnique({ where: { id } });

  if (!file || file.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.file.update({
    where: { id },
    data: { name },
  });

  return NextResponse.json(updated);
}
