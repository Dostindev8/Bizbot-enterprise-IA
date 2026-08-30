import { Request, Response, NextFunction } from 'express';
import { DocumentModel } from '../../models/index.js';
import {
  GenerateDocumentRequestSchema,
  SignDocumentRequestSchema,
} from '@bizbot/shared-types';
import { AppError } from '../../middleware/errorHandler.js';

export class DocumentsController {
  public async getDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.orgId || req.user?.orgId;
      const documents = await DocumentModel.find({ orgId }).sort({ updatedAt: -1 }).limit(100);
      res.status(200).json({ success: true, data: documents });
    } catch (error) {
      next(error);
    }
  }

  public async generateDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.orgId || req.user?.orgId;
      if (!orgId) throw new AppError(400, 'ORG_REQUIRED', 'Organización requerida');

      const validated = GenerateDocumentRequestSchema.parse(req.body);

      const signatories = (validated.signatories || []).map((s) => ({
        name: s.name,
        email: s.email,
        role: s.role || 'client',
        hasSigned: false,
      }));

      const doc = await DocumentModel.create({
        orgId,
        templateId: validated.templateId,
        title: validated.title,
        status: signatories.length > 0 ? 'pending_signature' : 'draft',
        signatories,
        dataValues: validated.dataValues,
        pdfUrl: `/api/v1/documents/sample-generated.pdf`,
        version: 1,
      });

      res.status(201).json({ success: true, data: doc });
    } catch (error) {
      next(error);
    }
  }

  public async signDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.orgId || req.user?.orgId;
      const validated = SignDocumentRequestSchema.parse(req.body);

      const doc = await DocumentModel.findOne({ _id: validated.documentId, orgId });
      if (!doc) {
        throw new AppError(404, 'DOC_NOT_FOUND', 'Documento no encontrado');
      }

      const signatory = doc.signatories.find((s) => s.email === validated.signerEmail);
      if (!signatory) {
        throw new AppError(400, 'SIGNER_NOT_IN_LIST', 'El firmante no está listado en este documento');
      }

      signatory.hasSigned = true;
      signatory.signedAt = new Date();
      signatory.signatureUrl = `data:image/svg+xml;base64,...`;

      const allSigned = doc.signatories.every((s) => s.hasSigned);
      if (allSigned) {
        doc.status = 'signed';
      }

      await doc.save();

      res.status(200).json({ success: true, data: doc, allSigned });
    } catch (error) {
      next(error);
    }
  }
}

export const documentsController = new DocumentsController();
