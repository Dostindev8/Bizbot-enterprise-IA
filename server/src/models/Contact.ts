import { Schema, model, Document } from 'mongoose';
import { PipelineStage } from '@bizbot/shared-types';
import { orgIdIsolationPlugin } from './plugins/orgIdPlugin.js';

export interface IContactDoc extends Document {
  orgId: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  leadScore: number;
  pipelineStage: PipelineStage;
  estimatedValue: number;
  sourceChannel: string;
  tags: string[];
  notes?: string;
  lastContactAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContactDoc>(
  {
    orgId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    company: { type: String },
    leadScore: { type: Number, min: 0, max: 100, default: 50, index: true },
    pipelineStage: {
      type: String,
      enum: ['lead', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'won', 'lost'],
      default: 'lead',
      index: true,
    },
    estimatedValue: { type: Number, default: 0 },
    sourceChannel: { type: String, default: 'web' },
    tags: { type: [String], default: [] },
    notes: { type: String },
    lastContactAt: { type: Date },
  },
  { timestamps: true }
);

ContactSchema.plugin(orgIdIsolationPlugin);

export const Contact = model<IContactDoc>('Contact', ContactSchema);
