import { Schema, model, Document } from 'mongoose';
import { AppointmentStatus } from '@bizbot/shared-types';
import { orgIdIsolationPlugin } from './plugins/orgIdPlugin.js';

export interface IAppointmentDoc extends Document {
  orgId: string;
  serviceName: string;
  resourceName?: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  startTime: Date;
  endTime: Date;
  durationMinutes: number;
  status: AppointmentStatus;
  notes?: string;
  externalCalendarEventId?: string;
  conversationId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointmentDoc>(
  {
    orgId: { type: String, required: true, index: true },
    serviceName: { type: String, required: true },
    resourceName: { type: String },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true, lowercase: true },
    clientPhone: { type: String },
    startTime: { type: Date, required: true, index: true },
    endTime: { type: Date, required: true },
    durationMinutes: { type: Number, default: 30 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show', 'rescheduled'],
      default: 'confirmed',
      index: true,
    },
    notes: { type: String },
    externalCalendarEventId: { type: String },
    conversationId: { type: String },
  },
  { timestamps: true }
);

AppointmentSchema.plugin(orgIdIsolationPlugin);

export const Appointment = model<IAppointmentDoc>('Appointment', AppointmentSchema);
