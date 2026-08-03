import { IPipelineStage, RetrievalContext } from "./IPipelineStage";

export class IntentAnalyzer implements IPipelineStage {
  name = "IntentAnalyzer";

  async execute(context: RetrievalContext): Promise<RetrievalContext> {
    const query = context.originalQuery.toLowerCase();
    let intent = "general";

    if (query.includes("price") || query.includes("pricing") || query.includes("cost") || query.includes("fee")) {
      intent = "pricing";
    } else if (query.includes("portfolio") || query.includes("projects") || query.includes("work")) {
      intent = "portfolio";
    } else if (query.includes("service") || query.includes("offer")) {
      intent = "services";
    }

    context.intent = intent;
    return context;
  }
}
