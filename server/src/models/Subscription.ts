import { Schema, model, Document } from 'mongoose';
import { PlanTier, SubscriptionStatus } from '@bizbot/shared-types';
import { orgIdIsolationPlugin } from './plugins/orgIdPlugin.js';

export interface ISubscriptionDoc extends Document {
  orgId: string;
  plan: PlanTier;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscriptionDoc>(
  {
    orgId: { type: String, required: true, unique: true, index: true },
    plan: {
      type: String,
      enum: ['starter', 'pro', 'business', 'enterprise'],
      default: 'starter',
    },
    status: {
      type: String,
      enum: ['active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete'],
      default: 'active',
    },
    currentPeriodStart: { type: Date, default: Date.now },
    currentPeriodEnd: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    stripeSubscriptionId: { type: String },
    stripeCustomerId: { type: String },
  },
  { timestamps: true }
);

SubscriptionSchema.plugin(orgIdIsolationPlugin);

export const Subscription = model<ISubscriptionDoc>('Subscription', SubscriptionSchema);
