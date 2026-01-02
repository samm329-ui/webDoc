export const dynamic = "force-dynamic";

import React from "react";

/* ------------------ FETCH ------------------ */
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
  const appointments = await getAppointments();

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Admin Panel</h1>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
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
        </div>
      )}
    </div>
  );
}

/* ------------------ STYLES ------------------ */
const styles: any = {
  page: {
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f7f7f7",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "28px",
    marginBottom: "20px",
  },
  tableWrapper: {
    overflowX: "auto",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};
