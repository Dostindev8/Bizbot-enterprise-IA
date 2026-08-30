import { Request, Response, NextFunction } from 'express';
import { CallRecord, LiveAgentQueueStatus } from '@bizbot/shared-types';

export class CallCenterController {
  public async getQueueStatus(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const status: LiveAgentQueueStatus = {
        totalAgentsOnline: 8,
        availableAgents: 5,
        busyAgents: 3,
        callsInQueue: 1,
        avgWaitTimeSeconds: 14.5,
      };
      res.status(200).json({ success: true, data: status });
    } catch (error) {
      next(error);
    }
  }

  public async getCallRecords(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const records: CallRecord[] = [
        {
          id: 'call_rec_01',
          orgId: req.orgId || 'org_demo',
          direction: 'inbound',
          status: 'completed',
          callerNumber: '+1 (809) 555-0192',
          agentId: 'agent_01',
          agentName: 'Carlos Morales',
          durationSeconds: 184,
          transcriptionText: 'Cliente consultó sobre planes de soporte corporativo y solicitó demo en vivo.',
          qaScore: 95,
          sentiment: 'positive',
          summary: 'Consulta de precios resuelta satisfactoriamente con cita agendada.',
          startedAt: new Date(Date.now() - 3600000).toISOString(),
          endedAt: new Date(Date.now() - 3416000).toISOString(),
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'call_rec_02',
          orgId: req.orgId || 'org_demo',
          direction: 'inbound',
          status: 'completed',
          callerNumber: '+1 (829) 555-0481',
          agentId: 'bot_ivr',
          agentName: 'BizBot Voice Assistant',
          durationSeconds: 62,
          transcriptionText: 'Auto-resolución de estado de factura por IVR conversacional.',
          qaScore: 98,
          sentiment: 'neutral',
          summary: 'Consulta de estado de cuenta auto-resuelta por IVR.',
          startedAt: new Date(Date.now() - 7200000).toISOString(),
          endedAt: new Date(Date.now() - 7138000).toISOString(),
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
      ];

      res.status(200).json({ success: true, data: records });
    } catch (error) {
      next(error);
    }
  }
}

export const callCenterController = new CallCenterController();
