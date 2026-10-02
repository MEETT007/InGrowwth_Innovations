import { ILLMProvider, GenerationOptions } from '../interfaces/ILLMProvider';
import { Logger } from '../utils/Logger';
import { config } from '../config/env';

/**
 * Native Google Gemini Provider for ultra-fast, zero-cost conversational inference.
 * Uses Gemini 2.0 Flash / 1.5 Flash via REST API (no heavyweight external SDK required).
 */
export class GeminiProvider implements ILLMProvider {
  name = 'gemini';
  private apiKey: string;
  private defaultModel: string;

  constructor(
    apiKey: string = '',
    defaultModel: string = 'gemini-3.5-flash'
  ) {
    this.apiKey = apiKey;
    this.defaultModel = defaultModel;
  }

  async generateText(prompt: string, options?: GenerationOptions): Promise<string> {
    const key =
      options?.providerSpecific?.apiKey ||
      this.apiKey ||
      process.env.GEMINI_API_KEY ||
      config.GEMINI_API_KEY;

    const requestedModel = options?.providerSpecific?.model || this.defaultModel;

    if (!key) {
      Logger.warn('[GeminiProvider] No GEMINI_API_KEY provided. Skipping to fallback.');
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const candidateModels = [
      requestedModel,
      'gemini-3.5-flash',
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-flash-latest',
    ].filter(Boolean) as string[];

    // Deduplicate
    const modelsToTry = Array.from(new Set(candidateModels));


    let lastError: Error | null = null;

    for (const model of modelsToTry) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: options?.temperature ?? 0.7,
              maxOutputTokens: options?.maxTokens ?? 2048,
              stopSequences: options?.stopSequences,
            },
          }),
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return text;
          }
        }

        const errText = await response.text().catch(() => '');
        Logger.warn(`[GeminiProvider] Model ${model} responded with ${response.status}: ${errText}`);
        lastError = new Error(`Gemini API error (${model}): ${response.status}`);
      } catch (err: any) {
        Logger.warn(`[GeminiProvider] Model ${model} failed: ${err.message}`);
        lastError = err;
      }
    }

    throw lastError || new Error('All Gemini candidate models failed');
  }

  async *streamText(prompt: string, options?: GenerationOptions): AsyncGenerator<string> {
    const text = await this.generateText(prompt, options);
    yield text;
  }

  async healthCheck(): Promise<boolean> {
    if (!this.apiKey) return false;
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`;
      const response = await fetch(url);
      return response.ok;
    } catch {
      return false;
    }
  }
}
