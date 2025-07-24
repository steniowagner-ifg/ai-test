import { Pinecone } from "@pinecone-database/pinecone";
import { NextResponse, NextRequest } from "next/server";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const assistant = pinecone.assistant(process.env.PINECONE_ASSISTANT_NAME!);

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get("fileId");
    if (!fileId) {
      return NextResponse.json({ error: "Missing file ID" }, { status: 400 });
    }
    const file = await assistant.deleteFile(fileId);
    return NextResponse.json(
      {
        file,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("Failed to delete uploaded file:", err);
    return NextResponse.json(
      { error: "Unable to delete file uploaded" },
      { status: 500 }
    );
  }
}
