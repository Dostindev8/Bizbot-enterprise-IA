import { Schema, model, Document as MongoDoc } from 'mongoose';
import { DocumentStatus } from '@bizbot/shared-types';
import { orgIdIsolationPlugin } from './plugins/orgIdPlugin.js';

export interface IDocumentDoc extends MongoDoc {
  orgId: string;
  templateId?: string;
  title: string;
  status: DocumentStatus;
  signatories: Array<{
    name: string;
    email: string;
    role: string;
    hasSigned: boolean;
    signedAt?: Date;
    signatureUrl?: string;
  }>;
  dataValues: Record<string, unknown>;
  s3Key?: string;
  pdfUrl?: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocumentDoc>(
  {
    orgId: { type: String, required: true, index: true },
    templateId: { type: String },
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ['draft', 'pending_signature', 'signed', 'rejected', 'expired'],
      default: 'draft',
      index: true,
    },
    signatories: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
        role: { type: String, default: 'client' },
        hasSigned: { type: Boolean, default: false },
        signedAt: { type: Date },
        signatureUrl: { type: String },
      },
    ],
    dataValues: { type: Schema.Types.Mixed, default: {} },
    s3Key: { type: String },
    pdfUrl: { type: String },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

DocumentSchema.plugin(orgIdIsolationPlugin);

export const DocumentModel = model<IDocumentDoc>('Document', DocumentSchema);
