import { IConsultantPipelineStage } from "./IConsultantPipelineStage";
import { ReasoningContextObject } from "../models/ReasoningContextObject";

export class PromptBuilder implements IConsultantPipelineStage {
  name = "PromptBuilder";

  async execute(rco: ReasoningContextObject): Promise<ReasoningContextObject> {
    
    // Construct the highly structured prompt instructing the LLM on how to behave
    const systemPrompt = `
You are the InGrowwth Innovations AI Consultant. 
Tone: ${rco.constraints.tone}
Constraints: 
${rco.constraints.mustNotHallucinate ? "- DO NOT hallucinate. Only use the provided knowledge." : ""}
- If the knowledge does not answer the question, say: "${rco.constraints.unknownResponseFallback}"

Provided Knowledge:
${rco.knowledge.documents.join("\n\n")}

Business Context (If applicable, recommend these):
${rco.businessContext.recommendedServices.join(", ")}
    `.trim();

    rco.generation.systemPrompt = systemPrompt;
    
    return rco;
  }
}
