import { describe, it, expect } from 'vitest';
import { ModelRouter, CircuitBreaker } from '../src/modules/ai/modelRouter.js';

describe('AI Engine — Model Router & Circuit Breaker', () => {
  const router = new ModelRouter();

  it('routes short FAQ queries to fast Haiku model', () => {
    const decision = router.routeQuery('Hola, ¿cuáles son sus horarios de atención?');
    expect(decision.tier).toBe('fast');
    expect(decision.model).toContain('haiku');
  });

  it('routes deep legal/audit queries to high Opus model', () => {
    const decision = router.routeQuery('Necesito un analisis financiero y auditoria de contratos corporativos complejos');
    expect(decision.tier).toBe('deep');
    expect(decision.model).toContain('opus');
  });

  it('routes general queries to standard Sonnet model', () => {
    const decision = router.routeQuery('Explícame cómo funciona la arquitectura de microservicios y RAG');
    expect(decision.tier).toBe('standard');
    expect(decision.model).toContain('sonnet');
  });

  it('respects user manual preference overrides', () => {
    const fastDecision = router.routeQuery('Cualquier texto largo complejo', 'fast');
    expect(fastDecision.tier).toBe('fast');

    const deepDecision = router.routeQuery('Hola simple', 'deep');
    expect(deepDecision.tier).toBe('deep');
  });

  it('Circuit Breaker executes fallback when threshold is reached', async () => {
    const breaker = new CircuitBreaker();
    let counter = 0;

    const failingAction = async () => {
      counter++;
      throw new Error('LLM Provider Outage');
    };

    const fallbackAction = async () => 'Fallback response';

    // Trip the breaker with 5 failures
    for (let i = 0; i < 6; i++) {
      const res = await breaker.execute(failingAction, fallbackAction);
      expect(res).toBe('Fallback response');
    }

    expect(counter).toBe(5); // 6th call was prevented by open state
  });
});
