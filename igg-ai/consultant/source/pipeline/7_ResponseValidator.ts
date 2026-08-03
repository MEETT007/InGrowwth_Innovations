import { IConsultantPipelineStage } from "./IConsultantPipelineStage";
import { ReasoningContextObject } from "../models/ReasoningContextObject";

export class ResponseValidator implements IConsultantPipelineStage {
  name = "ResponseValidator";

  async execute(rco: ReasoningContextObject): Promise<ReasoningContextObject> {
    const response = rco.generation.llmResponse;
    if (!response) {
      rco.generation.isValid = false;
      return rco;
    }

    // Stub validator: In a real implementation this might use a smaller LLM 
    // or regex checks to ensure the LLM didn't hallucinate a competitor's name
    const hasForbiddenWords = response.toLowerCase().includes("competitor");
    
    if (hasForbiddenWords) {
      rco.generation.isValid = false;
      rco.generation.llmResponse = rco.constraints.unknownResponseFallback;
    } else {
      rco.generation.isValid = true;
    }

    return rco;
  }
}
