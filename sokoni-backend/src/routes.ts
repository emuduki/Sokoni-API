import { Router } from 'express';
import { authRouter } from './modules/auth/index.js';
import { vendorsRouter } from './modules/vendors/index.js';
import { listingsRouter } from './modules/listings/index.js';
import { ordersRouter } from './modules/orders/index.js';
import { paymentsRouter } from './modules/payments/index.js';
import { demandRouter } from './modules/demand/index.js';
import { jobsRouter } from './modules/jobs/index.js';
import { fail, ok } from './shared/http/response.js';
import { prisma } from './shared/db/prisma.js';
import { redis } from './shared/db/redis.js';

export const routes = Router();

routes.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const redisStatus = await redis.ping();

    return ok(res, {
      status: 'ok',
      checks: {
        database: 'ok',
        redis: redisStatus === 'PONG' ? 'ok' : 'unexpected',
      },
    });
  } catch (error) {
    return fail(res, 503, {
      code: 'SERVICE_UNAVAILABLE',
      message: 'Health check failed',
      details: error instanceof Error ? error.message : error,
    });
  }
});

routes.use('/auth', authRouter);
routes.use('/vendors', vendorsRouter);
routes.use('/listings', listingsRouter);
routes.use('/orders', ordersRouter);
routes.use('/payments', paymentsRouter);
routes.use('/demand', demandRouter);
routes.use('/jobs', jobsRouter);
