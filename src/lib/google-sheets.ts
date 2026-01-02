import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import type { Appointment } from './types';

function getServiceAccountAuth() {
    const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
    const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    if (!CLIENT_EMAIL || !PRIVATE_KEY) {
      return { error: 'Google Sheets API credentials are not configured correctly. Please make sure the following environment variables are set: GOOGLE_CLIENT_EMAIL, and GOOGLE_PRIVATE_KEY.' };
    }

    return { 
        auth: new JWT({
            email: CLIENT_EMAIL,
            key: PRIVATE_KEY,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        })
    };
}


async function getSheet(): Promise<GoogleSpreadsheetWorksheet> {
  const SHEET_ID = process.env.GOOGLE_SHEET_ID;
  if (!SHEET_ID) {
    throw new Error('Google Sheets ID is not set in environment variables.');
  }

  const authResult = getServiceAccountAuth();
  if ('error' in authResult) {
    throw new Error(authResult.error);
  }

  const doc = new GoogleSpreadsheet(SHEET_ID, authResult.auth);
  await doc.loadInfo();
  let sheet = doc.sheetsByIndex[0];
  
  const headers = [
    'appointment_id',
    'created_at',
    'name',
    'phone',
    'email',
    'preferred_date',
    'appointment_type',
    'notes',
    'diagnosed',
  ];

  if (!sheet) {
    sheet = await doc.addSheet({ title: 'Appointments', headerValues: headers });
    return sheet;
  }
  
  // Ensure headers are loaded before comparing them.
  await sheet.loadHeaderRow();
  const currentHeaders = sheet.headerValues || [];
  const headersMatch = headers.length === currentHeaders.length && headers.every((value, index) => value === currentHeaders[index]);

  if (!headersMatch) {
      await sheet.setHeaderRow(headers);
  }

  return sheet;
}

export async function addAppointment(data: {
  name: string;
  phone: string;
  email?: string;
  preferred_date: string;
  appointment_type: string;
  notes?: string;
}) {
  try {
    const appointmentId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      undefined,
      process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    const values = [
      appointmentId,
      createdAt,
      data.name,
      data.phone,
      data.email ?? "",
      data.preferred_date,
      data.appointment_type,
      data.notes ?? "",
      false, // diagnosed default
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: "A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [values],
      },
    });

    return { appointment_id: appointmentId };
  } catch (error) {
    console.error("Google Sheets write error:", error);
    throw new Error("Sheet insert failed");
  }
}


export async function addAppointment(data: Omit<Appointment, 'appointment_id' | 'created_at' | 'diagnosed'> & {diagnosed?: boolean}) {
  const sheet = await getSheet();
  const newId = crypto.randomUUID();
  const newAppointment = {
    appointment_id: newId,
    created_at: new Date().toISOString(),
    ...data,
    diagnosed: data.diagnosed ?? false,
  };
  await sheet.addRow(newAppointment as any);
  return newAppointment;
}

export async function updateAppointmentStatus(appointment_id: string, diagnosed: boolean): Promise<{ success: boolean; message?: string }> {
  const sheet = await getSheet();
  const rows = await sheet.getRows();
  const rowToUpdate = rows.find(row => row.get('appointment_id') === appointment_id);

  if (!rowToUpdate) {
    return { success: false, message: 'Appointment not found.' };
  }

  rowToUpdate.set('diagnosed', diagnosed);
  await rowToUpdate.save();
  return { success: true };
}
