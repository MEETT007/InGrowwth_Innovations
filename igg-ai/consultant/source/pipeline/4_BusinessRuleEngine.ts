import { IConsultantPipelineStage } from "./IConsultantPipelineStage";
import { ReasoningContextObject } from "../models/ReasoningContextObject";

export class BusinessRuleEngine implements IConsultantPipelineStage {
  name = "BusinessRuleEngine";

  async execute(rco: ReasoningContextObject): Promise<ReasoningContextObject> {
    // Apply strict business rules
    if (rco.intent.primary === "consultation_request") {
      rco.constraints.tone = "consultative";
      rco.businessContext.recommendedServices.push("Discovery Workshop");
    } else {
      rco.constraints.tone = "professional";
    }

    // Always require evidence
    rco.constraints.mustNotHallucinate = true;
    rco.constraints.unknownResponseFallback = "I couldn't find that information in our verified knowledge base. Could you clarify your request?";
    
    return rco;
  }
}
