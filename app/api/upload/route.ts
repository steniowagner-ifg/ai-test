import { type NextRequest, NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { openai } from "@ai-sdk/openai";
import { embed } from "ai";

// Initialize Pinecone
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const allowedTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const index = pinecone.index(process.env.PINECONE_INDEX_NAME!);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF and DOCX files are supported" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // ✅ Extract text from PDF using pdf-parse
    let text = "";

    if (file.type === "application/pdf") {
      text = await extractTextFromPDF(buffer);
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      text = await extractTextFromDocx(buffer);
    }
    console.log(">>> text: ", text);
    // ✅ Split text into manageable chunks
    const chunks = splitTextIntoChunks(text, 1000);
    console.log(">>> chunks: ", chunks);
    const vectors = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      const { embedding } = await embed({
        model: openai.embedding("text-embedding-3-small", { dimensions: 1024 }),
        value: chunk,
      });

      vectors.push({
        id: `${file.name.slice(0, 50)}-chunk-${i}`, // limit filename length in ID
        values: embedding,
        metadata: {
          filename: file.name,
          chunk: i,
          text: chunk,
        },
      });
    }

    // ✅ Upload vectors to Pinecone
    await index.upsert(vectors);

    return NextResponse.json({
      message: "File uploaded and processed successfully",
      chunks: chunks.length,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}

async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.convertToHtml({ buffer });
  return result.value.replace(/<[^>]+>/g, " "); // Strip HTML tags
}

// ✅ Uses pdf-parse to extract PDF text
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const pdfParse = (await import("pdf-parse")).default;
  const data = await pdfParse(buffer);
  return data.text;
}

// ✅ Splits long text into chunks of defined length
function splitTextIntoChunks(text: string, chunkSize: number): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + sentence).length > chunkSize) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current += sentence;
    }
  }

  if (current) chunks.push(current.trim());
  return chunks;
}
