
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate sending an email
    setTimeout(() => {
        setIsLoading(false);
        setIsSent(true);
        toast({
            title: 'Password Reset Email Sent',
            description: 'Please check your inbox for instructions to reset your password.',
        });
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="flex items-center gap-3 mb-8">
        <Logo className="h-10 w-10 text-primary" />
        <h1 className="text-3xl font-headline font-bold text-foreground">Outstanding Tracker</h1>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Forgot Password</CardTitle>
          <CardDescription>
            {isSent
              ? "You can close this window now."
              : "Enter your email and we'll send you a link to reset your password."}
          </CardDescription>
        </CardHeader>
        {!isSent ? (
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
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </CardFooter>
          </form>
        ) : (
          <CardContent>
            <p className="text-center text-sm text-muted-foreground">
              If you don&apos;t see the email, please check your spam folder.
            </p>
          </CardContent>
        )}
        <CardFooter className="justify-center">
            <Button variant="link" asChild>
                <Link href="/">&larr; Back to Login</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
