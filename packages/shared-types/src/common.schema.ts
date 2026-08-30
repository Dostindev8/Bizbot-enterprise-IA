import { z } from 'zod';

export const StandardErrorDetailsSchema = z.object({
  field: z.string().optional(),
  issue: z.string(),
  message: z.string().optional(),
});

export const StandardErrorPayloadSchema = z.object({
  code: z.string(),
  message: z.string(),
  correlationId: z.string(),
  details: z.array(StandardErrorDetailsSchema).optional(),
});

export const StandardErrorResponseSchema = z.object({
  success: z.literal(false),
  error: StandardErrorPayloadSchema,
});

export const StandardSuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    meta: z
      .object({
        page: z.number().optional(),
        limit: z.number().optional(),
        total: z.number().optional(),
        hasMore: z.boolean().optional(),
        correlationId: z.string().optional(),
      })
      .optional(),
  });

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const AuditLogActionSchema = z.enum([
  'auth:login',
  'auth:logout',
  'auth:register',
  'auth:mfa_verified',
  'auth:password_reset',
  'org:updated',
  'user:created',
  'user:updated',
  'user:deleted',
  'chat:session_created',
  'document:generated',
  'document:signed',
  'appointment:booked',
  'crm:contact_created',
  'crm:opportunity_updated',
  'billing:subscription_changed',
  'workflow:executed',
]);

export const AuditLogSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  actorId: z.string(),
  actorEmail: z.string().email(),
  action: AuditLogActionSchema,
  resourceRef: z.string(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.string().datetime(),
});

export type StandardErrorResponse = z.infer<typeof StandardErrorResponseSchema>;
export type StandardErrorPayload = z.infer<typeof StandardErrorPayloadSchema>;
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type AuditLog = z.infer<typeof AuditLogSchema>;
export type AuditLogAction = z.infer<typeof AuditLogActionSchema>;
