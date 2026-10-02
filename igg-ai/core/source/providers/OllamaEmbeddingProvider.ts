import { IEmbeddingProvider } from '../interfaces/IEmbeddingProvider';
import { Logger } from '../utils/Logger';

export class OllamaEmbeddingProvider implements IEmbeddingProvider {
  name = 'ollama';
  private baseUrl: string;
  private defaultModel: string;

  constructor(
    baseUrl: string = 'http://localhost:11434',
    defaultModel: string = 'nomic-embed-text'
  ) {
    this.baseUrl = baseUrl;
    this.defaultModel = defaultModel;
  }

  async embedText(text: string): Promise<number[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch(`${this.baseUrl}/api/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.defaultModel,
          prompt: text,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama embeddings API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.embedding;
    } catch (error: any) {
      Logger.warn(`[OllamaEmbeddingProvider] Ollama daemon unavailable at ${this.baseUrl}: ${error.message}. Returning fallback zero embedding.`);
      // Return 768-dimensional zero vector so retrieval pipeline doesn't crash
      return new Array(768).fill(0);
    }
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];
    // Sequential fallback for simplicity. Ollama doesn't natively batch well yet.
    for (const text of texts) {
      embeddings.push(await this.embedText(text));
    }
    return embeddings;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}
