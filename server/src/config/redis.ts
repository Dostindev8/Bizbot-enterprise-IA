import { Redis } from 'ioredis';
import { env } from './env.js';
import { logger } from './logger.js';

class InMemoryCacheFallback {
  private store = new Map<string, { value: string; expiresAt: number }>();

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, mode?: string, duration?: number): Promise<'OK'> {
    const ttlSeconds = mode === 'EX' && duration ? duration : 3600;
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
    return 'OK';
  }

  async del(key: string): Promise<number> {
    return this.store.delete(key) ? 1 : 0;
  }

  async incr(key: string): Promise<number> {
    const item = this.store.get(key);
    let count = 1;
    if (item && Date.now() <= item.expiresAt) {
      count = parseInt(item.value, 10) + 1;
      item.value = count.toString();
    } else {
      this.store.set(key, {
        value: '1',
        expiresAt: Date.now() + 60000, // default 1 min
      });
    }
    return count;
  }

  async expire(key: string, seconds: number): Promise<number> {
    const item = this.store.get(key);
    if (item) {
      item.expiresAt = Date.now() + seconds * 1000;
      return 1;
    }
    return 0;
  }
}

export interface ICacheClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, mode?: string, duration?: number): Promise<'OK'>;
  del(key: string): Promise<number>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
}

let redisClient: ICacheClient;

if (env.REDIS_URL && env.NODE_ENV === 'production') {
  const client = new Redis(env.REDIS_URL, {
    retryStrategy: (times: number) => Math.min(times * 100, 3000),
    maxRetriesPerRequest: 3,
  });

  client.on('connect', () => {
    logger.info('Connected to Redis server');
  });

  client.on('error', (err: unknown) => {
    logger.warn({ err }, 'Redis connection issue, continuing with safe fallback');
  });

  redisClient = client as unknown as ICacheClient;
} else {
  logger.info('Running with high-performance In-Memory Cache fallback');
  redisClient = new InMemoryCacheFallback();
}

export { redisClient };
