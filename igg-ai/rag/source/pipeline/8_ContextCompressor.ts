import { IPipelineStage, RetrievalContext } from "./IPipelineStage";
import { config } from "../../../core/source/config/env";

export class ContextCompressor implements IPipelineStage {
  name = "ContextCompressor";

  async execute(context: RetrievalContext): Promise<RetrievalContext> {
    if (!context.fusedResults) return context;

    const budget = parseInt(config.RAG_TOKEN_BUDGET) || 4096;
    let currentTokens = 0;
    
    context.compressedResults = [];

    for (const result of context.fusedResults) {
      // Stub: estimate tokens based on wordCount roughly 1.3 tokens per word
      const words = result.metadata?.wordCount || 100;
      const tokens = Math.ceil(words * 1.3);
      
      if (currentTokens + tokens > budget) {
        break; // Budget exhausted
      }
      
      context.compressedResults.push(result);
      currentTokens += tokens;
    }

    return context;
  }
}
