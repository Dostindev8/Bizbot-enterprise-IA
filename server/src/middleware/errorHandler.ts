import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger.js';
import { StandardErrorResponse } from '@bizbot/shared-types';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Array<{ field?: string; issue: string; message?: string }>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const correlationId = req.correlationId || 'unknown_req';

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({
      field: e.path.join('.'),
      issue: e.code,
      message: e.message,
    }));

    const response: StandardErrorResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Los datos enviados no cumplen con el esquema de validación',
        correlationId,
        details,
      },
    };

    logger.warn({ correlationId, details, path: req.path }, 'Validation error in request');
    res.status(400).json(response);
    return;
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    const response: StandardErrorResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        correlationId,
        details: err.details,
      },
    };

    logger.warn(
      { correlationId, code: err.code, message: err.message, statusCode: err.statusCode },
      'Handled application error'
    );
    res.status(err.statusCode).json(response);
    return;
  }

  // Handle generic 500 server error — never expose stack trace or internals
  const errorObj = err instanceof Error ? err : new Error(String(err));
  logger.error(
    {
      correlationId,
      error: errorObj.message,
      stack: errorObj.stack,
      path: req.path,
      method: req.method,
    },
    'Unhandled server error'
  );

  const response: StandardErrorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Ha ocurrido un error interno en el servidor. Por favor intenta más tarde.',
      correlationId,
    },
  };

  res.status(500).json(response);
};
