'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { monthOptions } from '@/lib/data';
import { UploadCloud, File, X } from 'lucide-react';
import * as xlsx from 'xlsx';
import { useFirestore, useUser, setDocumentNonBlocking } from '@/firebase';
import { doc, collection } from 'firebase/firestore';

// Generate a random ID for sub-collection documents
const generateId = (fs: any) => doc(collection(fs, '_')).id;

export default function UploadDataPage() {
  const [month, setMonth] = useState('Apr-25');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || selectedFile.name.endsWith('.xlsx')) {
        setFile(selectedFile);
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a valid .xlsx Excel file.',
        });
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || droppedFile.name.endsWith('.xlsx')) {
        setFile(droppedFile);
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a valid .xlsx Excel file.',
        });
      }
    }
  };

  const processAndUploadFile = (fileToProcess: File) => {
    const reader = new FileReader();
    reader.onload = async (e: ProgressEvent<FileReader>) => {
        if (!e.target?.result || !user || !firestore) {
            setIsLoading(false);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not read file, user not found, or database not available.' });
            return;
        }
        try {
            const data = new Uint8Array(e.target.result as ArrayBuffer);
            const workbook = xlsx.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData: any[] = xlsx.utils.sheet_to_json(worksheet, { defval: null });

            let processedCount = 0;

            const customerDataMap = new Map();

            // Group data by customer
            jsonData.forEach(row => {
              const customerCode = row['Customer Code'] || row.customerCode;
              if (!customerCode) return;

              if (!customerDataMap.has(customerCode)) {
                customerDataMap.set(customerCode, {
                  customerCode: customerCode,
                  customerName: row['Customer Name'] || row.customerName,
                  region: row['Region'] || row.region,
                  invoices: new Map()
                });
              }

              const customer = customerDataMap.get(customerCode);
              const invoiceNumber = row['Invoice Number'] || row.invoiceNumber;
              if (!invoiceNumber) return;

              if (!customer.invoices.has(invoiceNumber)) {
                customer.invoices.set(invoiceNumber, {
                  invoiceNumber: invoiceNumber,
                  invoiceAmount: Number(row['Invoice Amount'] || row.invoiceAmount || 0),
                  invoiceDate: row['Invoice Date'] || row.invoiceDate,
                  status: row['Status']?.toLowerCase() || 'unpaid',
                  customerId: customerCode,
                  outstandings: []
                });
              }
              
              const invoice = customer.invoices.get(invoiceNumber);
              invoice.outstandings.push({
                month: row['Month'] || row.month,
                amount: Number(row['Amount'] || row.amount || 0),
                agePeriod: row['Age Period'] || row.agePeriod,
                invoiceId: invoiceNumber,
              });
            });

            for (const [customerCode, customer] of customerDataMap.entries()) {
              const customerDocRef = doc(firestore, 'customers', customerCode.toString());
              const customerPayload = {
                id: customerCode.toString(),
                customerCode: customer.customerCode,
                customerName: customer.customerName,
                region: customer.region,
                uploadMonth: month,
              };
              setDocumentNonBlocking(customerDocRef, customerPayload, { merge: true });

              for (const [invoiceNumber, invoice] of customer.invoices.entries()) {
                const invoiceId = generateId(firestore);
                const invoiceDocRef = doc(firestore, 'customers', customerCode.toString(), 'invoices', invoiceId);
                const invoicePayload = {
                  id: invoiceId,
                  ...invoice,
                  outstandings: undefined // Don't store outstandings array in invoice doc
                };
                setDocumentNonBlocking(invoiceDocRef, invoicePayload, { merge: true });

                for(const outstanding of invoice.outstandings) {
                    const outstandingId = generateId(firestore);
                    const outstandingDocRef = doc(firestore, `customers/${customerCode}/invoices/${invoiceId}/outstandings`, outstandingId);
                    const outstandingPayload = {
                        id: outstandingId,
                        ...outstanding,
                        invoiceId: invoiceId, // Use the new invoice ID
                    };
                    setDocumentNonBlocking(outstandingDocRef, outstandingPayload, {merge: true});
                }
              }
              processedCount++;
            }

            toast({
                title: 'Upload Successful',
                description: `${processedCount} customer records for ${month} are being processed and saved.`,
            });
            setFile(null);

        } catch (error) {
            console.error('Upload failed', error);
            const errorMessage = error instanceof Error ? error.message : 'There was a problem processing your file.';
            toast({
                variant: 'destructive',
                title: 'Processing Failed',
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };
    reader.onerror = () => {
        setIsLoading(false);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to read the file.' });
    };
    reader.readAsArrayBuffer(fileToProcess);
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select an Excel file to upload.',
      });
      return;
    }
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not Authenticated',
        description: 'You must be logged in to upload data.',
      });
      return;
    }
    setIsLoading(true);
    processAndUploadFile(file);
  };

  return (
    <>
      <h1 className="text-3xl font-headline font-bold">Upload Data</h1>
      <div className="flex justify-center items-start pt-10">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Upload Outstanding Data</CardTitle>
            <CardDescription>Select the month and upload the corresponding Excel file (.xlsx).</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-6">
              <div className="grid gap-2">
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div
                className="relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer border-border hover:border-primary transition-colors"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={handleDrop}
              >
                {!file ? (
                  <>
                    <UploadCloud className="w-12 h-12 text-muted-foreground" />
                    <p className="mt-4 text-sm text-muted-foreground">
                      <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">Excel files (.xlsx) only</p>
                    <input id="file-upload" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={handleFileChange} />
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <File className="w-12 h-12 text-primary" />
                    <p className="mt-2 font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => setFile(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || !file}>
                {isLoading ? 'Uploading...' : 'Upload and Process File'}
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </>
  );
}
