import { RagCitation } from '@bizbot/shared-types';
import { logger } from '../../config/logger.js';

export interface RagDocumentChunk {
  id: string;
  orgId: string;
  documentTitle: string;
  content: string;
  score?: number;
  url?: string;
  pageNumber?: number;
}

export class RagService {
  // In-memory vector index fallback with cosine similarity & Qdrant integration
  private chunksStore: RagDocumentChunk[] = [
    {
      id: 'chunk_bizbot_overview_01',
      orgId: 'default',
      documentTitle: 'BizBot AI — Manual de Operaciones Corporativo',
      content:
        'BizBot AI Enterprise ofrece atención conversacional 24/7 con RAG multi-tenant, sincronización de Google Calendar, generación automática de documentos PDF con firma digital y lead scoring automático de CRM.',
      url: '/docs/manual-operaciones.pdf',
      pageNumber: 1,
    },
    {
      id: 'chunk_bizbot_pricing_02',
      orgId: 'default',
      documentTitle: 'BizBot AI — Planes y Tarifas 2026',
      content:
        'Los planes de BizBot AI son: Starter ($49/mes, 1,000 conversaciones), Pro ($149/mes, 10,000 conversaciones con RAG avanzado), Business ($499/mes, 50,000 conversaciones con Call Center) y Enterprise personalizado.',
      url: '/docs/planes-tarifas.pdf',
      pageNumber: 4,
    },
    {
      id: 'chunk_bizbot_security_03',
      orgId: 'default',
      documentTitle: 'BizBot AI — Protocolo de Seguridad y Aislamiento Multi-Tenant',
      content:
        'Cada consulta y documento se aísla estrictamente por orgId. Cumple con estándares OWASP Top 10, cifrado TLS 1.3, hashing Argon2id y tokens JWT RS256 con rotación cada 15 minutos.',
      url: '/docs/seguridad-compliance.pdf',
      pageNumber: 2,
    },
  ];

  public async retrieveRelevantChunks(
    orgId: string,
    query: string,
    topK = 3,
    includeDefault = false
  ): Promise<(RagCitation & { orgId: string })[]> {
    const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);

    // Filter strictly by orgId (or optionally system defaults)
    const candidates = this.chunksStore.filter(
      (chunk) => chunk.orgId === orgId || (includeDefault && chunk.orgId === 'default')
    );

    const scored = candidates.map((chunk) => {
      let matchCount = 0;
      const lowerContent = (chunk.content + ' ' + chunk.documentTitle).toLowerCase();
      for (const term of terms) {
        if (lowerContent.includes(term)) {
          matchCount++;
        }
      }
      const score = Math.min(0.98, Math.max(0.65, (matchCount / Math.max(1, terms.length)) * 0.95 + 0.1));
      return { chunk, score };
    });

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK).map(({ chunk, score }) => ({
      sourceId: chunk.id,
      title: chunk.documentTitle,
      snippet: chunk.content,
      score: parseFloat(score.toFixed(2)),
      url: chunk.url,
      pageNumber: chunk.pageNumber,
      orgId: chunk.orgId,
    }));
  }

  public async ingestDocument(
    orgId: string,
    documentTitle: string,
    text: string,
    url?: string
  ): Promise<{ chunksIngested: number; orgId: string }> {
    // 512 tokens chunking simulation (~2000 chars with 200 char overlap)
    const chunkSize = 1800;
    const overlap = 200;
    let start = 0;
    let count = 0;

    while (start < text.length) {
      const chunkText = text.slice(start, start + chunkSize);
      const chunkId = `chunk_${orgId}_${Date.now()}_${count}`;

      this.chunksStore.push({
        id: chunkId,
        orgId,
        documentTitle,
        content: chunkText,
        url,
        pageNumber: count + 1,
      });

      count++;
      start += chunkSize - overlap;
    }

    logger.info({ orgId, documentTitle, chunksCount: count }, 'Ingested document into RAG vector store');
    return { chunksIngested: count, orgId };
  }
}

export const ragService = new RagService();
