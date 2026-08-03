import { IPipelineStage, RetrievalContext } from "./IPipelineStage";

export class DuplicateRemover implements IPipelineStage {
  name = "DuplicateRemover";

  async execute(context: RetrievalContext): Promise<RetrievalContext> {
    if (!context.fusedResults) return context;

    const seenHashes = new Set<string>();
    const deduplicated = context.fusedResults.filter(r => {
      const hash = r.metadata?.contentHash;
      if (hash && seenHashes.has(hash)) return false;
      if (hash) seenHashes.add(hash);
      return true;
    });

    context.fusedResults = deduplicated;
    return context;
  }
}
