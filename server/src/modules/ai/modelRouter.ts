import { env } from '../../config/env.js';
import { redisClient } from '../../config/redis.js';
import { logger } from '../../config/logger.js';
import { RagCitation } from '@bizbot/shared-types';

export interface ModelRouteDecision {
  model: string;
  tier: 'fast' | 'standard' | 'deep';
  reason: string;
  temperature: number;
}

export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private readonly threshold = 5;
  private readonly timeout = 30000; // 30s cooldown

  public async execute<T>(fn: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
        logger.info('Circuit Breaker entering HALF_OPEN state');
      } else {
        logger.warn('Circuit Breaker is OPEN, executing fallback');
        return fallback();
      }
    }

    try {
      const result = await fn();
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failures = 0;
        logger.info('Circuit Breaker restored to CLOSED state');
      }
      return result;
    } catch (error) {
      this.failures++;
      this.lastFailureTime = Date.now();
      if (this.failures >= this.threshold) {
        this.state = 'OPEN';
        logger.error({ failures: this.failures }, 'Circuit Breaker tripped to OPEN state');
      }
      return fallback();
    }
  }
}

export class ModelRouter {
  private circuitBreaker = new CircuitBreaker();

  public routeQuery(message: string, preference?: 'fast' | 'standard' | 'deep'): ModelRouteDecision {
    if (preference === 'fast') {
      return {
        model: env.AI_FAST_MODEL,
        tier: 'fast',
        reason: 'User preference: Fast mode',
        temperature: 0.3,
      };
    }

    if (preference === 'deep') {
      return {
        model: env.AI_HIGH_MODEL,
        tier: 'deep',
        reason: 'User preference: Deep analysis',
        temperature: 0.2,
      };
    }

    const lower = message.toLowerCase();

    // Fast Haiku: Short greetings, basic FAQ, operational questions
    const isShortFaq =
      message.length < 50 ||
      lower.includes('hola') ||
      lower.includes('horario') ||
      lower.includes('precio') ||
      lower.includes('contacto') ||
      lower.includes('ubicacion');

    if (isShortFaq) {
      return {
        model: env.AI_FAST_MODEL,
        tier: 'fast',
        reason: 'FAQ/Triage pattern detected — optimal latency & cost',
        temperature: 0.3,
      };
    }

    // Deep Opus: Legal, financial, multi-step contracts, complex audit
    const isDeepComplex =
      lower.includes('auditor') ||
      lower.includes('contrato complejo') ||
      lower.includes('regulacion') ||
      lower.includes('analisis financiero') ||
      message.length > 800;

    if (isDeepComplex) {
      return {
        model: env.AI_HIGH_MODEL,
        tier: 'deep',
        reason: 'Deep reasoning & document synthesis required',
        temperature: 0.2,
      };
    }

    // Standard Sonnet: Default enterprise RAG
    return {
      model: env.AI_DEFAULT_MODEL,
      tier: 'standard',
      reason: 'Standard contextual enterprise assistant with RAG',
      temperature: 0.4,
    };
  }

  public async getSemanticCachedResponse(
    orgId: string,
    query: string
  ): Promise<{ text: string; sources: RagCitation[] } | null> {
    const key = `semantic_cache:${orgId}:${Buffer.from(query.trim().toLowerCase()).toString('base64').slice(0, 32)}`;
    try {
      const cached = await redisClient.get(key);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // cache miss / error ignored
    }
    return null;
  }

  public async setSemanticCachedResponse(
    orgId: string,
    query: string,
    response: { text: string; sources: RagCitation[] }
  ): Promise<void> {
    const key = `semantic_cache:${orgId}:${Buffer.from(query.trim().toLowerCase()).toString('base64').slice(0, 32)}`;
    try {
      await redisClient.set(key, JSON.stringify(response), 'EX', 7200); // 2 hours
    } catch {
      // ignore
    }
  }

  public getCircuitBreaker(): CircuitBreaker {
    return this.circuitBreaker;
  }
}

export const modelRouter = new ModelRouter();
