export type AppointmentStatus = 'Pending' | 'Diagnosed';

export type Appointment = {
  appointment_id: string;
  created_at: string;
  name: string;
  phone: string;
  email?: string;
  preferred_date: string;
  appointment_type: 'Check-up' | 'Consultation' | 'Follow-up';
  notes?: string;
  diagnosed: boolean;
  prescription?: string;
};
