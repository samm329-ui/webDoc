export const dynamic = "force-dynamic";

import AdminUI from "./ui";
import { getAppointments } from "@/lib/google-sheets";

export default async function AdminPage() {
  console.log("AdminPage: Rendering...");
  console.log("AdminPage: Env check - Sheet ID:", process.env.GOOGLE_SHEET_ID ? "Set" : "Missing");

  const appointments = await getAppointments();
  console.log("AdminPage: Fetched appointments count:", appointments.length);

  return <AdminUI appointments={appointments} />;
}
