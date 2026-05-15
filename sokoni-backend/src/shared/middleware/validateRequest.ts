import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { fail } from '../http/response.js';

type Source = 'body' | 'query' | 'params';

export const validateRequest = (schema: ZodSchema, source: Source = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return fail(res, 400, {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: result.error.flatten(),
      });
    }

    req[source] = result.data as never;
    return next();
  };
};
