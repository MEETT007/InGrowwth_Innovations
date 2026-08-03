import { IPipelineStage, RetrievalContext } from "./IPipelineStage";

export class MetadataFilter implements IPipelineStage {
  name = "MetadataFilter";

  async execute(context: RetrievalContext): Promise<RetrievalContext> {
    // Map intent to specific metadata constraints
    const filters: Record<string, any> = {};
    if (context.intent === "pricing") {
      filters.category = "pricing";
    } else if (context.intent === "portfolio") {
      filters.category = "portfolio";
    }
    
    context.metadataFilters = filters;
    return context;
  }
}
