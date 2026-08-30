import { describe, it, expect } from 'vitest';
import { RagService } from '../src/modules/rag/rag.service.js';

describe('RAG Contextual Ingestion & Retrieval Service', () => {
  const ragService = new RagService();
  const orgId = 'org_enterprise_123';

  it('should ingest documents and chunk them with metadata', async () => {
    const title = 'Company Refund Policy';
    const content = 'Refunds are granted within 30 days of purchase for all enterprise tier accounts without penalty.';

    const result = await ragService.ingestDocument(orgId, title, content);
    expect(result.chunksIngested).toBeGreaterThan(0);
    expect(result.orgId).toBe(orgId);
  });

  it('should isolate retrieved chunks strictly by orgId', async () => {
    // Ingest for Org 1
    await ragService.ingestDocument('org_alpha', 'Alpha Secret Protocol', 'Alpha unique protocol code is 9988.');
    // Ingest for Org 2
    await ragService.ingestDocument('org_beta', 'Beta Secret Protocol', 'Beta unique protocol code is 1122.');

    // Query as Org Alpha
    const alphaChunks = await ragService.retrieveRelevantChunks('org_alpha', 'protocol code');
    expect(alphaChunks.length).toBeGreaterThan(0);
    expect(alphaChunks.every((c) => c.orgId === 'org_alpha')).toBe(true);

    // Query as Org Beta
    const betaChunks = await ragService.retrieveRelevantChunks('org_beta', 'protocol code');
    expect(betaChunks.length).toBeGreaterThan(0);
    expect(betaChunks.every((c) => c.orgId === 'org_beta')).toBe(true);
  });
});
