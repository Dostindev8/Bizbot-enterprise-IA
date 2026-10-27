import { Schema, Query, Aggregate } from 'mongoose';
import { getTenantOrgId } from '../../middleware/tenantContext.js';

/**
 * Forces orgId isolation on tenant collections.
 * - If AsyncLocalStorage has orgId, it ALWAYS wins (prevents IDOR).
 * - Login/register (no tenant context) may query without orgId.
 * - System jobs must pass { bypassOrg: true }.
 */
export function orgIdIsolationPlugin(schema: Schema): void {
  if (!schema.path('orgId')) {
    schema.add({
      orgId: {
        type: String,
        required: true,
        index: true,
      },
    });
  }

  function applyTenantFilter(this: Query<unknown, unknown>): void {
    if (this.getOptions().bypassOrg) {
      return;
    }

    const ctxOrgId = getTenantOrgId();
    if (ctxOrgId) {
      this.setQuery({ ...this.getQuery(), orgId: ctxOrgId });
    }
  }

  schema.pre(/^find/, function (this: Query<unknown, unknown>, next) {
    applyTenantFilter.call(this);
    next();
  });

  schema.pre('countDocuments', function (this: Query<unknown, unknown>, next) {
    applyTenantFilter.call(this);
    next();
  });

  schema.pre('updateMany', function (this: Query<unknown, unknown>, next) {
    applyTenantFilter.call(this);
    next();
  });

  schema.pre('updateOne', function (this: Query<unknown, unknown>, next) {
    applyTenantFilter.call(this);
    next();
  });

  schema.pre('findOneAndUpdate', function (this: Query<unknown, unknown>, next) {
    applyTenantFilter.call(this);
    next();
  });

  schema.pre('save', function (next) {
    const ctxOrgId = getTenantOrgId();
    const doc = this as unknown as { orgId?: string };
    if (ctxOrgId && !doc.orgId) {
      doc.orgId = ctxOrgId;
    }
    next();
  });

  schema.pre('aggregate', function (this: Aggregate<unknown>, next) {
    if (this.options.bypassOrg) {
      return next();
    }
    const ctxOrgId = getTenantOrgId();
    if (ctxOrgId) {
      this.pipeline().unshift({ $match: { orgId: ctxOrgId } });
    }
    next();
  });

  schema.index({ orgId: 1, createdAt: -1 });
}
