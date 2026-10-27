import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { correlationIdMiddleware } from './middleware/correlationId.js';
import { errorHandler } from './middleware/errorHandler.js';
import { generalRateLimiter } from './middleware/rateLimiter.js';
import { apiV1Routes } from './routes/index.js';
import { env } from './config/env.js';

export function createApp(): Express {
  const app = express();

  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    })
  );

  app.use(
    cors({
      origin: [env.CLIENT_URL, 'http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-correlation-id', 'x-widget-org'],
    })
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  app.use(correlationIdMiddleware);

  app.get('/healthz', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      service: 'bizbot-api-enterprise',
      version: '3.0.0',
    });
  });

  app.get('/readyz', (_req: Request, res: Response) => {
    const mongoReady = mongoose.connection.readyState === 1;
    const degraded = env.NODE_ENV !== 'production' && !mongoReady;
    res.status(mongoReady || degraded ? 200 : 503).json({
      status: mongoReady ? 'ready' : 'degraded',
      ready: mongoReady || degraded,
      checks: { mongodb: mongoReady },
    });
  });

  app.use('/api/v1', generalRateLimiter, apiV1Routes);

  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Ruta no encontrada: ${req.method} ${req.path}`,
        correlationId: req.correlationId || 'unknown_req',
      },
    });
  });

  app.use(errorHandler);

  return app;
}
