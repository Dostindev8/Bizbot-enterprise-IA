import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';
import {
  RegisterRequestSchema,
  LoginRequestSchema,
  MfaVerifyRequestSchema,
  MagicLinkRequestSchema,
  RefreshTokenRequestSchema,
} from '@bizbot/shared-types';
import { User, Organization } from '../../models/index.js';
import { AppError } from '../../middleware/errorHandler.js';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = RegisterRequestSchema.parse(req.body);
      const result = await authService.register(validated, req.correlationId);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = LoginRequestSchema.parse(req.body);
      const result = await authService.login(validated, req.correlationId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async mfaVerify(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = MfaVerifyRequestSchema.parse(req.body);
      const result = await authService.verifyMfa(validated.mfaToken, validated.code);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = RefreshTokenRequestSchema.parse(req.body);
      const result = await authService.refreshToken(validated.refreshToken);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async magicLink(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = MagicLinkRequestSchema.parse(req.body);
      const result = await authService.requestMagicLink(validated.email);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, 'UNAUTHORIZED', 'Usuario no autenticado');
      }

      const user = await User.findById(req.user.id);
      const org = await Organization.findById(req.user.orgId);

      if (!user || !org) {
        throw new AppError(404, 'NOT_FOUND', 'Usuario u organización no encontrada');
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            orgId: user.orgId,
            email: user.email,
            name: user.name,
            role: user.role,
            permissions: user.permissions,
            mfaEnabled: user.mfaEnabled,
            avatarUrl: user.avatarUrl,
          },
          organization: {
            id: org.id,
            name: org.name,
            slug: org.slug,
            plan: org.plan,
            brandTheme: org.brandTheme,
            limits: org.limits,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
