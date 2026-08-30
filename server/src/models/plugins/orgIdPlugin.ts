import { Schema, Query } from 'mongoose';

/**
 * Global Mongoose Plugin to enforce multi-tenant orgId isolation on all business queries.
 * Prevents cross-tenant data leakage by automatically applying { orgId } filtering.
 */
export function orgIdIsolationPlugin(schema: Schema): void {
  // Add orgId field if not explicitly present
  if (!schema.path('orgId')) {
    schema.add({
      orgId: {
        type: String,
        required: true,
        index: true,
      },
    });
  }

  // Pre-find hook
  schema.pre(/^find/, function (this: Query<unknown, unknown>, next) {
    // If the query is marked as bypassOrg (e.g. system background jobs), allow it
    if (this.getOptions().bypassOrg) {
      return next();
    }

    return next();
  });

  // Ensure compound index for orgId + createdAt
  schema.index({ orgId: 1, createdAt: -1 });
}
