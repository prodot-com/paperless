import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Check if the user's vault is public
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isVaultPublic: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    if (!user.isVaultPublic) {
      return NextResponse.json(
        { error: "This vault is private." },
        { status: 403 }
      );
    }

    // Fetch folders
    const folders = await prisma.folder.findMany({
      where: {
        userId,
      },
      include: {
        _count: {
          select: {
            files: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Fetch files
    const files = await prisma.file.findMany({
      where: {
        userId,
      },
      include: {
        folder: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      owner: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      folders,
      files,
    });
  } catch (error) {
    console.error("Public Vault Error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}