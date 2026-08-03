import { RetrievalContext } from "./pipeline/IPipelineStage";
import { IntentAnalyzer } from "./pipeline/1_IntentAnalyzer";
import { QueryProcessor } from "./pipeline/2_QueryProcessor";
import { MetadataFilter } from "./pipeline/3_MetadataFilter";
import { HybridRetriever } from "./pipeline/4_HybridRetriever";
import { ScoreFusion } from "./pipeline/5_ScoreFusion";
import { Reranker } from "./pipeline/6_Reranker";
import { DuplicateRemover } from "./pipeline/7_DuplicateRemover";
import { ContextCompressor } from "./pipeline/8_ContextCompressor";
import { CitationBuilder } from "./pipeline/9_CitationBuilder";
import { ContextBuilder } from "./pipeline/10_ContextBuilder";

export class RetrievalEngine {
  private pipeline = [
    new IntentAnalyzer(),
    new QueryProcessor(),
    new MetadataFilter(),
    new HybridRetriever(),
    new ScoreFusion(),
    new Reranker(),
    new DuplicateRemover(),
    new ContextCompressor(),
    new CitationBuilder(),
    new ContextBuilder()
  ];

  async search(query: string): Promise<RetrievalContext> {
    let context: RetrievalContext = {
      originalQuery: query,
      statistics: {}
    };

    for (const stage of this.pipeline) {
      context = await stage.execute(context);
    }

    return context;
  }
}

export const retrievalEngine = new RetrievalEngine();
