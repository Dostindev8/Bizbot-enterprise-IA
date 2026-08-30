import { Request, Response, NextFunction } from 'express';
import { DashboardSummary } from '@bizbot/shared-types';

export class AnalyticsController {
  public async getSummary(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const summary: DashboardSummary = {
        totalConversations: 3842,
        conversationsChange: 18.4,
        autoResolvedRate: 78.6,
        autoResolvedChange: 4.2,
        csatScore: 4.86,
        csatChange: 0.12,
        avgResponseTimeMs: 210,
        aiCostThisMonth: 46.2,
        aiCostChange: -12.5,
        activeLeadsCount: 142,
        appointmentsCount: 89,
        uptimePercentage: 99.98,
        hourlyVolume: [
          { hour: '08:00', count: 120 },
          { hour: '10:00', count: 480 },
          { hour: '12:00', count: 390 },
          { hour: '14:00', count: 620 },
          { hour: '16:00', count: 540 },
          { hour: '18:00', count: 310 },
          { hour: '20:00', count: 180 },
        ],
        channelDistribution: [
          { channel: 'Web Widget', count: 2150 },
          { channel: 'WhatsApp', count: 1240 },
          { channel: 'Email', count: 320 },
          { channel: 'Voice IVR', count: 132 },
        ],
        topTopics: [
          { topic: 'Agendamiento y Citas', count: 1420, resolvedPercent: 92 },
          { topic: 'Precios y Planes SaaS', count: 1105, resolvedPercent: 88 },
          { topic: 'Soporte Técnico RAG', count: 740, resolvedPercent: 81 },
          { topic: 'Facturación / Pagos', count: 577, resolvedPercent: 96 },
        ],
      };

      res.status(200).json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
