"use client";

import { useState } from "react";

export default function AdminUI({ appointments }: { appointments: any[] }) {
  const [search, setSearch] = useState("");

  const filtered = appointments.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dbeef5] to-[#eef6fa] p-4 md:p-8">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 mb-6 shadow">
        <h1 className="text-2xl font-semibold text-gray-800">Admin</h1>

        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <div className="bg-white/70 rounded-xl px-4 py-3 text-gray-600">
            Today · {new Date().toDateString()}
          </div>

          <input
            placeholder="Search patients"
            className="flex-1 rounded-xl px-4 py-3 outline-none bg-white/80"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((a, i) => (
          <div
            key={i}
            className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-lg"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-gray-800">{a.name}</h2>

              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  a.diagnosed
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {a.diagnosed ? "Diagnosed" : "Pending"}
              </span>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p>📞 {a.phone}</p>
              <p>✉️ {a.email || "-"}</p>
              <p>📅 {a.appointment_type} · {a.preferred_date}</p>
              <p className="text-gray-500">{a.notes}</p>
            </div>

            {/* Toggle */}
            <div className="mt-4 flex items-center justify-between bg-white/80 rounded-xl px-4 py-2">
              <span className="text-sm font-medium">Mark Diagnosed</span>
              <div
                className={`w-12 h-6 flex items-center rounded-full p-1 ${
                  a.diagnosed ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div className="bg-white w-4 h-4 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
