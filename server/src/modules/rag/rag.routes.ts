import { Router } from 'express';
import { ragController } from './rag.controller.js';
import { authenticateJWT, requireOrg, authorizeRole } from '../../middleware/auth.js';

const router = Router();

router.post(
  '/ingest',
  authenticateJWT,
  requireOrg,
  authorizeRole(['org_admin', 'super_admin']),
  (req, res, next) => ragController.ingest(req, res, next)
);
router.post('/query', (req, res, next) => ragController.query(req, res, next));

export const ragRoutes: Router = router;
