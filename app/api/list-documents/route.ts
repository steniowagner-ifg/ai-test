import { Pinecone } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const assistant = pinecone.assistant(process.env.PINECONE_ASSISTANT_NAME!);

export async function GET() {
  try {
    const files = await assistant.listFiles();
    return NextResponse.json(
      {
        files,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("Failed to list assistant files:", err);
    return NextResponse.json(
      { error: "Unable to retrieve file list" },
      { status: 500 }
    );
  }
}
