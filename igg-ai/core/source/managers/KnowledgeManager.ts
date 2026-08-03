import { IEmbeddingProvider, IVectorStore, SearchResult } from "../interfaces";
import { config } from "../config/env";

export class KnowledgeManager {
  private embeddingProviders: Map<string, IEmbeddingProvider> = new Map();
  private vectorStores: Map<string, IVectorStore> = new Map();

  registerEmbeddingProvider(provider: IEmbeddingProvider) {
    this.embeddingProviders.set(provider.name, provider);
  }

  registerVectorStore(store: IVectorStore) {
    this.vectorStores.set(store.name, store);
  }

  getActiveEmbeddingProvider(): IEmbeddingProvider {
    const provider = this.embeddingProviders.get(config.ACTIVE_EMBEDDING_PROVIDER);
    if (!provider) throw new Error(`Embedding Provider ${config.ACTIVE_EMBEDDING_PROVIDER} not found`);
    return provider;
  }

  getActiveVectorStore(): IVectorStore {
    const store = this.vectorStores.get(config.ACTIVE_VECTOR_STORE);
    if (!store) throw new Error(`Vector Store ${config.ACTIVE_VECTOR_STORE} not found`);
    return store;
  }

  async search(collection: string, query: string, topK: number = 5): Promise<SearchResult[]> {
    const embedder = this.getActiveEmbeddingProvider();
    const store = this.getActiveVectorStore();
    
    const vector = await embedder.embedText(query);
    return await store.similaritySearch(collection, vector, topK);
  }
}

export const knowledgeManager = new KnowledgeManager();
