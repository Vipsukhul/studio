'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { generateMonthOptions, financialYearOptions } from '@/lib/data';
import { UploadCloud, File, X, CalendarDays } from 'lucide-react';
import { processAndUploadFile } from '@/lib/api';
import { Label } from '@/components/ui/label';

export default function UploadDataPage() {
  const [financialYear, setFinancialYear] = useState('2024-2025');
  const monthOptions = useMemo(() => generateMonthOptions(financialYear), [financialYear]);
  const [month, setMonth] = useState(monthOptions[0].value);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const storedFinancialYear = localStorage.getItem('financialYear');
    if (storedFinancialYear) {
      setFinancialYear(storedFinancialYear);
       const newMonthOptions = generateMonthOptions(storedFinancialYear);
       setMonth(newMonthOptions[0].value);
    }
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select an Excel file to upload.',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await processAndUploadFile(file, month);
      toast({
          title: 'Upload Successful',
          description: `${result.count} records for ${month} were processed. A notification has been sent.`,
      });
      setFile(null);
    } catch (error) {
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

  return (
    <div className="constrained-container">
      <h1 className="text-3xl font-headline font-bold">Upload Data</h1>
      <div className="flex justify-center items-start pt-10">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Upload Outstanding Data</CardTitle>
            <CardDescription>Select the financial year and month, then upload the corresponding Excel file (.xlsx).</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="financialYear">Financial Year</Label>
                  <Select value={financialYear} onValueChange={setFinancialYear}>
                    <SelectTrigger id="financialYear">
                      <CalendarDays className="h-4 w-4 text-muted-foreground mr-2" />
                      <SelectValue placeholder="Select FY" />
                    </SelectTrigger>
                    <SelectContent>
                      {financialYearOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="month">Month</Label>
                  <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger id="month">
                      <CalendarDays className="h-4 w-4 text-muted-foreground mr-2" />
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {monthOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
    </div>
  );
}
