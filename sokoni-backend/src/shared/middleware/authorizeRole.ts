import type { RequestHandler } from 'express';
import type { Role } from '@prisma/client';
import { fail } from '../http/response.js';

export const authorizeRoles = (allowed: Role[]): RequestHandler => {
  return (req, res, next) => {
    if (!req.user) {
      return fail(res, 401, {
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
      });
    }

    if (!allowed.includes(req.user.role)) {
      return fail(res, 403, {
        code: 'FORBIDDEN',
        message: 'Insufficient permissions',
      });
    }

    return next();
  };
};
