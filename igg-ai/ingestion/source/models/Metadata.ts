export interface ChunkMetadata {
  documentId: string;
  chunkId: string;
  sourceId: string;
  url?: string;
  title: string;
  description?: string;
  category?: string;
  tags: string[];
  language: string;
  author?: string;
  createdDate?: string;
  updatedDate: string;
  chunkNumber: number;
  totalChunks: number;
  wordCount: number;
  estimatedReadingTime: number;
  contentHash: string;
  version: string;
  embeddingVersion: string;
}

export interface DocumentRecord {
  id: string;
  sourceId: string;
  hash: string;
  lastSyncedAt: Date;
  status: 'indexed' | 'failed' | 'processing';
}
