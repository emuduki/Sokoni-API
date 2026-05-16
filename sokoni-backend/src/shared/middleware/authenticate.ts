import type { RequestHandler } from 'express';
import type { Role } from '@prisma/client';
import { fail } from '../http/response.js';
import { verifyToken } from '../auth/jwt.js';

export const authenticate: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return fail(res, 401, {
      code: 'UNAUTHORIZED',
      message: 'Missing or invalid authorization header',
    });
  }

  const token = header.replace('Bearer ', '').trim();

  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role as Role,
    };
    return next();
  } catch {
    return fail(res, 401, {
      code: 'UNAUTHORIZED',
      message: 'Invalid or expired token',
    });
  }
};
