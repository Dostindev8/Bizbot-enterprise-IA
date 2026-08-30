import { Schema, model, Document } from 'mongoose';
import { MessageRole, RagCitation, MessageFeedback } from '@bizbot/shared-types';
import { orgIdIsolationPlugin } from './plugins/orgIdPlugin.js';

export interface IMessageDoc extends Document {
  conversationId: string;
  orgId: string;
  role: MessageRole;
  content: string;
  sources?: RagCitation[];
  feedback?: MessageFeedback;
  modelUsed?: string;
  tokensCount?: {
    prompt: number;
    completion: number;
    total: number;
  };
  latencyMs?: number;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessageDoc>(
  {
    conversationId: { type: String, required: true, index: true },
    orgId: { type: String, required: true, index: true },
    role: {
      type: String,
      enum: ['system', 'user', 'assistant', 'agent', 'function'],
      required: true,
    },
    content: { type: String, required: true },
    sources: [
      {
        sourceId: String,
        title: String,
        snippet: String,
        score: Number,
        url: String,
        pageNumber: Number,
      },
    ],
    feedback: {
      rating: { type: String, enum: ['thumbs_up', 'thumbs_down'] },
      reason: String,
      createdAt: { type: String },
    },
    modelUsed: { type: String },
    tokensCount: {
      prompt: Number,
      completion: Number,
      total: Number,
    },
    latencyMs: { type: Number },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

MessageSchema.plugin(orgIdIsolationPlugin);

export const Message = model<IMessageDoc>('Message', MessageSchema);
