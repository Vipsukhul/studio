import { NextResponse } from 'next/server';
import * as xlsx from 'xlsx';

// Use an object as a key-value store for better data management,
// with customerCode as the key.
let storedData: { [key: string]: any } = {};

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
    const jsonData: any[] = xlsx.utils.sheet_to_json(worksheet);

    // Implement "upsert" logic to prevent duplicates
    let updatedCount = 0;
    let newCount = 0;

    jsonData.forEach(row => {
      // Assuming 'customerCode' is the unique identifier from the Excel file.
      // Make sure your Excel file has a column named 'customerCode'.
      const customerCode = row.customerCode || row['Customer Code'];
      if (!customerCode) {
        // Skip rows without a customer code
        return;
      }
      
      const recordToStore = { ...row, uploadMonth: month };

      if (storedData[customerCode]) {
        // Update existing record
        storedData[customerCode] = { ...storedData[customerCode], ...recordToStore };
        updatedCount++;
      } else {
        // Add new record
        storedData[customerCode] = recordToStore;
        newCount++;
      }
    });
    
    console.log(`Data for ${month} processed. New records: ${newCount}, Updated records: ${updatedCount}. Total records: ${Object.keys(storedData).length}`);

    return NextResponse.json({
      message: `File processed. ${newCount} new and ${updatedCount} updated records.`,
      rowCount: jsonData.length,
    });
  } catch (error) {
    console.error('Upload API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to process file.', details: errorMessage }, { status: 500 });
  }
}

// GET endpoint to return the stored data as an array
export async function GET() {
  const dataArray = Object.values(storedData);
  return NextResponse.json({ data: dataArray });
}
