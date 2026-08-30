import { Schema, model, Document } from 'mongoose';
import { UserRole, UserPermission } from '@bizbot/shared-types';
import { orgIdIsolationPlugin } from './plugins/orgIdPlugin.js';

export interface IUserDoc extends Document {
  orgId: string;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  permissions: UserPermission[];
  mfaEnabled: boolean;
  mfaSecret?: string;
  avatarUrl?: string;
  refreshTokenHash?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDoc>(
  {
    orgId: { type: String, required: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ['super_admin', 'org_admin', 'supervisor', 'agent', 'viewer', 'api_key'],
      default: 'agent',
    },
    permissions: {
      type: [String],
      default: ['chat:read', 'chat:respond', 'agenda:read', 'crm:read'],
    },
    mfaEnabled: { type: Boolean, default: false },
    mfaSecret: { type: String },
    avatarUrl: { type: String },
    refreshTokenHash: { type: String },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

UserSchema.index({ orgId: 1, email: 1 }, { unique: true });
UserSchema.plugin(orgIdIsolationPlugin);

export const User = model<IUserDoc>('User', UserSchema);
