import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

declare global {
  namespace Express {
    interface Request {
      correlationId: string;
      startTime: number;
    }
  }
}

export function correlationIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const correlationId = (req.headers['x-correlation-id'] as string) || `req_${uuidv4().replace(/-/g, '').slice(0, 16)}`;
  req.correlationId = correlationId;
  req.startTime = Date.now();

  res.setHeader('x-correlation-id', correlationId);
  next();
}
