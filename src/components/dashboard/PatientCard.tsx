"use client";

import { useTransition } from 'react';
import type { Appointment } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Mail, Phone, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

interface PatientCardProps {
  appointment: Appointment;
  onStatusChange: (appointment_id: string, diagnosed: boolean) => void;
}

async function updateStatusInBackend(appointment_id: string, diagnosed: boolean) {
    const response = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointment_id, diagnosed }),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update status' }));
        throw new Error(errorData.message);
    }
    return response.json();
}

export default function PatientCard({ appointment, onStatusChange }: PatientCardProps) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleSwitchChange = (newStatus: boolean) => {
        onStatusChange(appointment.appointment_id, newStatus);
        
        startTransition(async () => {
            try {
                await updateStatusInBackend(appointment.appointment_id, newStatus);
            } catch (error) {
                onStatusChange(appointment.appointment_id, !newStatus);
                toast({
                    variant: "destructive",
                    title: "Update Failed",
                    description: "Could not update the patient's status. Please try again.",
                });
            }
        });
    };

    const status = appointment.diagnosed ? 'Diagnosed' : 'Pending';
    const formattedDate = appointment.preferred_date ? format(new Date(appointment.preferred_date), 'EEE, dd MMM yyyy') : 'No date';

    return (
        <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-300 bg-card">
            <CardHeader className="pb-4 relative">
                <CardTitle className="font-headline text-xl pr-20">{appointment.name}</CardTitle>
                <Badge
                    variant="outline"
                    className={`absolute top-4 right-4 text-xs font-semibold transition-colors ${
                        appointment.diagnosed
                            ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100'
                    }`}
                >
                    {status}
                </Badge>
            </CardHeader>
            <CardContent className="flex-grow space-y-3 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span>{appointment.phone}</span>
                </div>
                {appointment.email && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <Mail className="h-4 w-4 shrink-0" />
                        <span className="truncate">{appointment.email}</span>
                    </div>
                )}
                <div className="flex items-center gap-3 pt-2 font-medium">
                    <span className="text-primary-foreground bg-primary/80 px-2 py-1 rounded-full text-xs">{appointment.appointment_type}</span>
                </div>
                 <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>{formattedDate}</span>
                </div>
                {appointment.notes && (
                    <div className="pt-2">
                        <blockquote className="mt-2 border-l-2 pl-4 italic text-xs text-muted-foreground">
                           {appointment.notes}
                        </blockquote>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <div className="flex items-center space-x-2">
                    <Switch
                        id={`diagnosed-${appointment.appointment_id}`}
                        checked={appointment.diagnosed}
                        onCheckedChange={handleSwitchChange}
                        disabled={isPending}
                        aria-label="Mark as diagnosed"
                    />
                    <Label htmlFor={`diagnosed-${appointment.appointment_id}`} className="text-sm text-muted-foreground cursor-pointer">
                        Mark Diagnosed
                    </Label>
                </div>
            </CardFooter>
        </Card>
    );
}
