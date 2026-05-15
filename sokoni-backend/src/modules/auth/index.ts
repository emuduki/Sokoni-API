import { Router } from 'express';
import { ok } from '../../shared/http/response.js';

export const authRouter = Router();

authRouter.get('/', (_req, res) => {
  return ok(res, { module: 'auth' });
});
