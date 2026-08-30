import { Router } from 'express';
import { agendaController } from './agenda.controller.js';
import { authenticateJWT, requireOrg } from '../../middleware/auth.js';

const router = Router();

router.get('/availability', (req, res, next) => agendaController.getAvailability(req, res, next));
router.post('/appointments', authenticateJWT, requireOrg, (req, res, next) =>
  agendaController.createAppointment(req, res, next)
);
router.get('/appointments', authenticateJWT, requireOrg, (req, res, next) =>
  agendaController.getAppointments(req, res, next)
);

export const agendaRoutes: Router = router;
