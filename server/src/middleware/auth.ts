import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from './errorHandler.js';
import { UserRole, UserPermission } from '@bizbot/shared-types';

export interface JwtUserPayload {
  id: string;
  orgId: string;
  email: string;
  role: UserRole;
  permissions: UserPermission[];
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
      orgId?: string;
    }
  }
}

export function authenticateJWT(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError(401, 'UNAUTHORIZED', 'Token de autenticación no proporcionado');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token!, env.JWT_SECRET) as JwtUserPayload;
    req.user = decoded;
    req.orgId = decoded.orgId;
    next();
  } catch (error) {
    throw new AppError(401, 'INVALID_TOKEN', 'Token inválido o expirado');
  }
}

export function requireOrg(req: Request, _res: Response, next: NextFunction): void {
  if (!req.orgId && !req.user?.orgId) {
    throw new AppError(400, 'ORG_REQUIRED', 'Contexto de organización requerido para esta operación');
  }
  if (!req.orgId && req.user?.orgId) {
    req.orgId = req.user.orgId;
  }
  next();
}

export function authorizeRole(allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHORIZED', 'Usuario no autenticado');
    }

    if (req.user.role === 'super_admin' || allowedRoles.includes(req.user.role)) {
      return next();
    }

    throw new AppError(
      403,
      'FORBIDDEN',
      `Acceso denegado. Rol requerido: ${allowedRoles.join(', ')} (Rol actual: ${req.user.role})`
    );
  };
}

export function authorizePermission(requiredPermission: UserPermission) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHORIZED', 'Usuario no autenticado');
    }

    if (
      req.user.role === 'super_admin' ||
      req.user.permissions.includes('all:manage') ||
      req.user.permissions.includes(requiredPermission)
    ) {
      return next();
    }

    throw new AppError(
      403,
      'FORBIDDEN',
      `Permiso insuficiente: '${requiredPermission}' requerido`
    );
  };
}
