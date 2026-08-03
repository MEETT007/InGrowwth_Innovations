import { IConsultantPipelineStage } from "./IConsultantPipelineStage";
import { ReasoningContextObject } from "../models/ReasoningContextObject";

export class QuestionClassifier implements IConsultantPipelineStage {
  name = "QuestionClassifier";

  async execute(rco: ReasoningContextObject): Promise<ReasoningContextObject> {
    const question = rco.conversation.currentQuestion.toLowerCase();
    
    // Check if the user is asking a broad question that requires consultative probing
    if (question.includes("i need an erp") || question.includes("build an app")) {
      rco.intent.primary = "consultation_request";
      rco.intent.requiresClarification = true;
    } else {
      rco.intent.primary = "direct_question";
      rco.intent.requiresClarification = false;
    }
    
    return rco;
  }
}
