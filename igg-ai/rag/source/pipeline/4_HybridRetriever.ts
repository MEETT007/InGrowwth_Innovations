import { IPipelineStage, RetrievalContext } from "./IPipelineStage";
import { knowledgeManager } from "../../../core/source/managers/KnowledgeManager";
import { config } from "../../../core/source/config/env";

export class HybridRetriever implements IPipelineStage {
  name = "HybridRetriever";

  async execute(context: RetrievalContext): Promise<RetrievalContext> {
    const startTime = Date.now();
    const query = context.processedQuery || context.originalQuery;
    const topK = parseInt(config.RAG_TOP_K) || 10;

    // Execute Dense Retrieval
    const denseResults = await knowledgeManager.search("company_knowledge", query, topK);
    
    // Execute Sparse/Keyword Retrieval (Stubbed for now)
    const sparseResults = denseResults.map(r => ({ ...r, score: r.score * 0.8 })); 

    context.denseResults = denseResults;
    context.sparseResults = sparseResults;
    context.statistics.retrievalLatency = Date.now() - startTime;

    return context;
  }
}
