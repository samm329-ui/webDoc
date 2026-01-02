import type { Appointment } from '@/lib/types';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

async function loadAppointments(): Promise<{ appointments?: Appointment[], error?: string }> {
  try {
    // Using an absolute URL is necessary for fetch in Server Components
    // This will need to be replaced with the actual production URL in a real deployment
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
    const res = await fetch(`${baseUrl}/api/appointments`, { cache: 'no-store' });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Failed to fetch appointments. The server returned an invalid response.' }));
      throw new Error(errorData.message || 'Failed to fetch appointments');
    }
    
    const appointments = await res.json();
    
    // Ensure what we received is an array before trying to sort it
    if (!Array.isArray(appointments)) {
        console.error("API did not return an array of appointments:", appointments);
        throw new Error('Invalid data format received from the server.');
    }

    return { 
      appointments: appointments.sort((a: Appointment, b: Appointment) => new Date(b.preferred_date).getTime() - new Date(a.preferred_date).getTime()) 
    };
  } catch (error: any) {
    console.error("Error loading appointments:", error.message);
     if (error.message.includes('ECONNREFUSED')) {
        return { error: `Could not connect to the backend server at ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}. Please ensure the server is running and accessible.` };
    }
    if (error.message.includes('Google Sheets')) {
        return { error: `Google Sheets API credentials are not configured correctly. Please make sure the following environment variables are set: GOOGLE_SHEET_ID, GOOGLE_CLIENT_EMAIL, and GOOGLE_PRIVATE_KEY. Error: ${error.message}` };
    }
    return { error: `An unexpected error occurred: ${error.message}` };
  }
}

export default async function AdminPage() {
  const { appointments, error } = await loadAppointments();

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
          <Alert variant="destructive" className="max-w-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
      </div>
    );
  }

  return <AdminDashboard initialAppointments={appointments || []} />;
}
