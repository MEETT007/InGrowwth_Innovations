import { RawDocument } from "../connectors/IConnector";
import { ChunkMetadata } from "../models/Metadata";
import crypto from "crypto";

export interface ProcessedChunk {
  text: string;
  metadata: ChunkMetadata;
}

export class ProcessingPipeline {
  
  async process(doc: RawDocument): Promise<ProcessedChunk[]> {
    const cleanedText = this.clean(doc.content);
    const chunks = this.chunk(cleanedText);
    const enriched = this.enrich(doc, chunks);
    return enriched;
  }

  private clean(raw: string): string {
    // Stub: Strip HTML, normalize unicode, etc.
    return raw.replace(/<[^>]*>?/gm, '').trim();
  }

  private chunk(text: string): string[] {
    // Stub: Fixed-size chunking (e.g., 512 chars for testing)
    const size = 512;
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += size) {
      chunks.push(text.slice(i, i + size));
    }
    return chunks;
  }

  private enrich(doc: RawDocument, chunks: string[]): ProcessedChunk[] {
    return chunks.map((text, idx) => ({
      text,
      metadata: {
        documentId: doc.id,
        chunkId: `${doc.id}_chunk_${idx}`,
        sourceId: doc.sourceId,
        title: doc.rawMetadata.title || doc.id,
        tags: [],
        language: "en", // Lang detection stub
        updatedDate: new Date().toISOString(),
        chunkNumber: idx + 1,
        totalChunks: chunks.length,
        wordCount: text.split(/\s+/).length,
        estimatedReadingTime: Math.ceil((text.split(/\s+/).length) / 200),
        contentHash: crypto.createHash("sha256").update(text).digest("hex"),
        version: "1.0",
        embeddingVersion: "v1"
      }
    }));
  }
}

export const processingPipeline = new ProcessingPipeline();
