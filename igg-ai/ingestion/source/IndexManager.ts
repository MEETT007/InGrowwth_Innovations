import { IConnector } from "./connectors/IConnector";
import { processingPipeline } from "./pipeline/ProcessingPipeline";
import { knowledgeManager } from "../../core/source/managers/KnowledgeManager";

export class IndexManager {
  
  async syncConnector(connector: IConnector) {
    const isValid = await connector.validate();
    if (!isValid) throw new Error(`Invalid connector config for ${connector.config.sourceId}`);

    for await (const rawDoc of connector.discover()) {
      // Stub: Here we'd check Postgres if `rawDoc.hash` is identical to skip processing.
      
      const processedChunks = await processingPipeline.process(rawDoc);
      
      const embedder = knowledgeManager.getActiveEmbeddingProvider();
      const vectorStore = knowledgeManager.getActiveVectorStore();

      // Batch embedding
      const vectors = await embedder.embedBatch(processedChunks.map(c => c.text));
      
      const records = processedChunks.map((chunk, idx) => ({
        id: chunk.metadata.chunkId,
        vector: vectors[idx],
        metadata: chunk.metadata as any
      }));

      // Upsert to Vector Store
      await vectorStore.upsert(connector.config.sourceId, records);
      
      // Stub: Here we'd update Postgres to mark doc as synced
    }
  }
}

export const indexManager = new IndexManager();
