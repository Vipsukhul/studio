'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const adminUsers = {
    'vipsukhul@gmail.com': 'Password',
    'supriysukhadeve12@gmail.com': 'Supriy@0310'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      // @ts-ignore
      if (adminUsers[email] && adminUsers[email] === password) {
        toast({
          title: 'Admin Login Successful',
          description: "Welcome, Admin! Redirecting to the admin panel.",
        });
        localStorage.setItem('userRole', 'Admin');
        router.push('/admin');
      } else {
        toast({
          variant: 'destructive',
          title: 'Admin Login Failed',
          description: 'Invalid credentials for an admin account.',
        });
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="flex items-center gap-3 mb-8">
        <Logo className="h-10 w-10 text-primary" />
        <h1 className="text-3xl font-headline font-bold text-foreground">Admin Portal</h1>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Admin Login</CardTitle>
          <CardDescription>Enter your admin credentials to access the portal.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
             <div className="text-center text-sm">
              Not an admin?{' '}
              <Link href="/" className="underline">
                User login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
