import { Router } from 'express';
import { workflowsController } from './workflows.controller.js';
import { authenticateJWT, requireOrg } from '../../middleware/auth.js';

const router = Router();

router.get('/', authenticateJWT, requireOrg, (req, res, next) =>
  workflowsController.getWorkflows(req, res, next)
);
router.post('/', authenticateJWT, requireOrg, (req, res, next) =>
  workflowsController.createWorkflow(req, res, next)
);

export const workflowRoutes: Router = router;
