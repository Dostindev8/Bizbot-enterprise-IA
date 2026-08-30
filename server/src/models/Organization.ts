import { Schema, model, Document } from 'mongoose';
import { PlanTier, BrandTheme, OrgLimits } from '@bizbot/shared-types';

export interface IOrganizationDoc extends Document {
  name: string;
  slug: string;
  plan: PlanTier;
  brandTheme: BrandTheme;
  limits: OrgLimits;
  isActive: boolean;
  stripeCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganizationDoc>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    plan: {
      type: String,
      enum: ['starter', 'pro', 'business', 'enterprise'],
      default: 'starter',
    },
    brandTheme: {
      primaryColor: { type: String, default: '#00D4FF' },
      secondaryColor: { type: String, default: '#7C3AED' },
      accentColor: { type: String, default: '#39E58C' },
      logoUrl: { type: String },
      faviconUrl: { type: String },
      botAvatarUrl: { type: String },
      botDisplayName: { type: String, default: 'BizBot Assistant' },
      welcomeMessage: {
        type: String,
        default: '¡Hola! Soy tu asistente de negocios 24/7. ¿En qué puedo ayudarte hoy?',
      },
      fontFamily: { type: String, default: 'Inter, system-ui, sans-serif' },
    },
    limits: {
      maxUsers: { type: Number, default: 5 },
      maxConversationsPerMonth: { type: Number, default: 1000 },
      maxDocumentsStorageMb: { type: Number, default: 1000 },
      maxWorkflows: { type: Number, default: 5 },
      allowedChannels: { type: [String], default: ['web'] },
      customBrandingAllowed: { type: Boolean, default: false },
    },
    isActive: { type: Boolean, default: true },
    stripeCustomerId: { type: String },
  },
  { timestamps: true }
);

export const Organization = model<IOrganizationDoc>('Organization', OrganizationSchema);
