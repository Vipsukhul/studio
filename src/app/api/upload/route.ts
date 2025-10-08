import { NextResponse } from 'next/server';
import * as xlsx from 'xlsx';

// In-memory 'database' for demonstration purposes
let storedData: any[] = [];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const month = formData.get('month') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }
    if (!month) {
      return NextResponse.json({ error: 'No month selected.' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    // Simulate storing data in a database
    // In a real app, you'd connect to a database (e.g., Firestore, PostgreSQL) here
    storedData = [...storedData, ...jsonData.map(row => ({ ...row, uploadMonth: month }))];
    
    console.log(`Data for ${month} uploaded. Total records: ${storedData.length}`);

    return NextResponse.json({
      message: 'File processed and data stored successfully.',
      rowCount: jsonData.length,
    });
  } catch (error) {
    console.error('Upload API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to process file.', details: errorMessage }, { status: 500 });
  }
}

// Optional: GET endpoint to see what's in the 'database'
export async function GET() {
  return NextResponse.json({ data: storedData });
}
