
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, PlusCircle, Shield, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const initialAdmins = [
  {
    name: 'Vipul Sukhul',
    email: 'vipsukhul@gmail.com',
    permissionLevel: 'Full Control',
    lastLogin: '2024-07-30',
    initials: 'VS',
    isDefault: true,
  },
  {
    name: 'Supriy Sukhadeve',
    email: 'supriysukhadeve12@gmail.com',
    permissionLevel: 'Full Control',
    lastLogin: '2024-07-29',
    initials: 'SS',
    isDefault: true,
  },
   {
    name: 'Admin User',
    email: 'admin.user@example.com',
    permissionLevel: 'Read-Only',
    lastLogin: '2024-07-28',
    initials: 'AU',
    isDefault: false,
  },
];

type AdminUser = typeof initialAdmins[0];

function AddAdminDialog({ onAddAdmin }: { onAddAdmin: (user: AdminUser) => void }) {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const { toast } = useToast();

    const handleAddAdmin = () => {
        if (!name || !email || !password) {
            toast({
                variant: 'destructive',
                title: 'Missing Fields',
                description: 'Please fill out all fields to add a new admin.',
            });
            return;
        }
        const newAdmin: AdminUser = {
            name,
            email,
            permissionLevel: 'Read-Only',
            lastLogin: new Date().toISOString().split('T')[0],
            initials: name.split(' ').map(n => n[0]).join(''),
            isDefault: false,
        };
        onAddAdmin(newAdmin);
        toast({
            title: 'Admin Added',
            description: `${name} has been added to the system.`,
        });
        setOpen(false);
        // Reset form
        setName('');
        setEmail('');
        setPassword('');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Admin
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Admin</DialogTitle>
                    <DialogDescription>
                        Enter the details for the new administrator account.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">Password</Label>
                        <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleAddAdmin}>Create Admin</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function AdminManagementPortalPage() {
    const [admins, setAdmins] = React.useState(initialAdmins);
    const { toast } = useToast();

    const handleAddAdmin = (newAdmin: AdminUser) => {
        setAdmins(prevAdmins => [newAdmin, ...prevAdmins]);
    };

    const handleDeleteAdmin = (adminEmail: string) => {
        const adminToDelete = admins.find(admin => admin.email === adminEmail);
        if (adminToDelete?.isDefault) {
            toast({
                variant: 'destructive',
                title: 'Action Forbidden',
                description: 'Default administrators cannot be deleted.',
            });
            return;
        }
        setAdmins(admins.filter(admin => admin.email !== adminEmail));
        toast({
            title: 'Admin Deleted',
            description: `The admin with email ${adminEmail} has been deleted.`,
        });
    };
    
    const handlePermissionChange = (adminEmail: string, newPermission: string) => {
        setAdmins(admins.map(admin => 
            admin.email === adminEmail ? { ...admin, permissionLevel: newPermission } : admin
        ));
         toast({
            title: 'Permissions Updated',
            description: `Permissions for ${adminEmail} have been updated.`,
        });
    }

  return (
    <>
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-headline font-bold">Admin Management</h1>
            <AddAdminDialog onAddAdmin={handleAddAdmin} />
        </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Administrator Accounts
          </CardTitle>
          <CardDescription>
            Manage permissions and access for all administrators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Admin</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {admins.map(admin => (
                    <TableRow key={admin.email}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={`https://picsum.photos/seed/${admin.initials}/32/32`} />
                                    <AvatarFallback>{admin.initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium flex items-center gap-2">
                                        {admin.name} 
                                        {admin.isDefault && <Badge variant="secondary"><Shield className="h-3 w-3 mr-1"/>Default</Badge>}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{admin.email}</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                             <Select 
                                value={admin.permissionLevel} 
                                onValueChange={(value) => handlePermissionChange(admin.email, value)}
                                disabled={admin.isDefault}
                             >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select permission" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Full Control">Full Control</SelectItem>
                                    <SelectItem value="Billing">Billing</SelectItem>
                                    <SelectItem value="Read-Only">Read-Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell>{new Date(admin.lastLogin).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                             <AlertDialog>
                                 <DropdownMenu>
                                     <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" disabled={admin.isDefault}>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                     </DropdownMenuTrigger>
                                     <DropdownMenuContent>
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem className="text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete Admin
                                            </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                     </DropdownMenuContent>
                                 </DropdownMenu>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete this admin
                                        account from the system.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteAdmin(admin.email)}>
                                        Delete
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
