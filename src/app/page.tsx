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
import { Eye, EyeOff } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  // Redirect if user is already logged in
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'Firebase auth service is not available. Please try again later.',
      });
      return;
    }
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Login Successful',
        description: "Welcome back! Redirecting to your dashboard.",
      });
      // The useEffect will handle the redirect
    } catch (error: any) {
      let errorMessage = 'An unknown error occurred.';
       if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password. Please try again.';
      } else {
        errorMessage = error.message;
      }
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: errorMessage,
      });
      setIsLoading(false);
    }
  };

  // Don't render anything while checking auth state on initial load
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
               <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="pr-10"
                />
                 <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
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
