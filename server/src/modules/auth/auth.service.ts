import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../../config/env.js';
import { User, Organization, Subscription, AuditLog, IUserDoc } from '../../models/index.js';
import { AppError } from '../../middleware/errorHandler.js';
import { redisClient } from '../../config/redis.js';
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  AuthUserPayload,
  UserPermission,
} from '@bizbot/shared-types';

export class AuthService {
  async register(data: RegisterRequest, correlationId: string): Promise<AuthResponse> {
    const existingUser = await User.findOne({ email: data.email.toLowerCase() }).setOptions({
      bypassOrg: true,
    });
    if (existingUser) {
      throw new AppError(409, 'USER_EXISTS', 'Ya existe un usuario con este correo electrónico');
    }

    const slug =
      data.organizationSlug ||
      data.organizationName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 40) +
        '-' +
        Math.floor(Math.random() * 1000);

    const organization = await Organization.create({
      name: data.organizationName,
      slug,
      plan: 'starter',
      brandTheme: {
        botDisplayName: `${data.organizationName} Assistant`,
        primaryColor: '#00D4FF',
        secondaryColor: '#7C3AED',
      },
    });

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const allAdminPermissions: UserPermission[] = [
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
    ];

    const user = await User.create({
      orgId: organization.id,
      email: data.email.toLowerCase(),
      passwordHash,
      name: data.adminName,
      role: 'org_admin',
      permissions: allAdminPermissions,
      mfaEnabled: false,
    });

    await Subscription.create({
      orgId: organization.id,
      plan: 'starter',
      status: 'trialing',
    });

    await AuditLog.create({
      orgId: organization.id,
      actorId: user.id,
      actorEmail: user.email,
      action: 'auth:register',
      resourceRef: `org_${organization.id}`,
      metadata: { correlationId, initialPlan: 'starter' },
    });

    return this.generateAuthTokens(user, organization.id);
  }

  async login(data: LoginRequest, correlationId: string): Promise<AuthResponse> {
    const user = await User.findOne({ email: data.email.toLowerCase() }).setOptions({ bypassOrg: true });
    if (!user) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Credenciales incorrectas');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValidPassword) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Credenciales incorrectas');
    }

    if (user.mfaEnabled) {
      const mfaToken = `mfa_${uuidv4().replace(/-/g, '')}`;
      await redisClient.set(`mfa_pending:${mfaToken}`, user.id, 'EX', 300); // 5 min
      return {
        accessToken: '',
        refreshToken: '',
        requiresMfa: true,
        mfaToken,
        user: this.mapUserPayload(user),
      };
    }

    user.lastLogin = new Date();
    await user.save();

    await AuditLog.create({
      orgId: user.orgId,
      actorId: user.id,
      actorEmail: user.email,
      action: 'auth:login',
      resourceRef: `user_${user.id}`,
      metadata: { correlationId },
    });

    return this.generateAuthTokens(user, user.orgId);
  }

  async verifyMfa(mfaToken: string, code: string): Promise<AuthResponse> {
    const userId = await redisClient.get(`mfa_pending:${mfaToken}`);
    if (!userId) {
      throw new AppError(401, 'MFA_EXPIRED', 'Sesión MFA expirada o inválida');
    }

    const user = await User.findById(userId).setOptions({ bypassOrg: true });
    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', 'Usuario no encontrado');
    }

    const allowDemo =
      env.NODE_ENV !== 'production' || Boolean(env.ALLOW_DEMO_MFA);
    const demoOk = allowDemo && code === '123456';
    const secretOk = Boolean(user.mfaSecret) && code === user.mfaSecret;

    if (!demoOk && !secretOk) {
      throw new AppError(400, 'INVALID_MFA_CODE', 'Código MFA incorrecto');
    }

    await redisClient.del(`mfa_pending:${mfaToken}`);
    user.lastLogin = new Date();
    await user.save();

    return this.generateAuthTokens(user, user.orgId);
  }

  async refreshToken(token: string): Promise<AuthResponse> {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; orgId: string; typ?: string };
      if (decoded.typ && decoded.typ !== 'refresh') {
        throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Token de renovación inválido o expirado');
      }

      const user = await User.findById(decoded.id).setOptions({ bypassOrg: true });
      if (!user) {
        throw new AppError(401, 'USER_NOT_FOUND', 'Usuario no encontrado');
      }

      if (user.refreshTokenHash) {
        const matches = await bcrypt.compare(token, user.refreshTokenHash);
        if (!matches) {
          throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Token de renovación inválido o expirado');
        }
      }

      return this.generateAuthTokens(user, user.orgId);
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Token de renovación inválido o expirado');
    }
  }

  async requestMagicLink(email: string): Promise<{ success: boolean; message: string }> {
    const user = await User.findOne({ email: email.toLowerCase() }).setOptions({ bypassOrg: true });
    if (!user) {
      // Return success to avoid email enumeration attack
      return { success: true, message: 'Si el correo existe, se ha enviado un enlace de acceso.' };
    }

    const magicToken = `magic_${uuidv4()}`;
    await redisClient.set(`magic_link:${magicToken}`, user.id, 'EX', 900); // 15 mins

    return {
      success: true,
      message: 'Enlace de acceso mágico generado exitosamente.',
    };
  }

  private mapUserPayload(user: IUserDoc): AuthUserPayload {
    return {
      id: user.id,
      orgId: user.orgId,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: user.permissions,
      mfaEnabled: user.mfaEnabled,
      avatarUrl: user.avatarUrl,
    };
  }

  private async generateAuthTokens(user: IUserDoc, orgId: string): Promise<AuthResponse> {
    const payload = {
      id: user.id,
      orgId,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: '15m',
    });

    const refreshToken = jwt.sign({ id: user.id, orgId, typ: 'refresh' }, env.JWT_SECRET, {
      expiresIn: '7d',
    });

    user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await user.save();

    return {
      accessToken,
      refreshToken,
      user: this.mapUserPayload(user),
    };
  }
}

export const authService = new AuthService();
