import { IConsultantPipelineStage } from "./IConsultantPipelineStage";
import { ReasoningContextObject } from "../models/ReasoningContextObject";
import { modelManager } from "../../../core/source/managers/ModelManager";

export class LLMInvoker implements IConsultantPipelineStage {
  name = "LLMInvoker";

  async execute(rco: ReasoningContextObject): Promise<ReasoningContextObject> {
    const provider = modelManager.getActiveLLMProvider();
    
    const prompt = `
${rco.generation.systemPrompt}

User Question: ${rco.conversation.currentQuestion}
    `.trim();

    // Invoke Phase 2 LLM Provider
    const response = await provider.generateCompletion(prompt);
    
    rco.generation.llmResponse = response.text;
    
    return rco;
  }
}
