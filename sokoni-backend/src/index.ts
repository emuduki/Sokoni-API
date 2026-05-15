import { config } from './shared/config/index.js';
import { app } from './app.js';
import { logger } from './shared/logger/index.js';

app.listen(config.port, () => {
  logger.info({ port: config.port }, 'API server listening');
});
