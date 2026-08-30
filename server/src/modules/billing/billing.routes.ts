import { Router } from 'express';
import { billingController } from './billing.controller.js';
import { authenticateJWT, requireOrg, authorizeRole } from '../../middleware/auth.js';

const router = Router();

router.get('/plans', (req, res, next) => billingController.getPlans(req, res, next));
router.post(
  '/checkout',
  authenticateJWT,
  requireOrg,
  authorizeRole(['org_admin', 'super_admin']),
  (req, res, next) => billingController.createCheckoutSession(req, res, next)
);

export const billingRoutes: Router = router;
