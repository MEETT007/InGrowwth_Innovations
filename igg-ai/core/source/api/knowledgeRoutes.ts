import { FastifyInstance } from 'fastify';
import { indexManager } from '../../../ingestion/source/IndexManager';
import { WebsiteConnector } from '../../../ingestion/source/connectors/WebsiteConnector';

export default async function knowledgeRoutes(fastify: FastifyInstance) {
  
  fastify.post('/knowledge/index', async (request, reply) => {
    const { sourceId, type, config } = request.body as { sourceId: string; type: string; config: Record<string, unknown> };
    
    // Stub registry
    if (type === 'website') {
      const connector = new WebsiteConnector({ sourceId, type, params: config });
      
      // Trigger background sync
      // Ideally this goes to a BullMQ Redis queue
      indexManager.syncConnector(connector).catch(err => request.log.error(err));
      
      return { status: "accepted", message: `Sync job started for ${sourceId}` };
    }
    
    return reply.status(400).send({ error: "Unsupported connector type" });
  });

  fastify.get('/knowledge/status', async () => {
    return { status: "running", processedDocuments: 150 };
  });

  fastify.get('/knowledge/statistics', async () => {
    return { documentsIndexed: 150, chunksGenerated: 1200, dbSize: "5MB" };
  });
}
