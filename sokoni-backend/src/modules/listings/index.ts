import { Router } from 'express';
import { ok } from '../../shared/http/response.js';

export const listingsRouter = Router();

listingsRouter.get('/', (_req, res) => {
  return ok(res, { module: 'listings' });
});
