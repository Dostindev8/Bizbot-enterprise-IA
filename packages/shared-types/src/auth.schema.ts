import { z } from 'zod';

export const UserRoleSchema = z.enum([
  'super_admin',
  'org_admin',
  'supervisor',
  'agent',
  'viewer',
  'api_key',
]);

export const UserPermissionSchema = z.enum([
  'all:manage',
  'org:settings:read',
  'org:settings:write',
  'users:read',
  'users:write',
  'chat:read',
  'chat:respond',
  'agenda:read',
  'agenda:write',
  'documents:read',
  'documents:write',
  'documents:sign',
  'crm:read',
  'crm:write',
  'call_center:read',
  'call_center:operate',
  'workflows:read',
  'workflows:write',
  'analytics:read',
  'billing:read',
  'billing:manage',
]);

export const RegisterRequestSchema = z.object({
  organizationName: z.string().min(2, 'El nombre de empresa debe tener al menos 2 caracteres').max(100),
  organizationSlug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, 'Slug inválido (solo minúsculas, números y guiones)').optional(),
  adminName: z.string().min(2, 'El nombre del administrador es obligatorio').max(100),
  email: z.string().email('Correo electrónico no válido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un caracter especial'),
  industry: z.string().optional(),
});

export const LoginRequestSchema = z.object({
  email: z.string().email('Correo electrónico no válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
  rememberMe: z.boolean().default(false).optional(),
});

export const MfaVerifyRequestSchema = z.object({
  mfaToken: z.string().min(1, 'Token MFA requerido'),
  code: z.string().length(6, 'El código debe tener 6 dígitos').regex(/^\d+$/, 'Solo dígitos'),
});

export const MagicLinkRequestSchema = z.object({
  email: z.string().email('Correo electrónico no válido'),
});

export const MagicLinkVerifyRequestSchema = z.object({
  token: z.string().min(10, 'Token inválido'),
});

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token requerido'),
});

export const AuthUserPayloadSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: UserRoleSchema,
  permissions: z.array(UserPermissionSchema),
  mfaEnabled: z.boolean(),
  avatarUrl: z.string().url().optional(),
});

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: AuthUserPayloadSchema,
  requiresMfa: z.boolean().optional(),
  mfaToken: z.string().optional(),
});

export type UserRole = z.infer<typeof UserRoleSchema>;
export type UserPermission = z.infer<typeof UserPermissionSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type MfaVerifyRequest = z.infer<typeof MfaVerifyRequestSchema>;
export type MagicLinkRequest = z.infer<typeof MagicLinkRequestSchema>;
export type MagicLinkVerifyRequest = z.infer<typeof MagicLinkVerifyRequestSchema>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
export type AuthUserPayload = z.infer<typeof AuthUserPayloadSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
