import { AsyncLocalStorage } from 'node:async_hooks';

export interface TenantStore {
  orgId: string;
}

export const tenantContext = new AsyncLocalStorage<TenantStore>();

export function getTenantOrgId(): string | undefined {
  return tenantContext.getStore()?.orgId;
}

export function runWithTenant<T>(orgId: string, fn: () => T): T {
  return tenantContext.run({ orgId }, fn);
}
