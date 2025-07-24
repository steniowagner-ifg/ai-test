import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import fs from "fs";
import path from "path";
import os from "os";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const assistant = pinecone.assistant(process.env.PINECONE_ASSISTANT_NAME!);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    // Create temporary file
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, file.name);
    await fs.promises.writeFile(filePath, buffer);
    // Upload to Assistant via Pinecone SDK
    const uploadResult = await assistant.uploadFile({
      path: filePath,
      metadata: {
        filename: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });
    // Delete temp file
    await fs.promises.unlink(filePath);
    return NextResponse.json({
      message: "File uploaded to assistant successfully",
      data: uploadResult,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Failed to upload file to assistant" },
      { status: 500 }
    );
  }
}
