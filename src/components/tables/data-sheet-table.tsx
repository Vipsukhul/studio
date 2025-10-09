
'use client';

import * as React from 'react';
import {
  ArrowUpDown,
  ChevronDown,
  Eye,
} from "lucide-react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast";
import { updateCustomerRemark, updateCustomerNotes, updateAssignedEngineer, getEngineersByRegion, updateInvoiceDisputeStatus } from '@/lib/api';

import type { Customer, Invoice, Engineer } from "@/lib/types"

const InvoiceDetails = ({ customer, onInvoiceUpdate, isReadOnly }: { customer: Customer, onInvoiceUpdate: (invoiceNumber: string, newStatus: Invoice['status']) => void, isReadOnly: boolean }) => {
    const { toast } = useToast();

    const handleDisputeChange = async (invoiceNumber: string, newStatus: string) => {
        const status = newStatus === 'dispute' ? 'dispute' : 'unpaid';
        toast({ title: 'Updating invoice...', description: `Setting status for invoice ${invoiceNumber} to ${status}.`});
        try {
            await updateInvoiceDisputeStatus(customer.customerCode, invoiceNumber, status);
            onInvoiceUpdate(invoiceNumber, status);
            toast({ title: 'Success', description: 'Invoice status updated.'});
        } catch(error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to update invoice status.' });
        }
    };
  
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Disputed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customer.invoices?.length ? customer.invoices.map((invoice: Invoice) => (
            <TableRow key={invoice.invoiceNumber}>
              <TableCell>{invoice.invoiceNumber}</TableCell>
              <TableCell>{invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell className="text-right">₹{invoice.invoiceAmount?.toLocaleString('en-IN') || 'N/A'}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>{invoice.status === 'paid' ? 'Paid' : 'Unpaid'}</span>
              </TableCell>
              <TableCell>
                 <Select
                    value={invoice.status === 'dispute' ? 'dispute' : 'not-disputed'}
                    onValueChange={(value) => handleDisputeChange(invoice.invoiceNumber, value)}
                    disabled={isReadOnly}
                 >
                    <SelectTrigger className='w-28'>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="not-disputed">No</SelectItem>
                        <SelectItem value="dispute">Yes</SelectItem>
                    </SelectContent>
                 </Select>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">No invoices found for this customer.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };

export const DataSheetTable = ({ data }: { data: Customer[] }) => {
  const [tableData, setTableData] = React.useState(data);
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  const [userRole, setUserRole] = React.useState<string | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    setTableData(data);
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, [data]);

  const isReadOnly = userRole === 'Engineer';

  const handleRemarkChange = async (customerId: string, newRemark: Customer['remarks']) => {
    toast({ title: 'Updating status...', description: `Setting remark for customer ${customerId} to ${newRemark}.` });
    try {
      await updateCustomerRemark(customerId, newRemark);
      setTableData((prevData) =>
        prevData.map((customer) =>
          customer.customerCode === customerId
            ? { ...customer, remarks: newRemark }
            : customer
        )
      );
      toast({ title: 'Success', description: 'Remark updated successfully.'});
    } catch(error) {
       toast({ variant: 'destructive', title: 'Error', description: 'Failed to update remark.' });
    }
  };

  const handleNotesChange = async (customerId: string, newNotes: string) => {
    try {
      await updateCustomerNotes(customerId, newNotes);
      setTableData((prevData) =>
        prevData.map((customer) =>
          customer.customerCode === customerId
            ? { ...customer, notes: newNotes }
            : customer
        )
      );
      toast({ title: 'Success', description: 'Notes updated.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update notes.' });
    }
  };

  const handleEngineerChange = async (customerId: string, newEngineer: string) => {
    try {
      await updateAssignedEngineer(customerId, newEngineer);
      setTableData((prevData) =>
        prevData.map((customer) =>
          customer.customerCode === customerId ? { ...customer, assignedEngineer: newEngineer } : customer
        )
      );
      toast({ title: "Success", description: "Engineer assigned." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to assign engineer." });
    }
  };
  
    const handleInvoiceUpdate = (invoiceNumber: string, newStatus: Invoice['status']) => {
        if (!selectedCustomer) return;

        const updatedInvoices = selectedCustomer.invoices?.map(inv => 
            inv.invoiceNumber === invoiceNumber ? { ...inv, status: newStatus } : inv
        );

        const updatedCustomer = { ...selectedCustomer, invoices: updatedInvoices };

        setSelectedCustomer(updatedCustomer);

        setTableData(prevData => prevData.map(cust => 
            cust.customerCode === selectedCustomer.customerCode ? updatedCustomer : cust
        ));
    };


  const AssignedToCell = ({ row }: { row: any }) => {
    const customerRegion = row.original.region;
    const [engineers, setEngineers] = React.useState<Engineer[]>([]);

    React.useEffect(() => {
        getEngineersByRegion(customerRegion).then(setEngineers);
    }, [customerRegion]);

    return (
        <Select
            value={row.original.assignedEngineer}
            onValueChange={(value) => handleEngineerChange(row.original.customerCode, value)}
            disabled={isReadOnly}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Assign an engineer" />
            </SelectTrigger>
            <SelectContent>
                {engineers.map((engineer) => (
                    <SelectItem key={engineer.id} value={engineer.name}>
                        {engineer.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "customerCode",
      header: "Customer Code",
    },
    {
      accessorKey: "customerName",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Customer Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "region",
      header: "Region",
    },
    {
      accessorKey: "outstandingAmount",
      header: ({ column }) => (
        <div className="text-right">
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Total Outstanding <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        </div>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("outstandingAmount"))
        if (isNaN(amount)) {
          return <div className="text-right font-medium">N/A</div>
        }
        return <div className="text-right font-medium">₹{amount.toLocaleString('en-IN')}</div>
      },
    },
    {
        id: "remarks",
        accessorKey: "remarks",
        header: "Remarks",
        cell: ({ row }) => (
          <Select
            value={row.original.remarks}
            onValueChange={(value) => handleRemarkChange(row.original.customerCode, value as Customer['remarks'])}
            disabled={isReadOnly}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Set remark" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="payment received">Payment Received</SelectItem>
              <SelectItem value="partial payment">Partial Payment</SelectItem>
              <SelectItem value="under follow-up">Under Follow-up</SelectItem>
              <SelectItem value="dispute">Dispute</SelectItem>
              <SelectItem value="write-off">Write-off</SelectItem>
            </SelectContent>
          </Select>
        )
    },
    {
        accessorKey: "notes",
        header: "Notes",
        cell: ({ row }) => {
            const [notes, setNotes] = React.useState(row.original.notes || '');

            const handleBlur = () => {
                if (notes !== row.original.notes) {
                    handleNotesChange(row.original.customerCode, notes);
                }
            };
            
            const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                handleBlur();
                (e.target as HTMLInputElement).blur();
              }
            }

            return <Input 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="min-w-[200px]"
                readOnly={isReadOnly}
            />;
        }
    },
    {
        accessorKey: "assignedEngineer",
        header: "Assigned To",
        cell: AssignedToCell,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" onClick={() => setSelectedCustomer(row.original)}>
          <Eye className="h-4 w-4" />
          <span className="sr-only">View Invoices</span>
        </Button>
      ),
    },
  ]

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by customer name..."
          value={(table.getColumn("customerName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("customerName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} of{" "}
          {data.length} row(s) shown.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={!!selectedCustomer} onOpenChange={(isOpen) => !isOpen && setSelectedCustomer(null)}>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Invoice Details for {selectedCustomer?.customerName}</DialogTitle>
            <DialogDescription>
              All invoices for customer {selectedCustomer?.customerCode}.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-4">
            {selectedCustomer && <InvoiceDetails customer={selectedCustomer} onInvoiceUpdate={handleInvoiceUpdate} isReadOnly={isReadOnly} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
