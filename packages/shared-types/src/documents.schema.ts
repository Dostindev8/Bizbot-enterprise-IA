import { z } from 'zod';

export const DocumentStatusSchema = z.enum([
  'draft',
  'pending_signature',
  'signed',
  'rejected',
  'expired',
]);

export const SignatorySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.string().default('client'),
  hasSigned: z.boolean().default(false),
  signedAt: z.string().datetime().optional(),
  signatureUrl: z.string().url().optional(),
});

export const DocumentTemplateSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  name: z.string().min(2),
  category: z.string().default('general'),
  contentHandlebars: z.string(),
  requiredVariables: z.array(z.string()).default([]),
  version: z.number().int().default(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const DocumentSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  templateId: z.string().optional(),
  title: z.string().min(2),
  status: DocumentStatusSchema.default('draft'),
  signatories: z.array(SignatorySchema).default([]),
  dataValues: z.record(z.unknown()).default({}),
  s3Key: z.string().optional(),
  pdfUrl: z.string().url().optional(),
  version: z.number().int().default(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const GenerateDocumentRequestSchema = z.object({
  templateId: z.string().optional(),
  title: z.string().min(2, 'Título requerido'),
  dataValues: z.record(z.unknown()),
  signatories: z.array(SignatorySchema.omit({ hasSigned: true, signedAt: true, signatureUrl: true })).optional(),
});

export const SignDocumentRequestSchema = z.object({
  documentId: z.string(),
  signerEmail: z.string().email(),
  signatureBase64: z.string().min(20, 'Firma electrónica requerida'),
});

export type DocumentStatus = z.infer<typeof DocumentStatusSchema>;
export type Signatory = z.infer<typeof SignatorySchema>;
export type DocumentTemplate = z.infer<typeof DocumentTemplateSchema>;
export type Document = z.infer<typeof DocumentSchema>;
export type GenerateDocumentRequest = z.infer<typeof GenerateDocumentRequestSchema>;
export type SignDocumentRequest = z.infer<typeof SignDocumentRequestSchema>;
