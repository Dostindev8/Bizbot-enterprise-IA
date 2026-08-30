import { Router } from 'express';
import { callCenterController } from './callCenter.controller.js';
import { authenticateJWT, requireOrg } from '../../middleware/auth.js';

const router = Router();

router.get('/queue-status', authenticateJWT, requireOrg, (req, res, next) =>
  callCenterController.getQueueStatus(req, res, next)
);
router.get('/records', authenticateJWT, requireOrg, (req, res, next) =>
  callCenterController.getCallRecords(req, res, next)
);

export const callCenterRoutes: Router = router;
