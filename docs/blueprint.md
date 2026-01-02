# **App Name**: MediTrack Admin

## Core Features:

- Appointment Submission: API endpoint to accept patient appointment data (name, phone, email, date, type, notes), validate, and store in Google Sheets with a unique appointment ID and created_at timestamp.
- Appointment Retrieval: API endpoint to fetch all appointment data from Google Sheets and return it in JSON format for display in the admin panel.
- Appointment Status Update: API endpoint to update the 'diagnosed' status of an appointment in Google Sheets based on the appointment ID.
- Patient Card Display: Display patient information in a card-based layout including name, phone, email, appointment type, date, notes, and diagnosis status. Uses the JSON returned from the 'Appointment Retrieval' API endpoint to create and populate the cards.
- Diagnosis Toggle: A toggle component on each patient card that allows the admin to mark a patient as 'Diagnosed' or 'Pending,' triggering an update to the backend via the 'Appointment Status Update' API endpoint.
- Patient Search: Implements a search bar for filtering patients by name or phone number. The search will happen client side, for speed and reduced backend load.

## Style Guidelines:

- Primary color: Soft teal (#76D9D1) to evoke a medical feel while remaining modern. Its lighter tone is professional, friendly, and communicates well-being.
- Background color: Light off-white (#F5F7FA) to provide a clean, calming, and professional backdrop that contrasts gently with the content.
- Accent color: Muted blue (#5DADE2) to highlight key interactive elements.
- Body and headline font: 'PT Sans', a humanist sans-serif providing a blend of modernity and subtle warmth.
- Card-based layout with a responsive grid system. On desktop, patient cards will be arranged in a grid (4 columns). On mobile, they will stack vertically (1 column).
- Use simple, professional icons for phone, email and calendar to visually communicate contact info and dates.
- Subtle transitions and animations when toggling diagnosis status or searching patients to provide visual feedback.