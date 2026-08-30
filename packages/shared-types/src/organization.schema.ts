import { z } from 'zod';

export const PlanTierSchema = z.enum(['starter', 'pro', 'business', 'enterprise']);

export const BrandThemeSchema = z.object({
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6})$/, 'Color hex inválido').default('#00D4FF'),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6})$/, 'Color hex inválido').default('#7C3AED'),
  accentColor: z.string().regex(/^#([A-Fa-f0-9]{6})$/, 'Color hex inválido').default('#39E58C'),
  logoUrl: z.string().url().optional(),
  faviconUrl: z.string().url().optional(),
  botAvatarUrl: z.string().url().optional(),
  botDisplayName: z.string().min(1).default('BizBot Assistant'),
  welcomeMessage: z.string().default('¡Hola! Soy tu asistente de negocios 24/7. ¿En qué puedo ayudarte hoy?'),
  fontFamily: z.string().default('Inter, system-ui, sans-serif'),
});

export const OrgLimitsSchema = z.object({
  maxUsers: z.number().int().positive().default(5),
  maxConversationsPerMonth: z.number().int().positive().default(1000),
  maxDocumentsStorageMb: z.number().int().positive().default(1000),
  maxWorkflows: z.number().int().positive().default(5),
  allowedChannels: z.array(z.enum(['web', 'whatsapp', 'email', 'voice'])).default(['web']),
  customBrandingAllowed: z.boolean().default(false),
});

export const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(50),
  plan: PlanTierSchema.default('starter'),
  brandTheme: BrandThemeSchema.default({}),
  limits: OrgLimitsSchema.default({}),
  isActive: z.boolean().default(true),
  stripeCustomerId: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const UpdateOrgThemeRequestSchema = z.object({
  brandTheme: BrandThemeSchema.partial(),
});

export type PlanTier = z.infer<typeof PlanTierSchema>;
export type BrandTheme = z.infer<typeof BrandThemeSchema>;
export type OrgLimits = z.infer<typeof OrgLimitsSchema>;
export type Organization = z.infer<typeof OrganizationSchema>;
export type UpdateOrgThemeRequest = z.infer<typeof UpdateOrgThemeRequestSchema>;
