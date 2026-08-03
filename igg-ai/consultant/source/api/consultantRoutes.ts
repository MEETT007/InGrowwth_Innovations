import { FastifyInstance } from 'fastify';
import { consultantEngine } from '../../../consultant/source/ConsultantEngine';

export default async function consultantRoutes(fastify: FastifyInstance) {
  
  fastify.post('/consultant/chat', async (request, reply) => {
    const { sessionId, message } = request.body as any;
    
    if (!sessionId || !message) {
      return reply.status(400).send({ error: "sessionId and message are required" });
    }

    try {
      const rco = await consultantEngine.process(sessionId, message);
      
      return { 
        status: "success", 
        response: rco.generation.llmResponse,
        cta: rco.generation.cta,
        debug: rco // Useful for tracing the RCO in development
      };
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ error: "Consultant pipeline failed", details: error.message });
    }
  });

}
