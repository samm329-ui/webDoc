"use client";

import { useState, useMemo } from 'react';
import type { Appointment } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import AdminHeader from './AdminHeader';
import PatientCard from './PatientCard';

interface AdminDashboardProps {
  initialAppointments: Appointment[];
}

export default function AdminDashboard({ initialAppointments }: AdminDashboardProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [searchTerm, setSearchTerm] = useState('');

  const handleStatusChange = (appointment_id: string, diagnosed: boolean) => {
    setAppointments(prev =>
      prev.map(app =>
        app.appointment_id === appointment_id ? { ...app, diagnosed } : app
      )
    );
  };
  
  const filteredAppointments = useMemo(() => {
    if (!searchTerm) return appointments;
    return appointments.filter(
      appointment =>
        appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.phone.replace(/\D/g, '').includes(searchTerm.replace(/\D/g, ''))
    );
  }, [searchTerm, appointments]);

  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto min-h-screen">
      <AdminHeader />
      
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search patients by name or phone..."
          className="pl-10 w-full max-w-sm bg-card"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredAppointments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAppointments.map(appointment => (
            <PatientCard 
              key={appointment.appointment_id} 
              appointment={appointment}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p>No appointments found{searchTerm ? ' for your search' : ''}.</p>
        </div>
      )}
    </main>
  );
}
