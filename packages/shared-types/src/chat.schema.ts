import { z } from 'zod';

export const ChannelTypeSchema = z.enum(['web', 'whatsapp', 'email', 'voice', 'widget']);

export const ConversationStatusSchema = z.enum([
  'active',
  'waiting_user',
  'waiting_agent',
  'resolved',
  'handed_off',
  'archived',
]);

export const MessageRoleSchema = z.enum(['system', 'user', 'assistant', 'agent', 'function']);

export const RagCitationSchema = z.object({
  sourceId: z.string(),
  title: z.string(),
  snippet: z.string(),
  score: z.number().min(0).max(1),
  url: z.string().optional(),
  pageNumber: z.number().int().optional(),
});

export const MessageFeedbackSchema = z.object({
  rating: z.enum(['thumbs_up', 'thumbs_down']),
  reason: z.string().max(500).optional(),
  createdAt: z.string().datetime(),
});

export const MessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  orgId: z.string(),
  role: MessageRoleSchema,
  content: z.string(),
  sources: z.array(RagCitationSchema).optional(),
  feedback: MessageFeedbackSchema.optional(),
  modelUsed: z.string().optional(),
  tokensCount: z
    .object({
      prompt: z.number().int(),
      completion: z.number().int(),
      total: z.number().int(),
    })
    .optional(),
  latencyMs: z.number().optional(),
  createdAt: z.string().datetime(),
});

export const ConversationSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  channel: ChannelTypeSchema,
  status: ConversationStatusSchema.default('active'),
  contactId: z.string().optional(),
  contactName: z.string().optional(),
  contactIdentifier: z.string().optional(), // phone or email or session
  assignedAgentId: z.string().optional(),
  summary: z.string().optional(),
  sentiment: z.enum(['positive', 'neutral', 'negative']).optional(),
  language: z.string().default('es'),
  metadata: z.record(z.unknown()).optional(),
  lastMessageAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const ChatRequestSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1, 'El mensaje no puede estar vacío').max(4000),
  channel: ChannelTypeSchema.default('web'),
  contactIdentifier: z.string().optional(),
  contactName: z.string().optional(),
  stream: z.boolean().default(true),
  modelPreference: z.enum(['fast', 'standard', 'deep']).default('standard').optional(),
});

export const ChatStreamChunkSchema = z.object({
  type: z.enum(['token', 'sources', 'done', 'error', 'meta']),
  token: z.string().optional(),
  sources: z.array(RagCitationSchema).optional(),
  conversationId: z.string().optional(),
  messageId: z.string().optional(),
  model: z.string().optional(),
  cached: z.boolean().optional(),
  error: z.string().optional(),
});

export const MessageFeedbackRequestSchema = z.object({
  messageId: z.string(),
  rating: z.enum(['thumbs_up', 'thumbs_down']),
  reason: z.string().max(500).optional(),
});

export type ChannelType = z.infer<typeof ChannelTypeSchema>;
export type ConversationStatus = z.infer<typeof ConversationStatusSchema>;
export type MessageRole = z.infer<typeof MessageRoleSchema>;
export type RagCitation = z.infer<typeof RagCitationSchema>;
export type MessageFeedback = z.infer<typeof MessageFeedbackSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Conversation = z.infer<typeof ConversationSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ChatStreamChunk = z.infer<typeof ChatStreamChunkSchema>;
export type MessageFeedbackRequest = z.infer<typeof MessageFeedbackRequestSchema>;
