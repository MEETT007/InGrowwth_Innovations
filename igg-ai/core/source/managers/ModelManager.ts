import { ILLMProvider, IVisionProvider, ISpeechProvider } from "../interfaces";
import { config } from "../config/env";

export class ModelManager {
  private llmProviders: Map<string, ILLMProvider> = new Map();
  private visionProviders: Map<string, IVisionProvider> = new Map();
  private speechProviders: Map<string, ISpeechProvider> = new Map();

  registerLLMProvider(provider: ILLMProvider) {
    this.llmProviders.set(provider.name, provider);
  }

  registerVisionProvider(provider: IVisionProvider) {
    this.visionProviders.set(provider.name, provider);
  }

  registerSpeechProvider(provider: ISpeechProvider) {
    this.speechProviders.set(provider.name, provider);
  }

  getActiveLLMProvider(): ILLMProvider {
    const provider = this.llmProviders.get(config.ACTIVE_LLM_PROVIDER);
    if (!provider) throw new Error(`LLM Provider ${config.ACTIVE_LLM_PROVIDER} not found`);
    return provider;
  }

  async healthCheckAll(): Promise<Record<string, boolean>> {
    const status: Record<string, boolean> = {};
    for (const [name, provider] of this.llmProviders.entries()) {
      status[`llm:${name}`] = await provider.healthCheck().catch(() => false);
    }
    return status;
  }
}

export const modelManager = new ModelManager();
