// types/appointment.ts
export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "canceled";

export interface Appointment {
  id: number;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: string;
  client_id: number;
  created_at: string;
}
