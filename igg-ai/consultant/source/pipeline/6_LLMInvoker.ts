import { IConsultantPipelineStage } from "./IConsultantPipelineStage";
import { ReasoningContextObject } from "../models/ReasoningContextObject";
import { modelManager } from "../../../core/source/managers/ModelManager";
import { config } from "../../../core/source/config/env";
import { Logger } from "../../../core/source/utils/Logger";

export class LLMInvoker implements IConsultantPipelineStage {
  name = "LLMInvoker";

  async execute(rco: ReasoningContextObject): Promise<ReasoningContextObject> {
    // 1. Fast Path Check: If Semantic Route already generated an optimal response (e.g., greetings, booking), return instantly
    if (rco.generation.llmResponse && rco.generation.llmResponse.trim().length > 0) {
      Logger.info('[LLMInvoker] Fast semantic response already generated. Skipping LLM invocation (0 tokens used).');
      return rco;
    }

    const prompt = `
${rco.generation.systemPrompt}

User Question: ${rco.conversation.currentQuestion}
    `.trim();

    let responseText = '';
    const apiKey = process.env.GEMINI_API_KEY || config.GEMINI_API_KEY;
    const requestedModel = rco.options?.model || 'igg-architect-pro';

    Logger.info(`[LLMInvoker] Processing query under model tier: ${requestedModel}`);

    // Tier 1: IGG Architect Pro -> High-intelligence architecture & schema engine
    if (requestedModel === 'igg-architect-pro') {
      // Primary: High-speed cloud accelerator (Gemini 3.5 Flash) for sub-2s latency and deep precision
      if (apiKey) {
        const geminiProvider = modelManager.getProviderByName('gemini');
        if (geminiProvider) {
          try {
            responseText = await geminiProvider.generateText(prompt, {
              providerSpecific: { model: 'gemini-3.5-flash', apiKey },
            });
            if (responseText && responseText.trim().length > 0) {
              rco.generation.llmResponse = responseText;
              return rco;
            }
          } catch (geminiErr: any) {
            Logger.warn(`[LLMInvoker] Cloud tier failed: ${geminiErr.message}. Cascading to local Qwen 2.5 Coder.`);
          }
        }
      }

      // Secondary: Local Qwen 2.5 Coder 14B
      try {
        const ollamaProvider = modelManager.getProviderByName('ollama');
        if (ollamaProvider) {
          responseText = await ollamaProvider.generateText(prompt, {
            providerSpecific: { model: 'qwen2.5-coder:14b' },
            temperature: 0.35,
          });
          if (responseText && responseText.trim().length > 0) {
            rco.generation.llmResponse = responseText;
            return rco;
          }
        }
      } catch (ollamaErr: any) {
        Logger.warn(`[LLMInvoker] Local Qwen 2.5 Coder 14B failed: ${ollamaErr.message}`);
      }
    }

    // Tier 2: IGG Deep Reasoning -> Chain-of-thought analysis
    else if (requestedModel === 'igg-deep-reasoning') {
      // Primary: Cloud Deep Reasoning with Gemini 3.5 Flash (<think> tags enforced)
      if (apiKey) {
        const geminiProvider = modelManager.getProviderByName('gemini');
        if (geminiProvider) {
          try {
            responseText = await geminiProvider.generateText(prompt, {
              providerSpecific: { model: 'gemini-3.5-flash', apiKey },
            });
            if (responseText && responseText.trim().length > 0) {
              rco.generation.llmResponse = responseText;
              return rco;
            }
          } catch {}
        }
      }

      // Secondary: Local DeepSeek-R1 8B or Qwen 2.5 Coder
      try {
        const ollamaProvider = modelManager.getProviderByName('ollama');
        if (ollamaProvider) {
          responseText = await ollamaProvider.generateText(prompt, {
            providerSpecific: { model: 'deepseek-r1:8b' },
            temperature: 0.6,
          });
          if (responseText && responseText.trim().length > 0) {
            rco.generation.llmResponse = responseText;
            return rco;
          }
        }
      } catch {
        try {
          const ollamaProvider = modelManager.getProviderByName('ollama');
          if (ollamaProvider) {
            responseText = await ollamaProvider.generateText(prompt, {
              providerSpecific: { model: 'qwen2.5-coder:14b' },
              temperature: 0.4,
            });
            if (responseText && responseText.trim().length > 0) {
              rco.generation.llmResponse = responseText;
              return rco;
            }
          }
        } catch {}
      }
    }

    // Tier 3: IGG Flash Turbo -> Sub-300ms conversational triage
    else if (requestedModel === 'igg-flash-turbo') {
      if (apiKey) {
        const geminiProvider = modelManager.getProviderByName('gemini');
        if (geminiProvider) {
          try {
            responseText = await geminiProvider.generateText(prompt, {
              providerSpecific: { model: 'gemini-3.5-flash-lite', apiKey },
            });
            if (responseText && responseText.trim().length > 0) {
              rco.generation.llmResponse = responseText;
              return rco;
            }
          } catch (turboErr: any) {
            Logger.warn(`[LLMInvoker] Flash turbo cloud failed: ${turboErr.message}`);
          }
        }
      }

      // Local fallback
      try {
        const ollamaProvider = modelManager.getProviderByName('ollama');
        if (ollamaProvider) {
          responseText = await ollamaProvider.generateText(prompt, {
            providerSpecific: { model: 'qwen2.5-coder:14b' },
            temperature: 0.5,
          });
          if (responseText && responseText.trim().length > 0) {
            rco.generation.llmResponse = responseText;
            return rco;
          }
        }
      } catch {}
    }

    // Default fallback: Try active local provider
    try {
      const activeProvider = modelManager.getActiveLLMProvider();
      responseText = await activeProvider.generateText(prompt, {
        providerSpecific: { model: 'qwen2.5-coder:14b' },
      });
    } catch (fallbackErr: any) {
      Logger.warn(`[LLMInvoker] All providers exhausted: ${fallbackErr.message}`);
    }

    rco.generation.llmResponse = responseText;
    return rco;
  }
}
