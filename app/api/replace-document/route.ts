import { Pinecone } from "@pinecone-database/pinecone";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import path from "path";
import fs from "fs";
import os from "os";

const ReplaceDocumentSchema = z.object({
  file: z.instanceof(File, { message: "File is required" }),
  fileId: z.uuid({ message: "Invalid fileId format" }),
  uploadedAt: z.iso.datetime({ message: "Invalid ISO date string" }),
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const assistant = pinecone.assistant(process.env.PINECONE_ASSISTANT_NAME!);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const fileId = formData.get("fileId");
    const uploadedAt = formData.get("uploadedAt");
    // Validate request params
    const parsed = ReplaceDocumentSchema.safeParse({
      file,
      fileId,
      uploadedAt,
    });
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }
    // Delete existing file
    await assistant.deleteFile(parsed.data.fileId);
    // Reuploading the file
    const buffer = Buffer.from(await parsed.data.file.arrayBuffer());
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, parsed.data.file.name);
    await fs.promises.writeFile(filePath, buffer);
    const uploadResult = await assistant.uploadFile({
      path: filePath,
      metadata: {
        filename: parsed.data.file.name,
        updatedAt: new Date().toISOString(),
        uploadedAt: parsed.data.uploadedAt,
      },
    });
    console.log(uploadResult);
    // Delete temp file
    await fs.promises.unlink(filePath);
    return NextResponse.json({ message: "File replaced", data: uploadResult });
  } catch (err) {
    console.error("Replace document error:", err);
    return NextResponse.json(
      { error: "Failed to replace file" },
      { status: 500 }
    );
  }
}
