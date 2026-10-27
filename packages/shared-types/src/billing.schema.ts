import { z } from 'zod';
import { PlanTierSchema } from './organization.schema.js';

export const SubscriptionStatusSchema = z.enum([
  'active',
  'trialing',
  'past_due',
  'canceled',
  'unpaid',
  'incomplete',
]);

export const SubscriptionPlanDetailsSchema = z.object({
  tier: PlanTierSchema,
  name: z.string(),
  priceMonthlyUsd: z.number(),
  priceMonthlyCents: z.number().int().nonnegative(),
  maxConversations: z.number().int(),
  features: z.array(z.string()),
  stripePriceId: z.string().optional(),
});

export const SubscriptionSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  plan: PlanTierSchema,
  status: SubscriptionStatusSchema,
  currentPeriodStart: z.string().datetime(),
  currentPeriodEnd: z.string().datetime(),
  cancelAtPeriodEnd: z.boolean().default(false),
  stripeSubscriptionId: z.string().optional(),
  stripeCustomerId: z.string().optional(),
});

export const CreateCheckoutSessionRequestSchema = z.object({
  plan: PlanTierSchema,
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
  previewHash: z.string().min(16).optional(),
});

export type SubscriptionStatus = z.infer<typeof SubscriptionStatusSchema>;
export type SubscriptionPlanDetails = z.infer<typeof SubscriptionPlanDetailsSchema>;
export type Subscription = z.infer<typeof SubscriptionSchema>;
export type CreateCheckoutSessionRequest = z.infer<typeof CreateCheckoutSessionRequestSchema>;
