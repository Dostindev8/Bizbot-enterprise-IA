import { Request, Response, NextFunction } from 'express';
import { ragService } from './rag.service.js';
import { AppError } from '../../middleware/errorHandler.js';

export class RagController {
  public async ingest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.orgId || req.user?.orgId;
      if (!orgId) throw new AppError(400, 'ORG_REQUIRED', 'Organización requerida');

      const { title, content, url } = req.body;
      if (!title || !content) {
        throw new AppError(400, 'VALIDATION_ERROR', 'title y content son requeridos para ingesta');
      }

      const chunksCount = await ragService.ingestDocument(orgId, title, content, url);
      res.status(201).json({
        success: true,
        data: {
          title,
          chunksCount,
          message: `Documento indexado exitosamente en ${chunksCount} chunks vectoriales`,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public async query(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.orgId || req.user?.orgId || 'default';
      const { query, topK } = req.body;
      if (!query) throw new AppError(400, 'VALIDATION_ERROR', 'query es requerida');

      const citations = await ragService.retrieveRelevantChunks(orgId, query, topK || 3);
      res.status(200).json({ success: true, data: citations });
    } catch (error) {
      next(error);
    }
  }
}

export const ragController = new RagController();
