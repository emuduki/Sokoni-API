import { Router } from 'express';
import { ok } from '../../shared/http/response.js';

export const demandRouter = Router();

demandRouter.get('/', (_req, res) => {
  return ok(res, { module: 'demand' });
});
