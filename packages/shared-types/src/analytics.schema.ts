import { z } from 'zod';

export const MetricPointSchema = z.object({
  label: z.string(),
  value: z.number(),
  changePercent: z.number().optional(),
});

export const DashboardSummarySchema = z.object({
  totalConversations: z.number().int(),
  conversationsChange: z.number(),
  autoResolvedRate: z.number().min(0).max(100),
  autoResolvedChange: z.number(),
  csatScore: z.number().min(0).max(5),
  csatChange: z.number(),
  avgResponseTimeMs: z.number(),
  aiCostThisMonth: z.number(),
  aiCostChange: z.number(),
  activeLeadsCount: z.number().int(),
  appointmentsCount: z.number().int(),
  uptimePercentage: z.number().default(99.98),
  hourlyVolume: z.array(z.object({ hour: z.string(), count: z.number().int() })),
  channelDistribution: z.array(z.object({ channel: z.string(), count: z.number().int() })),
  topTopics: z.array(z.object({ topic: z.string(), count: z.number().int(), resolvedPercent: z.number() })),
});

export type MetricPoint = z.infer<typeof MetricPointSchema>;
export type DashboardSummary = z.infer<typeof DashboardSummarySchema>;
