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
      const response = await fetch(`${this.baseUrl}/api/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.defaultModel,
          prompt: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama embeddings API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.embedding;
    } catch (error: any) {
      Logger.error(`Ollama embedding generation failed: ${error.message}`);
      throw error;
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
