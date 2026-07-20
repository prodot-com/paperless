import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PATCH() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find current user
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        isVaultPublic: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Toggle the value
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVaultPublic: !user.isVaultPublic,
      },
      select: {
        isVaultPublic: true,
      },
    });

    return NextResponse.json({
      success: true,
      isVaultPublic: updatedUser.isVaultPublic,
    });
  } catch (error) {
    console.error("Toggle Vault Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}