import { Router } from 'express';
import { ok } from '../../shared/http/response.js';

export const jobsRouter = Router();

jobsRouter.get('/', (_req, res) => {
  return ok(res, { module: 'jobs' });
});
