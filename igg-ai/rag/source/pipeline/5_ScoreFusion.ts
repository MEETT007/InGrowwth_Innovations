import { IPipelineStage, RetrievalContext } from "./IPipelineStage";
import { config } from "../../../core/source/config/env";
import { SearchResult } from "../../../core/source/interfaces/IVectorStore";

export class ScoreFusion implements IPipelineStage {
  name = "ScoreFusion";

  async execute(context: RetrievalContext): Promise<RetrievalContext> {
    const denseWeight = parseFloat(config.RAG_DENSE_WEIGHT);
    const keywordWeight = parseFloat(config.RAG_KEYWORD_WEIGHT);
    
    const fusedMap = new Map<string, SearchResult>();

    const merge = (results: SearchResult[], weight: number) => {
      results.forEach((r, rank) => {
        // Reciprocal Rank Fusion (RRF)
        const rrfScore = 1 / (60 + rank + 1); 
        const weightedScore = rrfScore * weight;
        
        if (fusedMap.has(r.id)) {
          fusedMap.get(r.id)!.score += weightedScore;
        } else {
          fusedMap.set(r.id, { ...r, score: weightedScore });
        }
      });
    };

    if (context.denseResults) merge(context.denseResults, denseWeight);
    if (context.sparseResults) merge(context.sparseResults, keywordWeight);

    context.fusedResults = Array.from(fusedMap.values()).sort((a, b) => b.score - a.score);
    return context;
  }
}
