import { IVectorStore, VectorRecord, SearchResult } from '../interfaces/IVectorStore';
import { Logger } from '../utils/Logger';

export class QdrantVectorStore implements IVectorStore {
  name = 'qdrant';
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:6333') {
    this.baseUrl = baseUrl;
  }

  async upsert(collection: string, records: VectorRecord[]): Promise<void> {
    try {
      const points = records.map((r) => ({
        id: r.id,
        vector: r.vector,
        payload: r.metadata,
      }));

      const response = await fetch(`${this.baseUrl}/collections/${collection}/points?wait=true`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points }),
      });

      if (!response.ok) {
        // Simple fallback: Try to create collection if it doesn't exist
        if (response.status === 404) {
          await this.createCollection(collection, records[0].vector.length);
          return this.upsert(collection, records);
        }
        throw new Error(`Qdrant upsert failed: ${response.statusText}`);
      }
    } catch (error: any) {
      Logger.error(`Qdrant upsert failed: ${error.message}`);
      throw error;
    }
  }

  async similaritySearch(
    collection: string,
    vector: number[],
    topK: number
  ): Promise<SearchResult[]> {
    try {
      const response = await fetch(`${this.baseUrl}/collections/${collection}/points/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vector: vector,
          limit: topK,
          with_payload: true,
        }),
      });

      if (!response.ok) {
        if (response.status === 404) return []; // Collection doesn't exist yet
        throw new Error(`Qdrant search failed: ${response.statusText}`);
      }

      const data = await response.json();
      return (data.result || []).map((p: any) => ({
        id: p.id,
        score: p.score,
        metadata: p.payload,
      }));
    } catch (error: any) {
      Logger.error(`Qdrant search failed: ${error.message}`);
      return []; // Gracefully degrade
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/healthz`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  private async createCollection(collection: string, vectorSize: number) {
    await fetch(`${this.baseUrl}/collections/${collection}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vectors: {
          size: vectorSize,
          distance: 'Cosine',
        },
      }),
    });
  }
}
