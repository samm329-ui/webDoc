export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { addAppointment, updateAppointmentStatus } from "@/lib/google-sheets";
import { z } from "zod";
import { google } from "googleapis";

/* ------------------ CORS ------------------ */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/* ------------------ OPTIONS (MANDATORY) ------------------ */

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

/* ------------------ SCHEMAS ------------------ */

const appointmentSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  preferred_date: z.string().min(1),
  appointment_type: z.string(),
  notes: z.string().optional(),
});

const updateSchema = z.object({
  appointment_id: z.string().min(1),
  diagnosed: z.boolean(),
});

/* ------------------ GET ------------------ */

export async function GET() {
  try {
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      undefined,
      process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    const meta = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    });

    const sheetTitle = meta.data.sheets?.[0]?.properties?.title;

    if (!sheetTitle) {
      throw new Error("No sheet found");
    }

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: `${sheetTitle}!A2:I`,
    });

    return new Response(JSON.stringify(res.data.values || []), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Sheets error:", error);
    return new Response("Failed to fetch appointments", {
      status: 500,
      headers: corsHeaders,
    });
  }
}

/* ------------------ POST ------------------ */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = appointmentSchema.safeParse(body);

    if (!validation.success) {
      return new Response(
        JSON.stringify({ message: "Invalid input" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const newAppointment = await addAppointment(validation.data);

    return new Response(
      JSON.stringify({
        message: "Appointment created",
        appointment_id: newAppointment.appointment_id,
      }),
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Failed to create appointment:", error);
    return new Response(
      JSON.stringify({ message: "Failed to create appointment" }),
      { status: 500, headers: corsHeaders }
    );
  }
}

/* ------------------ PATCH ------------------ */

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const validation = updateSchema.safeParse(body);

    if (!validation.success) {
      return new Response(
        JSON.stringify({ message: "Invalid input" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const { appointment_id, diagnosed } = validation.data;
    const result = await updateAppointmentStatus(appointment_id, diagnosed);

    if (!result.success) {
      return new Response(
        JSON.stringify({ message: "Update failed" }),
        { status: 404, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ message: "Appointment updated successfully" }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Failed to update appointment:", error);
    return new Response(
      JSON.stringify({ message: "Failed to update appointment" }),
      { status: 500, headers: corsHeaders }
    );
  }
}
