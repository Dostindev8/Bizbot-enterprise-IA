import { Request, Response, NextFunction } from 'express';
import { Appointment } from '../../models/index.js';
import {
  CreateAppointmentRequestSchema,
  AvailabilityQuerySchema,
  AvailabilitySlot,
} from '@bizbot/shared-types';
import { AppError } from '../../middleware/errorHandler.js';

export class AgendaController {
  public async getAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.orgId || req.user?.orgId || 'org_default';
      const query = AvailabilityQuerySchema.parse(req.query);

      const targetDate = query.date;
      const duration = query.durationMinutes;

      // Generate time slots from 09:00 to 18:00
      const slots: AvailabilitySlot[] = [];
      const baseHours = [9, 10, 11, 14, 15, 16, 17];

      // Query existing appointments on that date
      const startOfDay = new Date(`${targetDate}T00:00:00.000Z`);
      const endOfDay = new Date(`${targetDate}T23:59:59.999Z`);

      const existingAppointments = await Appointment.find({
        orgId,
        startTime: { $gte: startOfDay, $lte: endOfDay },
        status: { $in: ['confirmed', 'pending'] },
      });

      for (const hour of baseHours) {
        const startTime = new Date(`${targetDate}T${hour.toString().padStart(2, '0')}:00:00.000Z`);
        const endTime = new Date(startTime.getTime() + duration * 60000);

        const isBooked = existingAppointments.some(
          (apt) =>
            (startTime >= apt.startTime && startTime < apt.endTime) ||
            (endTime > apt.startTime && endTime <= apt.endTime)
        );

        slots.push({
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          available: !isBooked,
          resourceName: 'Consultor Principal AI',
        });
      }

      res.status(200).json({ success: true, data: slots });
    } catch (error) {
      next(error);
    }
  }

  public async createAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.orgId || req.user?.orgId;
      if (!orgId) throw new AppError(400, 'ORG_REQUIRED', 'Organización requerida');

      const validated = CreateAppointmentRequestSchema.parse(req.body);
      const startTime = new Date(validated.startTime);
      const endTime = new Date(startTime.getTime() + validated.durationMinutes * 60000);

      const appointment = await Appointment.create({
        orgId,
        serviceName: validated.serviceName,
        resourceName: validated.resourceName || 'Especialista BizBot',
        clientName: validated.clientName,
        clientEmail: validated.clientEmail,
        clientPhone: validated.clientPhone,
        startTime,
        endTime,
        durationMinutes: validated.durationMinutes,
        status: 'confirmed',
        notes: validated.notes,
        conversationId: validated.conversationId,
        externalCalendarEventId: `gcal_${Date.now()}`,
      });

      res.status(201).json({ success: true, data: appointment });
    } catch (error) {
      next(error);
    }
  }

  public async getAppointments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.orgId || req.user?.orgId;
      const appointments = await Appointment.find({ orgId }).sort({ startTime: 1 }).limit(100);
      res.status(200).json({ success: true, data: appointments });
    } catch (error) {
      next(error);
    }
  }
}

export const agendaController = new AgendaController();
