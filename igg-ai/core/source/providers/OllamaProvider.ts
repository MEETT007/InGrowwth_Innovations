import { ILLMProvider, GenerationOptions } from '../interfaces/ILLMProvider';
import { Logger } from '../utils/Logger';

export class OllamaProvider implements ILLMProvider {
  name = 'ollama';
  private baseUrl: string;
  private defaultModel: string;

  constructor(baseUrl: string = 'http://localhost:11434', defaultModel: string = 'llama3') {
    this.baseUrl = baseUrl;
    this.defaultModel = defaultModel;
  }

  async generateText(prompt: string, options?: GenerationOptions): Promise<string> {
    const model = options?.providerSpecific?.model || this.defaultModel;

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          stream: false,
          options: {
            temperature: options?.temperature ?? 0.7,
            num_predict: options?.maxTokens,
            stop: options?.stopSequences,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error: any) {
      Logger.error(`Ollama text generation failed: ${error.message}`);
      throw error;
    }
  }

  async *streamText(prompt: string, options?: GenerationOptions): AsyncGenerator<string> {
    const model = options?.providerSpecific?.model || this.defaultModel;

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          stream: true,
          options: {
            temperature: options?.temperature ?? 0.7,
            num_predict: options?.maxTokens,
            stop: options?.stopSequences,
          },
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Ollama streaming API error: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((line) => line.trim() !== '');

        for (const line of lines) {
          const data = JSON.parse(line);
          yield data.response;
          if (data.done) return;
        }
      }
    } catch (error: any) {
      Logger.error(`Ollama stream generation failed: ${error.message}`);
      throw error;
    }
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
