import http from 'http';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { connectDatabase } from './config/database.js';
import { setupSocketIO } from './socket/index.js';

async function bootstrap(): Promise<void> {
  await connectDatabase();

  const app = createApp();
  const server = http.createServer(app);

  setupSocketIO(server);

  server.listen(env.PORT, () => {
    logger.info(
      {
        port: env.PORT,
        env: env.NODE_ENV,
        url: `http://localhost:${env.PORT}`,
      },
      '🚀 BizBot AI Enterprise Server running smoothly'
    );
  });
}

bootstrap().catch((err) => {
  logger.fatal({ err }, 'Failed to start BizBot AI Enterprise server');
  process.exit(1);
});
