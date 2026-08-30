import { z } from 'zod';

export const AppointmentStatusSchema = z.enum([
  'pending',
  'confirmed',
  'cancelled',
  'completed',
  'no_show',
  'rescheduled',
]);

export const AppointmentSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  serviceName: z.string().min(2),
  resourceName: z.string().optional(),
  clientName: z.string().min(2),
  clientEmail: z.string().email(),
  clientPhone: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  durationMinutes: z.number().int().positive().default(30),
  status: AppointmentStatusSchema.default('confirmed'),
  notes: z.string().optional(),
  externalCalendarEventId: z.string().optional(),
  conversationId: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateAppointmentRequestSchema = z.object({
  serviceName: z.string().min(2, 'Servicio obligatorio'),
  resourceName: z.string().optional(),
  clientName: z.string().min(2, 'Nombre de cliente obligatorio'),
  clientEmail: z.string().email('Email inválido'),
  clientPhone: z.string().optional(),
  startTime: z.string().datetime('Formato de fecha inválido ISO'),
  durationMinutes: z.number().int().min(15).max(480).default(30),
  notes: z.string().optional(),
  conversationId: z.string().optional(),
});

export const AvailabilitySlotSchema = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  available: z.boolean(),
  resourceName: z.string().optional(),
});

export const AvailabilityQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD'),
  serviceName: z.string().optional(),
  durationMinutes: z.coerce.number().default(30),
});

export type AppointmentStatus = z.infer<typeof AppointmentStatusSchema>;
export type Appointment = z.infer<typeof AppointmentSchema>;
export type CreateAppointmentRequest = z.infer<typeof CreateAppointmentRequestSchema>;
export type AvailabilitySlot = z.infer<typeof AvailabilitySlotSchema>;
export type AvailabilityQuery = z.infer<typeof AvailabilityQuerySchema>;
