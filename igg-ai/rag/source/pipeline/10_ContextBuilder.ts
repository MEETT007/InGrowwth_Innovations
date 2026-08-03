import { IPipelineStage, RetrievalContext } from "./IPipelineStage";

export class ContextBuilder implements IPipelineStage {
  name = "ContextBuilder";

  async execute(context: RetrievalContext): Promise<RetrievalContext> {
    
    context.finalPackage = {
      query: context.originalQuery,
      intent: context.intent,
      citations: Array.from(new Set(context.citations)), // Deduplicate citations
      contentChunks: context.compressedResults?.map(r => r.metadata?.text || r.id),
      metadata: {
        totalChunksRetrieved: context.compressedResults?.length,
        retrievalLatency: context.statistics.retrievalLatency,
      }
    };

    return context;
  }
}
