import { IPipelineStage, RetrievalContext } from "./IPipelineStage";
import { config } from "../../../core/source/config/env";

export class Reranker implements IPipelineStage {
  name = "Reranker";

  async execute(context: RetrievalContext): Promise<RetrievalContext> {
    if (config.RAG_RERANKER_ENABLED !== "true") return context;
    if (!context.fusedResults) return context;

    // Stub: Deterministic mock reranking
    // In reality, this would call a CrossEncoder model via a RerankerProvider
    context.fusedResults = context.fusedResults.sort((a, b) => b.score - a.score);
    
    return context;
  }
}
