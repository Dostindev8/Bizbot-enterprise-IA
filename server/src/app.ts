import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { correlationIdMiddleware } from './middleware/correlationId.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiV1Routes } from './routes/index.js';
import { env } from './config/env.js';

export function createApp(): Express {
  const app = express();

  // Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // handled by Nginx / Frontend headers
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS
  app.use(
    cors({
      origin: [env.CLIENT_URL, 'http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-correlation-id'],
    })
  );

  // Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Correlation ID
  app.use(correlationIdMiddleware);

  // Health checks
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
    res.status(200).json({ status: 'ready', ready: true });
  });

  // REST API v1
  app.use('/api/v1', apiV1Routes);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
