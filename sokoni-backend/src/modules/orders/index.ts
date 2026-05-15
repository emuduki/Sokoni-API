import { Router } from 'express';
import { ok } from '../../shared/http/response.js';

export const ordersRouter = Router();

ordersRouter.get('/', (_req, res) => {
  return ok(res, { module: 'orders' });
});
