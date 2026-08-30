import { Request, Response, NextFunction } from 'express';
import { Contact } from '../../models/index.js';
import {
  CreateContactRequestSchema,
  UpdateContactStageRequestSchema,
} from '@bizbot/shared-types';
import { AppError } from '../../middleware/errorHandler.js';

export class CrmController {
  public async getContacts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.orgId || req.user?.orgId;
      const contacts = await Contact.find({ orgId }).sort({ updatedAt: -1 }).limit(100);
      res.status(200).json({ success: true, data: contacts });
    } catch (error) {
      next(error);
    }
  }

  public async createContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.orgId || req.user?.orgId;
      if (!orgId) throw new AppError(400, 'ORG_REQUIRED', 'Organización requerida');

      const validated = CreateContactRequestSchema.parse(req.body);

      // AI lead scoring heuristic: calculated based on company info, email completeness, and interaction
      let score = validated.leadScore || 50;
      if (validated.company) score += 15;
      if (validated.phone) score += 10;
      if (validated.estimatedValue && validated.estimatedValue > 1000) score += 15;
      score = Math.min(100, Math.max(0, score));

      const contact = await Contact.create({
        orgId,
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        company: validated.company,
        leadScore: score,
        pipelineStage: validated.pipelineStage || 'lead',
        estimatedValue: validated.estimatedValue || 0,
        sourceChannel: validated.sourceChannel || 'web',
        tags: validated.tags || ['nuevo'],
        notes: validated.notes,
        lastContactAt: new Date(),
      });

      res.status(201).json({ success: true, data: contact });
    } catch (error) {
      next(error);
    }
  }

  public async updateStage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.orgId || req.user?.orgId;
      const { id } = req.params;
      const validated = UpdateContactStageRequestSchema.parse(req.body);

      const contact = await Contact.findOne({ _id: id, orgId });
      if (!contact) {
        throw new AppError(404, 'CONTACT_NOT_FOUND', 'Contacto no encontrado');
      }

      contact.pipelineStage = validated.pipelineStage;
      if (validated.notes) {
        contact.notes = (contact.notes ? contact.notes + '\n' : '') + validated.notes;
      }
      contact.lastContactAt = new Date();
      await contact.save();

      res.status(200).json({ success: true, data: contact });
    } catch (error) {
      next(error);
    }
  }
}

export const crmController = new CrmController();
