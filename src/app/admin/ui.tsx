"use client";

import { useState } from "react";

export default function AdminUI({ appointments }: { appointments: any[] }) {
  const [search, setSearch] = useState("");

  const filtered = appointments.filter((a) =>
    a.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #dbeef5, #eef6fa)",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(12px)",
          borderRadius: "20px",
          padding: "20px",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "600" }}>Admin</h1>
        <div style={{ marginTop: "8px", color: "#555" }}>
          Today · {new Date().toDateString()}
        </div>

        <input
          placeholder="Search patients"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            marginTop: "16px",
            width: "100%",
            padding: "12px 16px",
            borderRadius: "14px",
            border: "none",
            outline: "none",
          }}
        />
      </div>

      {/* Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
        }}
      >
        {filtered.map((a, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(12px)",
              borderRadius: "20px",
              padding: "18px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
                {a.name}
              </h2>

              <span
                style={{
                  background: a.diagnosed ? "#4CAF50" : "#ccc",
                  color: a.diagnosed ? "#fff" : "#333",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  fontSize: "12px",
                }}
              >
                {a.diagnosed ? "Diagnosed" : "Pending"}
              </span>
            </div>

            <div
              style={{
                marginTop: "10px",
                color: "#555",
                fontSize: "14px",
              }}
            >
              <div>📞 {a.phone}</div>
              <div>✉️ {a.email || "-"}</div>
              <div>
                📅 {a.appointment_type} · {a.preferred_date}
              </div>
              <div style={{ color: "#777", marginTop: "4px" }}>
                {a.notes}
              </div>
            </div>

            <div
              style={{
                marginTop: "16px",
                background: "#f0f0f0",
                borderRadius: "14px",
                padding: "10px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: "500" }}>
                Mark Diagnosed
              </span>

              <div
                style={{
                  width: "44px",
                  height: "24px",
                  background: a.diagnosed ? "#4CAF50" : "#ccc",
                  borderRadius: "999px",
                  padding: "3px",
                }}
              >
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    background: "#fff",
                    borderRadius: "50%",
                    marginLeft: a.diagnosed ? "20px" : "0px",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
