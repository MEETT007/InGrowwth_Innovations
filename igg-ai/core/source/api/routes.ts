import { FastifyInstance } from 'fastify';
import { modelManager } from '../managers/ModelManager';
import { toolManager } from '../managers/ToolManager';

export default async function routes(fastify: FastifyInstance) {
  
  fastify.get('/health', async () => {
    const health = await modelManager.healthCheckAll();
    return { status: 'UP', providers: health };
  });

  fastify.get('/providers', async () => {
    // In a real app, modelManager would expose a way to list them
    return { message: "List of loaded providers" };
  });

  fastify.post('/chat', async (request) => {
    const { sessionId, message } = request.body as { sessionId: string; message: string };
    
    // In phase 3 this will route through LangGraph orchestrator
    // For now we just call the active provider directly to prove architecture works
    const llm = modelManager.getActiveLLMProvider();
    
    const startTime = Date.now();
    const response = await llm.generateText(message);
    const latency = Date.now() - startTime;
    
    request.log.info({ sessionId, latency, model: llm.name }, "Chat request completed");
    
    return { sessionId, response, latency };
  });

  fastify.post('/tools/execute', async (request) => {
    const { toolName, args } = request.body as { toolName: string; args: Record<string, unknown> };
    const result = await toolManager.executeTool(toolName, args);
    return { result };
  });

}
