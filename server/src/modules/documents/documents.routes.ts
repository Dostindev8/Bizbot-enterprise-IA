import { Router } from 'express';
import { documentsController } from './documents.controller.js';
import { authenticateJWT, requireOrg } from '../../middleware/auth.js';

const router = Router();

router.get('/', authenticateJWT, requireOrg, (req, res, next) =>
  documentsController.getDocuments(req, res, next)
);
router.post('/generate', authenticateJWT, requireOrg, (req, res, next) =>
  documentsController.generateDocument(req, res, next)
);
router.post('/sign', authenticateJWT, requireOrg, (req, res, next) =>
  documentsController.signDocument(req, res, next)
);

export const documentRoutes: Router = router;
