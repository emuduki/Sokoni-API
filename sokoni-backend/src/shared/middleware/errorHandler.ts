import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { logger } from '../logger/index.js';
import { fail } from '../http/response.js';

export const notFoundHandler: RequestHandler = (_req, res) => {
  return fail(res, 404, {
    code: 'NOT_FOUND',
    message: 'Route not found',
  });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return fail(res, 400, {
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      details: err.flatten(),
    });
  }

  logger.error({ err }, 'Unhandled error');
  return fail(res, 500, {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong',
  });
};
