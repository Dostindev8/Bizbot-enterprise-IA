import { Request, Response, NextFunction } from 'express';
import { Workflow } from '../../models/index.js';
import { AppError } from '../../middleware/errorHandler.js';

export class WorkflowsController {
  public async getWorkflows(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.orgId || req.user?.orgId;
      const workflows = await Workflow.find({ orgId }).sort({ updatedAt: -1 });
      res.status(200).json({ success: true, data: workflows });
    } catch (error) {
      next(error);
    }
  }

  public async createWorkflow(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.orgId || req.user?.orgId;
      if (!orgId) throw new AppError(400, 'ORG_REQUIRED', 'Organización requerida');

      const { name, description, nodes } = req.body;
      const workflow = await Workflow.create({
        orgId,
        name,
        description,
        isActive: true,
        nodes: nodes || [
          {
            id: 'node_1',
            type: 'trigger',
            title: 'Nuevo Lead Capturado',
            config: { event: 'lead_captured' },
            nextNodes: ['node_2'],
          },
          {
            id: 'node_2',
            type: 'action',
            title: 'Enviar Notificación WhatsApp',
            config: { template: 'welcome_lead' },
            nextNodes: [],
          },
        ],
      });

      res.status(201).json({ success: true, data: workflow });
    } catch (error) {
      next(error);
    }
  }
}

export const workflowsController = new WorkflowsController();
