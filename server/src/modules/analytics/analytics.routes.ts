import { Router } from 'express';
import { analyticsController } from './analytics.controller.js';
import { authenticateJWT, requireOrg } from '../../middleware/auth.js';

const router = Router();

router.get('/summary', authenticateJWT, requireOrg, (req, res, next) =>
  analyticsController.getSummary(req, res, next)
);

export const analyticsRoutes: Router = router;
