export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { addAppointment, getAppointments, updateAppointmentStatus } from "@/lib/google-sheets";
import { z } from "zod";

/* ------------------ SCHEMAS ------------------ */

const appointmentSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  phone: z.string().min(1, { message: "Phone is required" }),
  email: z.string().email().optional().or(z.literal("")),
  preferred_date: z.string().min(1, { message: "Preferred date is required" }),
  appointment_type: z.enum(["Check-up", "Consultation", "Follow-up"]),
  notes: z.string().optional(),
});

const updateSchema = z.object({
  appointment_id: z.string().min(1),
  diagnosed: z.boolean(),
});

/* ------------------ GET ------------------ */

import { google } from "googleapis";

export async function GET() {
  try {
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      undefined,
      process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: "Appointments!A2:F",
    });

    return new Response(JSON.stringify(res.data.values || []), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response("Failed to fetch appointments", { status: 500 });
  }
}

/* ------------------ POST ------------------ */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = appointmentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: validation.error.formErrors },
        { status: 400 }
      );
    }

    const newAppointment = await addAppointment(validation.data);

    return NextResponse.json(
      {
        message: "Appointment created",
        appointment_id: newAppointment.appointment_id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create appointment:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { message: "Failed to create appointment", error: errorMessage },
      { status: 500 }
    );
  }
}

/* ------------------ PATCH ------------------ */

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const validation = updateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: validation.error.formErrors },
        { status: 400 }
      );
    }

    const { appointment_id, diagnosed } = validation.data;
    const result = await updateAppointmentStatus(appointment_id, diagnosed);

    if (!result.success) {
      return NextResponse.json(
        { message: result.message || "Failed to update appointment" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Appointment updated successfully",
    });
  } catch (error) {
    console.error("Failed to update appointment:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { message: "Failed to update appointment", error: errorMessage },
      { status: 500 }
    );
  }
}
