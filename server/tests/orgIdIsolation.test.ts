import { describe, it, expect } from 'vitest';
import { Schema } from 'mongoose';
import { orgIdIsolationPlugin } from '../src/models/plugins/orgIdPlugin.js';

describe('Multi-Tenant orgId Isolation Plugin', () => {
  it('should add orgId field to schema with required true and indexed', () => {
    const testSchema = new Schema({
      name: { type: String, required: true },
    });

    orgIdIsolationPlugin(testSchema);

    const orgIdPath = testSchema.path('orgId');
    expect(orgIdPath).toBeDefined();
    expect(orgIdPath.isRequired).toBe(true);
  });

  it('should have compound index with orgId for optimal tenant isolation queries', () => {
    const testSchema = new Schema({
      name: { type: String, required: true },
    });

    orgIdIsolationPlugin(testSchema);
    const indexes = testSchema.indexes();
    expect(indexes.some(([fields]) => fields.orgId === 1)).toBe(true);
  });
});
