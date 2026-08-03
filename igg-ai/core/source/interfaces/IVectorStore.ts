export interface VectorRecord {
  id: string;
  vector: number[];
  metadata?: Record<string, any>;
}

export interface SearchResult {
  id: string;
  score: number;
  metadata?: Record<string, any>;
}

export interface IVectorStore {
  name: string;
  upsert(collection: string, records: VectorRecord[]): Promise<void>;
  similaritySearch(collection: string, vector: number[], topK: number): Promise<SearchResult[]>;
  healthCheck(): Promise<boolean>;
}
