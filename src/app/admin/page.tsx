export const dynamic = "force-dynamic";

import AdminUI from "./ui";

async function getAppointments() {
  try {
    const res = await fetch("/api/appointments", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function AdminPage() {
  const appointments = await getAppointments();
  return <AdminUI appointments={appointments} />;
}
