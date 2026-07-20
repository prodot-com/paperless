import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  S3Client,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const file = await prisma.file.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          isVaultPublic: true,
        },
      },
    },
  });

  if (!file) {
    return NextResponse.json(
      { error: "File not found" },
      { status: 404 }
    );
  }

  if (!file.user.isVaultPublic) {
    return NextResponse.json(
      { error: "Vault is private" },
      { status: 403 }
    );
  }

  const key = file.path.split("/").slice(-2).join("/");

  const url = await getSignedUrl(
    r2,
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${file.name}"`,
    }),
    {
      expiresIn: 60,
    }
  );

  return NextResponse.json({ url });
}