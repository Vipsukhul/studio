'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';
import { useAuth, useUser, initiateEmailSignIn } from '@/firebase';
import { onAuthStateChanged, AuthError } from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);
  
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            setIsLoading(false);
            toast({
                title: 'Login Successful',
                description: "Welcome back! You're being redirected to your dashboard.",
            });
        }
    }, (error) => {
        setIsLoading(false);
        let description = 'An unexpected error occurred. Please try again.';
        if (error instanceof Error && (error as AuthError).code) {
          switch ((error as AuthError).code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
              description = 'Invalid email or password. Please check your credentials or sign up.';
              break;
            case 'auth/invalid-email':
              description = 'The email address is not valid.';
              break;
            default:
              description = 'Please check your email and password and try again.';
              break;
          }
        }
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: description,
        });
    });

    return () => unsubscribe();
  }, [auth, toast]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
        toast({ variant: 'destructive', title: 'Error', description: 'Authentication service not available.' });
        return;
    }
    setIsLoading(true);
    initiateEmailSignIn(auth, email, password);
  };

  if (isUserLoading || user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="flex items-center gap-3 mb-8">
        <Logo className="h-10 w-10 text-primary" />
        <h1 className="text-3xl font-headline font-bold text-foreground">Outstanding Tracker</h1>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
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
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
