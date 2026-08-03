import fastify from 'fastify';
import { config } from '../config/env';
import { logger } from './logger';
import { errorHandler } from './errorHandler';
import routes from './routes';
import knowledgeRoutes from './knowledgeRoutes';
import retrievalRoutes from '../../rag/source/api/retrievalRoutes';
import consultantRoutes from '../../consultant/source/api/consultantRoutes';

const server = fastify({ logger });

server.setErrorHandler(errorHandler);
server.register(routes);
server.register(knowledgeRoutes);
server.register(retrievalRoutes);
server.register(consultantRoutes);

export const startServer = async () => {
  try {
    await server.listen({ port: parseInt(config.AI_API_PORT), host: '0.0.0.0' });
    logger.info(`AI Platform Core API running on port ${config.AI_API_PORT}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};
