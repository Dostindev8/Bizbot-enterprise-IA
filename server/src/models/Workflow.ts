import { Schema, model, Document } from 'mongoose';
import { orgIdIsolationPlugin } from './plugins/orgIdPlugin.js';

export interface IWorkflowDoc extends Document {
  orgId: string;
  name: string;
  description?: string;
  isActive: boolean;
  nodes: Array<{
    id: string;
    type: 'trigger' | 'condition' | 'action' | 'delay';
    title: string;
    config: Record<string, unknown>;
    nextNodes: string[];
  }>;
  executionCount: number;
  lastRunAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WorkflowSchema = new Schema<IWorkflowDoc>(
  {
    orgId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true, index: true },
    nodes: [
      {
        id: { type: String, required: true },
        type: { type: String, required: true },
        title: { type: String, required: true },
        config: { type: Schema.Types.Mixed, default: {} },
        nextNodes: { type: [String], default: [] },
      },
    ],
    executionCount: { type: Number, default: 0 },
    lastRunAt: { type: Date },
  },
  { timestamps: true }
);

WorkflowSchema.plugin(orgIdIsolationPlugin);

export const Workflow = model<IWorkflowDoc>('Workflow', WorkflowSchema);
