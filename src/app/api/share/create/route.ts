import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, resourceId, expiresInHours } = await req.json();

  if (!["note", "file"].includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const token = crypto.randomBytes(32).toString("hex");

  const expiresAt = expiresInHours
    ? new Date(Date.now() + expiresInHours * 60 * 60 * 1000)
    : null;

  const share = await prisma.shareToken.create({
    data: {
      token,
      type,
      resourceId,
      expiresAt,
      userId: session.user.id,
    },
  });

  return NextResponse.json({
    url: `${process.env.NEXTAUTH_URL}/share/${type}/${share.token}`,
  });
}
