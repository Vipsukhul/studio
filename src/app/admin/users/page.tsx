
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { regionOptions } from '@/lib/data';


const initialUsers = [
  {
    name: 'Vipul Sukhul',
    email: 'vipsukhul@gmail.com',
    role: 'Admin',
    region: 'mumbai',
    status: 'Active',
    lastLogin: '2024-07-29',
    initials: 'VS',
    password: 'Password',
  },
  {
    name: 'Supriy Sukhadeve',
    email: 'supriysukhadeve12@gmail.com',
    role: 'Admin',
    region: 'pune',
    status: 'Active',
    lastLogin: '2024-07-29',
    initials: 'SS',
    password: 'Supriy@0310',
  },
  {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'Engineer',
    region: 'banglore',
    status: 'Active',
    lastLogin: '2024-07-28',
    initials: 'JD',
    password: 'password',
  },
  {
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Engineer',
    region: 'chennai',
    status: 'Inactive',
    lastLogin: '2024-06-15',
    initials: 'JS',
    password: 'password',
  },
   {
    name: 'S. Iyer',
    email: 's.iyer@example.com',
    role: 'Engineer',
    region: 'chennai',
    status: 'Active',
    lastLogin: '2024-07-29',
    initials: 'SI',
    password: 'password',
  },
];

const roleOptions = ['Admin', 'Country Manager', 'Manager', 'Engineer'];

type User = typeof initialUsers[0];

function AddUserDialog({ onAddUser, children }: { onAddUser: (user: User) => void, children: React.ReactNode }) {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [role, setRole] = React.useState('');
    const [region, setRegion] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const { toast } = useToast();

    const handleAddUser = () => {
        if (!name || !email || !role || !region) {
            toast({
                variant: 'destructive',
                title: 'Missing Fields',
                description: 'Please fill out all fields to add a new user.',
            });
            return;
        }
        const newUser: User = {
            name,
            email,
            role,
            region,
            status: 'Active',
            lastLogin: new Date().toISOString().split('T')[0],
            initials: name.split(' ').map(n => n[0]).join(''),
            password: 'password',
        };
        onAddUser(newUser);
        toast({
            title: 'User Added',
            description: `${name} has been added to the system.`,
        });
        setOpen(false);
        // Reset form
        setName('');
        setEmail('');
        setRole('');
        setRegion('');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                        Enter the details below to create a new user account.
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
                        <Label htmlFor="role" className="text-right">Role</Label>
                         <Select value={role} onValueChange={setRole}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roleOptions.map(option => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="region" className="text-right">Region</Label>
                        <Select value={region} onValueChange={setRegion}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a region" />
                            </SelectTrigger>
                            <SelectContent>
                                {regionOptions.filter(r => r.value !== 'All').map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleAddUser}>Add User</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function UserManagementPage() {
    const [users, setUsers] = React.useState(initialUsers);
    const { toast } = useToast();

    const handleViewDetails = (user: User) => {
        toast({
            title: 'View Details',
            description: `Viewing details for ${user.name}. (Functionality to be implemented)`,
        });
    };

    const handleEditUser = (user: User) => {
        toast({
            title: 'Edit User',
            description: `Editing user ${user.name}. (Functionality to be implemented)`,
        });
    };

    const handleDeleteUser = (userEmail: string) => {
        setUsers(users.filter(user => user.email !== userEmail));
        toast({
            title: 'User Deleted',
            description: `The user with email ${userEmail} has been deleted.`,
        });
    };
    
    const handleAddUser = (newUser: User) => {
        setUsers(prevUsers => [newUser, ...prevUsers]);
    };

    const handleRoleChange = (email: string, newRole: string) => {
        setUsers(users.map(user => 
            user.email === email ? { ...user, role: newRole } : user
        ));
         toast({
            title: 'Permissions Updated',
            description: `Role for ${email} has been updated to ${newRole}.`,
        });
    };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold">User Management</h1>
        <AddUserDialog onAddUser={handleAddUser}>
             <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add User
            </Button>
        </AddUserDialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all users in the system including their assigned permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.email}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={`https://picsum.photos/seed/${user.initials}/32/32`} />
                            <AvatarFallback>{user.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{user.region}</TableCell>
                  <TableCell>
                     <Select value={user.role} onValueChange={(value) => handleRoleChange(user.email, value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            {roleOptions.map(option => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>{user.status}</Badge>
                  </TableCell>
                  <TableCell>{new Date(user.lastLogin).toLocaleDateString()}</TableCell>
                   <TableCell className="text-right">
                      <AlertDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(user)}>View Details</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>Edit User</DropdownMenuItem>
                               <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive">Delete User</DropdownMenuItem>
                               </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the user
                                account and remove their data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteUser(user.email)}>
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
