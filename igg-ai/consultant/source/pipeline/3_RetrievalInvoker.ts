import { IConsultantPipelineStage } from "./IConsultantPipelineStage";
import { ReasoningContextObject } from "../models/ReasoningContextObject";
import { retrievalEngine } from "../../../rag/source/RetrievalEngine";

export class RetrievalInvoker implements IConsultantPipelineStage {
  name = "RetrievalInvoker";

  async execute(rco: ReasoningContextObject): Promise<ReasoningContextObject> {
    // Invoke Phase 4 Retrieval
    const context = await retrievalEngine.search(rco.conversation.currentQuestion);
    
    if (context.finalPackage) {
      rco.knowledge.documents = context.finalPackage.contentChunks || [];
      rco.knowledge.citations = context.finalPackage.citations || [];
    }
    
    return rco;
  }
}
