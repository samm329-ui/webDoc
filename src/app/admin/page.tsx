export const dynamic = "force-dynamic";

import AdminUI from "./ui";

async function getAppointments() {
  const res = await fetch("/api/appointment", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function AdminPage() {
  const appointments = await getAppointments();
  return <AdminUI appointments={appointments} />;
}
