"use client";

export default function AdminUI({ appointments }: { appointments: any[] }) {
  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Panel</h1>
      <pre>{JSON.stringify(appointments, null, 2)}</pre>
    </div>
  );
}
