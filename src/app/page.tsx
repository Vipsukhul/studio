
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
import { Eye, EyeOff } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { departmentOptions } from '@/lib/data';
import { InstallPwaDialog } from '@/components/install-pwa-dialog';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Batching Plant');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  const [showInstallDialog, setShowInstallDialog] = useState(false);
  
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // We don't need to store token manually. Firebase SDK handles session.
      // We can fetch user details from our Firestore DB if needed, but for now
      // let's just store the department preference.
      
      localStorage.setItem('department', department);
      localStorage.setItem('financialYear', '2024-2025');

      toast({
          title: 'Login Successful',
          description: "Welcome back! You're being redirected to your dashboard.",
      });

      setShowInstallDialog(true);

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleDialogClose = () => {
    setShowInstallDialog(false);
    router.push('/dashboard');
  }

  if (isUserLoading || (!isUserLoading && user)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="flex items-center gap-3 mb-8">
          <Logo className="h-10 w-10 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-foreground">Outstanding Tracker</h1>
        </div>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Login</CardTitle>
            <CardDescription>Enter your credentials below to login. (Hint: engineer@example.com / password)</CardDescription>
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
              <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={department} onValueChange={setDepartment} required>
                      <SelectTrigger id="department" disabled={isLoading}>
                          <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                      <SelectContent>
                          {departmentOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                              </SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
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
      <InstallPwaDialog open={showInstallDialog} onOpenChange={handleDialogClose} />
    </>
  );
}
