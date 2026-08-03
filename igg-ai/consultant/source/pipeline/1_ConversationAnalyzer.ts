import { IConsultantPipelineStage } from "./IConsultantPipelineStage";
import { ReasoningContextObject } from "../models/ReasoningContextObject";
import { memoryManager } from "../../../core/source/managers/MemoryManager";

export class ConversationAnalyzer implements IConsultantPipelineStage {
  name = "ConversationAnalyzer";

  async execute(rco: ReasoningContextObject): Promise<ReasoningContextObject> {
    const sessionData = await memoryManager.getSession(rco.conversation.sessionId);
    if (sessionData && sessionData.history) {
      rco.conversation.history = sessionData.history;
    }
    return rco;
  }
}
