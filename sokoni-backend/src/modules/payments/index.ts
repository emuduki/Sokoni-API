import { Router } from 'express';
import { ok } from '../../shared/http/response.js';

export const paymentsRouter = Router();

paymentsRouter.get('/', (_req, res) => {
  return ok(res, { module: 'payments' });
});
