export const dynamic = "force-dynamic";

import React from "react";

/* ------------------ FETCH FUNCTION ------------------ */
async function getAppointments() {
  const res = await fetch("/api/appointment", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load appointments");
  }

  return res.json();
}

/* ------------------ PAGE ------------------ */
export default async function AdminPage() {
  let appointments = [];

  try {
    appointments = await getAppointments();
  } catch (error) {
    console.error(error);
  }

  return (
    <main style={{ padding: "20px" }}>
      <h1>Admin Panel</h1>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table border={1} cellPadding={10} style={{ marginTop: "20px" }}>
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
            {appointments.map((a: any, index: number) => (
              <tr key={index}>
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
    </main>
  );
}
