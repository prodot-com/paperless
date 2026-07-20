import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const folders = await prisma.folder.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        _count: {
          select: {
            files: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(folders);
  } catch (error) {
    console.error("Get folders error:", error);

    return NextResponse.json(
      { error: "Failed to load folders" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const name = body.name?.trim();
    console.log("Nem is; ",name)

    if (!name) {
      return NextResponse.json(
        { error: "Folder name is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.folder.findFirst({
      where: {
        userId: session.user.id,
        name,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Folder already exists" },
        { status: 409 }
      );
    }

    const folder = await prisma.folder.create({
      data: {
        name,
        userId: session.user.id,
      },
    });

    return NextResponse.json(folder, {
      status: 201,
    });
  } catch (error) {
    console.error("Create folder error:", error);

    return NextResponse.json(
      { error: "Failed to create folder" },
      { status: 500 }
    );
  }
}