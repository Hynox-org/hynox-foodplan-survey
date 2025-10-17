import { NextResponse } from "next/server";
import { google } from "googleapis";
import path from "path"; // Not needed for Google Sheets, but keeping for consistency if other file ops were intended

// --- Google Sheets Configuration ---
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_RANGE = "Sheet1!A:Z"; // The sheet name and range where data will be appended

// Initialize Google Sheets API client
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    // Authenticate and get the sheets client
    // Authenticate and get the sheets client
    // The 'auth' object itself is a GoogleAuth client and can be passed directly.
    // No need to call getClient() separately for this usage.
    const sheets = google.sheets({ version: "v4", auth });

    // Prepare data for Google Sheets
    // The first row will be headers if the sheet is empty, subsequent rows will append data
    const headers = Object.keys(formData);
    const values = Object.values(formData).map((value) => {
      // Handle array values (e.g., plans, mealTimes) by joining them into a string
      if (Array.isArray(value)) {
        return value.join(", ");
      }
      return String(value);
    });

    // Check if the sheet is empty to write headers
    let currentSheetData;
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: SHEET_RANGE,
      });
      currentSheetData = response.data.values;
    } catch (error) {
      console.warn(
        "Could not read existing sheet data, assuming empty or new sheet:",
        error
      );
      currentSheetData = [];
    }

    const dataToWrite = [];
    if (!currentSheetData || currentSheetData.length === 0) {
      // If sheet is empty, add headers first
      dataToWrite.push(headers);
    }
    dataToWrite.push(values);

    // Append data to the Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_RANGE,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: dataToWrite,
      },
    });

    return NextResponse.json(
      { message: "Form data saved to Google Sheet" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving form data to Google Sheet:", error);
    // Provide more specific error details if available
    if (error instanceof Error) {
      return NextResponse.json(
        { message: `Error saving form data: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "An unknown error occurred while saving form data." },
      { status: 500 }
    );
  }
}

// IMPORTANT: For Google Cloud Service Account Credentials:
// Ensure the GOOGLE_APPLICATION_CREDENTIALS environment variable is set
// to the path of your service account JSON key file, or place the JSON key file
// in the root of your project and ensure it's named 'credentials.json'
// and accessible to the application.
// Also, make sure the Google Sheets API is enabled for your Google Cloud project.
