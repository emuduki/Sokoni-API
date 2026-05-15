import { Router } from 'express';
import { ok } from '../../shared/http/response.js';

export const vendorsRouter = Router();

vendorsRouter.get('/', (_req, res) => {
  return ok(res, { module: 'vendors' });
});
