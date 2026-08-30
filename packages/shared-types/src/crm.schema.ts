import { z } from 'zod';

export const PipelineStageSchema = z.enum([
  'lead',
  'contacted',
  'qualified',
  'proposal_sent',
  'negotiation',
  'won',
  'lost',
]);

export const ContactSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  leadScore: z.number().min(0).max(100).default(50),
  pipelineStage: PipelineStageSchema.default('lead'),
  estimatedValue: z.number().min(0).default(0),
  sourceChannel: z.string().default('web'),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional(),
  lastContactAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateContactRequestSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  leadScore: z.number().min(0).max(100).optional(),
  pipelineStage: PipelineStageSchema.optional(),
  estimatedValue: z.number().min(0).optional(),
  sourceChannel: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const UpdateContactStageRequestSchema = z.object({
  pipelineStage: PipelineStageSchema,
  notes: z.string().optional(),
});

export type PipelineStage = z.infer<typeof PipelineStageSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type CreateContactRequest = z.infer<typeof CreateContactRequestSchema>;
export type UpdateContactStageRequest = z.infer<typeof UpdateContactStageRequestSchema>;
