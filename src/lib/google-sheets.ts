import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import type { Appointment } from './types';

// Initialize auth - using a singleton pattern for auth if possible
const getAuthAdapter = () => {
    const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
    const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!CLIENT_EMAIL || !PRIVATE_KEY) {
        throw new Error('Google Sheets API credentials are not configured correctly. Set GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY.');
    }

    return new JWT({
        email: CLIENT_EMAIL,
        key: PRIVATE_KEY,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
};

async function getDoc() {
    const SHEET_ID = process.env.GOOGLE_SHEET_ID;
    if (!SHEET_ID) {
        throw new Error('Google Sheets ID is not set in environment variables.');
    }

    const auth = getAuthAdapter();
    const doc = new GoogleSpreadsheet(SHEET_ID, auth);
    await doc.loadInfo();
    return doc;
}

export async function getAppointments(): Promise<Appointment[]> {
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0];
    if (!sheet) return [];

    const rows = await sheet.getRows();
    return rows.map(row => ({
        appointment_id: row.get('appointment_id'),
        created_at: row.get('created_at'),
        name: row.get('name'),
        phone: row.get('phone'),
        email: row.get('email'),
        preferred_date: row.get('preferred_date'),
        appointment_type: row.get('appointment_type'),
        notes: row.get('notes'),
        diagnosed: row.get('diagnosed') === 'TRUE' || row.get('diagnosed') === true,
    })) as Appointment[];
}

export async function addAppointment(data: Omit<Appointment, 'appointment_id' | 'created_at' | 'diagnosed'>) {
    const doc = await getDoc();
    let sheet = doc.sheetsByIndex[0];

    // Headers
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
    } else {
        // Ensure headers exist if sheet exists but is empty
        await sheet.loadHeaderRow();
        if (!sheet.headerValues || sheet.headerValues.length === 0) {
            await sheet.setHeaderRow(headers);
        }
    }

    const newId = crypto.randomUUID();
    const newAppointment = {
        appointment_id: newId,
        created_at: new Date().toISOString(),
        name: data.name,
        phone: data.phone,
        email: data.email || "",
        preferred_date: data.preferred_date,
        appointment_type: data.appointment_type,
        notes: data.notes || "",
        diagnosed: false,
    };

    await sheet.addRow(newAppointment);

    return { appointment_id: newId };
}

export async function updateAppointmentStatus(appointment_id: string, diagnosed: boolean): Promise<{ success: boolean; message?: string }> {
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0];
    if (!sheet) return { success: false, message: "Sheet not found" };

    const rows = await sheet.getRows();
    const rowToUpdate = rows.find(row => row.get('appointment_id') === appointment_id);

    if (!rowToUpdate) {
        return { success: false, message: 'Appointment not found.' };
    }

    rowToUpdate.set('diagnosed', diagnosed);
    await rowToUpdate.save();
    return { success: true };
}
