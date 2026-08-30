import { Schema, model, Document } from 'mongoose';
import { AuditLogAction } from '@bizbot/shared-types';
import { orgIdIsolationPlugin } from './plugins/orgIdPlugin.js';

export interface IAuditLogDoc extends Document {
  orgId: string;
  actorId: string;
  actorEmail: string;
  action: AuditLogAction;
  resourceRef: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLogDoc>(
  {
    orgId: { type: String, required: true, index: true },
    actorId: { type: String, required: true },
    actorEmail: { type: String, required: true },
    action: { type: String, required: true, index: true },
    resourceRef: { type: String, required: true },
    ipAddress: { type: String },
    userAgent: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    // 365 days TTL
    expireAfterSeconds: 365 * 24 * 60 * 60,
  }
);

AuditLogSchema.plugin(orgIdIsolationPlugin);

export const AuditLog = model<IAuditLogDoc>('AuditLog', AuditLogSchema);
