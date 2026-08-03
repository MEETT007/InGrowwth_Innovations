import { FastifyInstance } from 'fastify';
import { aiRuntime } from '../../../runtime/source/AIRuntime';
import { toolRegistry } from '../../../runtime/source/registries/ToolRegistry';
import { globalCapabilityRegistry } from '../../../runtime/source/registries/CapabilityRegistry';

export default async function runtimeRoutes(fastify: FastifyInstance) {
  
  fastify.post('/runtime/chat', async (request, reply) => {
    const { sessionId, message } = request.body as { sessionId: string; message: string };
    
    if (!sessionId || !message) {
      return reply.status(400).send({ error: "sessionId and message are required" });
    }

    try {
      const response = await aiRuntime.chat(sessionId, message);
      
      return { 
        status: "success", 
        response
      };
    } catch (error: unknown) {
      const err = error as Error;
      request.log.error(err);
      return reply.status(500).send({ error: "Runtime execution failed", details: err.message });
    }
  });

  fastify.get('/runtime/tools', async () => {
    const tools = toolRegistry.getAll().map(t => ({ name: t.name, description: t.description }));
    return { tools };
  });

  fastify.get('/runtime/capabilities', async () => {
    const capabilities = globalCapabilityRegistry.getEnabled();
    return { capabilities };
  });

}
