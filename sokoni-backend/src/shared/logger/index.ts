import pino from 'pino';
import { config } from '../config/index.js';

const transport =
  config.env === 'production'
    ? undefined
    : {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'SYS:standard' },
      };

export const logger = pino({
  level: config.logLevel,
  transport,
});
