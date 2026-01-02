export const dynamic = "force-dynamic";

import React from "react";

/* ------------------ SAFE FETCH ------------------ */
async function getAppointmentsSafe() {
  try {
    const res = await fetch("/api/appointment", {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("API response not OK");
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error("Fetch failed:", err);
    return [];
  }
}

/* ------------------ PAGE ------------------ */
export default async function AdminPage() {
  const appointments = await getAppointmentsSafe();

  return (
    <div style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <h1>Admin Panel</h1>

      {appointments.length === 0 ? (
        <p>No appointments available or server error.</p>
      ) : (
        <table
          border={1}
          cellPadding={10}
          style={{ marginTop: "20px", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Date</th>
              <th>Type</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a: any, i: number) => (
              <tr key={i}>
                <td>{a.name}</td>
                <td>{a.phone}</td>
                <td>{a.email || "-"}</td>
                <td>{a.preferred_date}</td>
                <td>{a.appointment_type}</td>
                <td>{a.notes || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
