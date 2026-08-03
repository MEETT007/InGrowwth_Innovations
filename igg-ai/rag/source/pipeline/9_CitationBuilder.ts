import { IPipelineStage, RetrievalContext } from "./IPipelineStage";

export class CitationBuilder implements IPipelineStage {
  name = "CitationBuilder";

  async execute(context: RetrievalContext): Promise<RetrievalContext> {
    if (!context.compressedResults) return context;

    context.citations = context.compressedResults.map(r => {
      const title = r.metadata?.title || "Unknown Document";
      const url = r.metadata?.url || "#";
      return `[${title}](${url})`;
    });

    return context;
  }
}
