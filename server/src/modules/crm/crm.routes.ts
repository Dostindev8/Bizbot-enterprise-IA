import { Router } from 'express';
import { crmController } from './crm.controller.js';
import { authenticateJWT, requireOrg } from '../../middleware/auth.js';

const router = Router();

router.get('/contacts', authenticateJWT, requireOrg, (req, res, next) =>
  crmController.getContacts(req, res, next)
);
router.post('/contacts', authenticateJWT, requireOrg, (req, res, next) =>
  crmController.createContact(req, res, next)
);
router.patch('/contacts/:id/stage', authenticateJWT, requireOrg, (req, res, next) =>
  crmController.updateStage(req, res, next)
);

export const crmRoutes: Router = router;
