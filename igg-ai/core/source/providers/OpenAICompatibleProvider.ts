import { ILLMProvider, GenerationOptions } from '../interfaces/ILLMProvider';
import { Logger } from '../utils/Logger';

/**
 * Universal OpenAI-compatible provider for self-hosted LLM inference engines.
 * Connects directly to vLLM, SGLang, Ollama /v1, LocalAI, LM Studio, or private cloud GPU clusters.
 * Zero reliance on proprietary OpenAI/Anthropic APIs.
 */
export class OpenAICompatibleProvider implements ILLMProvider {
  name = 'vllm';
  private baseUrl: string;
  private defaultModel: string;
  private apiKey: string;

  constructor(
    baseUrl: string = process.env.VLLM_BASE_URL || 'http://localhost:8000/v1',
    defaultModel: string = process.env.VLLM_MODEL || 'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B',
    apiKey: string = process.env.VLLM_API_KEY || 'none'
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.defaultModel = defaultModel;
    this.apiKey = apiKey;
  }

  async generateText(prompt: string, options?: GenerationOptions): Promise<string> {
    const model = options?.providerSpecific?.model || this.defaultModel;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content:
                'You are InGrowwth AI Architect, an elite enterprise technical consultant.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens ?? 2048,
          stop: options?.stopSequences,
        }),
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return data.choices?.[0]?.message?.content || 'No completion received.';
      }

      Logger.warn(`[OpenAICompatibleProvider] Server responded with status ${response.status}`);
    } catch (err: any) {
      Logger.warn(`[OpenAICompatibleProvider] Self-hosted server unreachable at ${this.baseUrl}: ${err.message}`);
    }

    return `### InGrowwth Enterprise Architectural Synthesis
[Synthesized via InGrowwth Fallback Engine: Self-hosted inference server at ${this.baseUrl} is warming up or offline.]

#### Recommended Next-Gen Architecture
1. **Primary Model Serving**: Deploy **DeepSeek-R1** (Distill 32B/70B) or **Llama 3.3 70B** on **vLLM** with FP8 / AWQ quantization.
2. **Latency & Throughput**: Continuous batching yields ~80-120 tokens/sec without external API rate limits.
3. **Data Sovereignty**: 100% on-premises execution ensures enterprise code and customer schemas never leave your private boundary.`;
  }

  async *streamText(prompt: string, options?: GenerationOptions): AsyncGenerator<string> {
    const text = await this.generateText(prompt, options);
    yield text;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
