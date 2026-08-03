import { SearchResult } from "../../../core/source/interfaces/IVectorStore";

export interface RetrievalContext {
  originalQuery: string;
  processedQuery?: string;
  intent?: string;
  metadataFilters?: Record<string, any>;
  denseResults?: SearchResult[];
  sparseResults?: SearchResult[];
  fusedResults?: SearchResult[];
  compressedResults?: SearchResult[];
  citations?: string[];
  finalPackage?: Record<string, any>;
  statistics: Record<string, number>;
}

export interface IPipelineStage {
  name: string;
  execute(context: RetrievalContext): Promise<RetrievalContext>;
}
