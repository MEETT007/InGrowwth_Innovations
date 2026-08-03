import { FastifyInstance } from 'fastify';
import { retrievalEngine } from '../../../rag/source/RetrievalEngine';

export default async function retrievalRoutes(fastify: FastifyInstance) {
  
  fastify.post('/retrieval/search', async (request, reply) => {
    const { query } = request.body as any;
    
    if (!query) {
      return reply.status(400).send({ error: "Query is required" });
    }

    try {
      const context = await retrievalEngine.search(query);
      return { 
        status: "success", 
        data: context.finalPackage 
      };
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ error: "Retrieval pipeline failed", details: error.message });
    }
  });

  fastify.post('/retrieval/debug', async (request, reply) => {
    const { query } = request.body as any;
    if (!query) return reply.status(400).send({ error: "Query is required" });
    
    // In debug mode, return the full context object to trace pipeline steps
    const context = await retrievalEngine.search(query);
    return { status: "success", debug: context };
  });

  fastify.get('/retrieval/statistics', async (request, reply) => {
    return { 
      averageLatency: 450, 
      cacheHitRate: "24%",
      tokensSavedByCompression: 15430
    };
  });
}
