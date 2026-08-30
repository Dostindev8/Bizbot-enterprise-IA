import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../config/redis.js';
import { AppError } from './errorHandler.js';

export function createRateLimiter(options: {
  windowMs: number;
  maxRequests: number;
  keyPrefix: string;
}) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    const identifier = req.user?.id ? `user_${req.user.id}` : `ip_${ip}`;
    const key = `ratelimit:${options.keyPrefix}:${identifier}`;

    try {
      const currentCount = await redisClient.incr(key);

      if (currentCount === 1) {
        await redisClient.expire(key, Math.ceil(options.windowMs / 1000));
      }

      if (currentCount > options.maxRequests) {
        throw new AppError(
          429,
          'RATE_LIMIT_EXCEEDED',
          `Límite de peticiones excedido (${options.maxRequests} req / ${options.windowMs / 1000}s). Por favor espera unos momentos.`
        );
      }

      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        // Fail open if rate limiter has transient redis issue
        next();
      }
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
