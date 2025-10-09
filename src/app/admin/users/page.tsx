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
import { MoreHorizontal } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";


const initialUsers = [
  {
    name: 'Vipul Sukhul',
    email: 'vipsukhul@gmail.com',
    role: 'Admin',
    region: 'North',
    status: 'Active',
    lastLogin: '2024-07-29',
    initials: 'VS',
  },
  {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'Engineer',
    region: 'West',
    status: 'Active',
    lastLogin: '2024-07-28',
    initials: 'JD',
  },
  {
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Engineer',
    region: 'South',
    status: 'Inactive',
    lastLogin: '2024-06-15',
    initials: 'JS',
  },
   {
    name: 'S. Iyer',
    email: 's.iyer@example.com',
    role: 'Engineer',
    region: 'South',
    status: 'Active',
    lastLogin: '2024-07-29',
    initials: 'SI',
  },
];

type User = typeof initialUsers[0];

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

  return (
    <>
      <h1 className="text-3xl font-headline font-bold">User Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Role</TableHead>
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
                  <TableCell>{user.region}</TableCell>
                  <TableCell>{user.role}</TableCell>
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
