"use client";

export default function AdminUI() {
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
        <div style={{ marginTop: "12px", color: "#555" }}>
          Today · {new Date().toDateString()}
        </div>

        <input
          placeholder="Search patients"
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

      {/* Card */}
      <div
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(12px)",
          borderRadius: "20px",
          padding: "18px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          maxWidth: "420px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
            Rahul Sharma
          </h2>
          <span
            style={{
              background: "#4CAF50",
              color: "#fff",
              padding: "4px 12px",
              borderRadius: "999px",
              fontSize: "12px",
            }}
          >
            Diagnosed
          </span>
        </div>

        <div style={{ marginTop: "10px", color: "#555", fontSize: "14px" }}>
          <div>📞 +91 9876543210</div>
          <div>✉️ rahul.sharma@email.com</div>
          <div>📅 Check-up · 15 Jan 2026</div>
          <div style={{ color: "#777", marginTop: "4px" }}>
            Knee pain
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
              background: "#4CAF50",
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
                marginLeft: "20px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
