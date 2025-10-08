
'use client';

import * as React from 'react';
import {
  ArrowUpDown,
  ChevronDown,
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
import { updateCustomerRemark } from '@/lib/api';

import type { Customer, Invoice } from "@/lib/types"

const InvoiceDetails = ({ customer }: { customer: Customer }) => {
    
    const invoices = customer.invoices || [];
  
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices?.length ? invoices.map((invoice: Invoice, index: number) => (
            <TableRow key={invoice.invoiceNumber + index}>
              <TableCell>{invoice.invoiceNumber}</TableCell>
              <TableCell>{invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell className="text-right">₹{invoice.invoiceAmount?.toLocaleString('en-IN') || 'N/A'}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'dispute' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>{invoice.status || 'unpaid'}</span>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">No invoices found for this customer.</TableCell>
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
  const { toast } = useToast();

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
    },
    {
        accessorKey: "assignedEngineer",
        header: "Assigned To",
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
                  onClick={() => setSelectedCustomer(row.original)}
                  className="cursor-pointer"
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
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Invoice Details for {selectedCustomer?.customerName}</DialogTitle>
            <DialogDescription>
              All invoices for customer {selectedCustomer?.customerCode}.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-4">
            {selectedCustomer && <InvoiceDetails customer={selectedCustomer} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
