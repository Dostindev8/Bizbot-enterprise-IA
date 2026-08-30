import { z } from 'zod';

export const CallStatusSchema = z.enum([
  'queued',
  'ringing',
  'in_progress',
  'completed',
  'missed',
  'voicemail',
  'transferred',
]);

export const CallDirectionSchema = z.enum(['inbound', 'outbound']);

export const CallRecordSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  direction: CallDirectionSchema,
  status: CallStatusSchema,
  callerNumber: z.string(),
  agentId: z.string().optional(),
  agentName: z.string().optional(),
  durationSeconds: z.number().int().default(0),
  recordingUrl: z.string().url().optional(),
  transcriptionText: z.string().optional(),
  qaScore: z.number().min(0).max(100).optional(),
  sentiment: z.enum(['positive', 'neutral', 'negative']).optional(),
  summary: z.string().optional(),
  startedAt: z.string().datetime(),
  endedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
});

export const LiveAgentQueueStatusSchema = z.object({
  totalAgentsOnline: z.number().int(),
  availableAgents: z.number().int(),
  busyAgents: z.number().int(),
  callsInQueue: z.number().int(),
  avgWaitTimeSeconds: z.number(),
});

export type CallStatus = z.infer<typeof CallStatusSchema>;
export type CallDirection = z.infer<typeof CallDirectionSchema>;
export type CallRecord = z.infer<typeof CallRecordSchema>;
export type LiveAgentQueueStatus = z.infer<typeof LiveAgentQueueStatusSchema>;
