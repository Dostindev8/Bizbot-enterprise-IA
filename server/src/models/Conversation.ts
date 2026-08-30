import { Schema, model, Document } from 'mongoose';
import { ChannelType, ConversationStatus } from '@bizbot/shared-types';
import { orgIdIsolationPlugin } from './plugins/orgIdPlugin.js';

export interface IConversationDoc extends Document {
  orgId: string;
  channel: ChannelType;
  status: ConversationStatus;
  contactId?: string;
  contactName?: string;
  contactIdentifier?: string;
  assignedAgentId?: string;
  summary?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  language: string;
  metadata?: Record<string, unknown>;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversationDoc>(
  {
    orgId: { type: String, required: true, index: true },
    channel: {
      type: String,
      enum: ['web', 'whatsapp', 'email', 'voice', 'widget'],
      default: 'web',
    },
    status: {
      type: String,
      enum: ['active', 'waiting_user', 'waiting_agent', 'resolved', 'handed_off', 'archived'],
      default: 'active',
      index: true,
    },
    contactId: { type: String },
    contactName: { type: String },
    contactIdentifier: { type: String, index: true },
    assignedAgentId: { type: String },
    summary: { type: String },
    sentiment: { type: String, enum: ['positive', 'neutral', 'negative'] },
    language: { type: String, default: 'es' },
    metadata: { type: Schema.Types.Mixed },
    lastMessageAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

ConversationSchema.plugin(orgIdIsolationPlugin);

export const Conversation = model<IConversationDoc>('Conversation', ConversationSchema);
