import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { routes } from './routes.js';
import { logger } from './shared/logger/index.js';
import { errorHandler } from './shared/middleware/errorHandler.js';
import { notFoundHandler } from './shared/middleware/errorHandler.js';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(pinoHttp({ logger }));

app.use('/api', routes);
app.use('*', notFoundHandler);
app.use(errorHandler);
