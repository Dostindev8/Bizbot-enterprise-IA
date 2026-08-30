import { z } from 'zod';

export const WorkflowTriggerTypeSchema = z.enum([
  'conversation_started',
  'lead_captured',
  'appointment_booked',
  'document_signed',
  'call_ended',
  'webhook_received',
  'schedule_cron',
]);

export const WorkflowActionTypeSchema = z.enum([
  'send_email',
  'send_whatsapp',
  'create_crm_task',
  'trigger_webhook',
  'ai_generate_summary',
  'assign_agent',
  'update_contact_score',
  'delay_timer',
]);

export const WorkflowNodeSchema = z.object({
  id: z.string(),
  type: z.enum(['trigger', 'condition', 'action', 'delay']),
  title: z.string(),
  config: z.record(z.unknown()),
  nextNodes: z.array(z.string()).default([]),
});

export const WorkflowSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  name: z.string().min(2),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  nodes: z.array(WorkflowNodeSchema),
  executionCount: z.number().int().default(0),
  lastRunAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const WorkflowRunStatusSchema = z.enum(['pending', 'running', 'completed', 'failed']);

export const WorkflowRunSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  workflowId: z.string(),
  status: WorkflowRunStatusSchema,
  triggerPayload: z.record(z.unknown()),
  executionLogs: z.array(
    z.object({
      nodeId: z.string(),
      status: z.enum(['success', 'error', 'skipped']),
      message: z.string(),
      timestamp: z.string().datetime(),
    })
  ),
  startedAt: z.string().datetime(),
  finishedAt: z.string().datetime().optional(),
});

export type WorkflowTriggerType = z.infer<typeof WorkflowTriggerTypeSchema>;
export type WorkflowActionType = z.infer<typeof WorkflowActionTypeSchema>;
export type WorkflowNode = z.infer<typeof WorkflowNodeSchema>;
export type Workflow = z.infer<typeof WorkflowSchema>;
export type WorkflowRun = z.infer<typeof WorkflowRunSchema>;
