import { IPipelineStage, RetrievalContext } from "./IPipelineStage";

export class QueryProcessor implements IPipelineStage {
  name = "QueryProcessor";

  async execute(context: RetrievalContext): Promise<RetrievalContext> {
    let processed = context.originalQuery.toLowerCase();
    // Stub: Removing basic punctuation and extra spaces
    processed = processed.replace(/[^\w\s]/gi, '').trim();
    // Basic stop word removal
    const stopwords = ["a", "an", "the", "is", "at", "which", "on", "what", "your", "are", "do"];
    processed = processed.split(" ").filter(w => !stopwords.includes(w)).join(" ");
    
    context.processedQuery = processed;
    return context;
  }
}
