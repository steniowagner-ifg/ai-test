import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { embed } from "ai";

// Initialize Pinecone
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.index(process.env.PINECONE_INDEX_NAME!);

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Get the latest user message
  const latestMessage = messages[messages.length - 1];

  if (latestMessage.role !== "user") {
    return new Response("Invalid message format", { status: 400 });
  }

  try {
    // Generate embedding for the user's question
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small", { dimensions: 1024 }),
      value: latestMessage.content,
    });

    // Query Pinecone for relevant chunks
    const queryResponse = await index.query({
      vector: embedding,
      topK: 5,
      includeMetadata: true,
    });

    // Extract relevant context from the matches
    const context = queryResponse.matches
      .map((match) => match.metadata?.text)
      .filter(Boolean)
      .join("\n\n");

    // Create system message with context
    const systemMessage = {
      role: "system" as const,
      content: `You are a helpful AI assistant that answers questions based on the provided PDF documents. 
      
      Context from the documents:
      ${context}
      
      Instructions:
      - Answer questions based only on the provided context
      - If the context doesn't contain relevant information, say so
      - Be concise and accurate
      - Cite specific parts of the documents when relevant`,
    };

    // Generate response using the AI SDK
    const result = streamText({
      model: openai("gpt-4o"),
      messages: [systemMessage, ...messages],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat error:", error);
    return new Response("Failed to process chat request", { status: 500 });
  }
}
