import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { logger } from './logger';

export const errorHandler = (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  logger.error({ 
    err: error,
    requestId: request.id,
    url: request.url 
  }, "Unhandled API Error");

  reply.status(error.statusCode || 500).send({
    error: {
      code: error.statusCode || 500,
      message: error.statusCode ? error.message : 'Internal Server Error'
    }
  });
};
