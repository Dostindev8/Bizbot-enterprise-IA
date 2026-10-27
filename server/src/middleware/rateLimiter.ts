import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../config/redis.js';
import { AppError } from './errorHandler.js';

function clientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0]?.trim() || '127.0.0.1';
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

export function createRateLimiter(options: {
  windowMs: number;
  maxRequests: number;
  keyPrefix: string;
}) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const identifier = req.user?.id ? `user_${req.user.id}` : `ip_${clientIp(req)}`;
    const key = `ratelimit:${options.keyPrefix}:${identifier}`;

    try {
      const currentCount = await redisClient.incr(key);

      if (currentCount === 1) {
        await redisClient.expire(key, Math.ceil(options.windowMs / 1000));
      }

      if (currentCount > options.maxRequests) {
        next(
          new AppError(
            429,
            'RATE_LIMIT_EXCEEDED',
            `Límite de peticiones excedido (${options.maxRequests} req / ${options.windowMs / 1000}s).`
          )
        );
        return;
      }

      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
        return;
      }
      // Fail-open only for cache outages — never for explicit 429
      next();
    }
  };
}

export const generalRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 120,
  keyPrefix: 'general',
});

export const authRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 15,
  keyPrefix: 'auth',
});

export const widgetRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 40,
  keyPrefix: 'widget',
});
