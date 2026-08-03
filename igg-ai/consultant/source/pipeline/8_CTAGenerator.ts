import { IConsultantPipelineStage } from "./IConsultantPipelineStage";
import { ReasoningContextObject } from "../models/ReasoningContextObject";

export class CTAGenerator implements IConsultantPipelineStage {
  name = "CTAGenerator";

  async execute(rco: ReasoningContextObject): Promise<ReasoningContextObject> {
    if (!rco.generation.isValid) return rco;

    if (rco.intent.primary === "consultation_request") {
      rco.generation.cta = "Would you like to schedule a 15-minute discovery call to discuss this further?";
    } else {
      rco.generation.cta = "Is there anything else I can help clarify for you?";
    }

    return rco;
  }
}
