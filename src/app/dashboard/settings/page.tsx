'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { regionOptions } from '@/lib/data';
import { Eye, EyeOff, UploadCloud } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { uploadImageToCloudinary } from '@/lib/api';


export default function SettingsPage() {
  const [name, setName] = useState('Current User');
  const [email, setEmail] = useState('test@example.com');
  const [region, setRegion] = useState('North');
  const [role, setRole] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(`https://picsum.photos/seed/user/128/128`);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setIsLoading(true);
      try {
        const imageUrl = await uploadImageToCloudinary(file);
        setProfileImageUrl(imageUrl);
        // Persist this URL to your backend for the user
        localStorage.setItem('profileImageUrl', imageUrl);
        toast({
          title: 'Image Uploaded',
          description: 'Your new profile picture has been set.',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: 'Could not upload the image. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.jpg'] },
    multiple: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate updating user profile
    setTimeout(() => {
      toast({
        title: 'Profile Updated',
        description: "Your account information has been successfully updated.",
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      <h1 className="text-3xl font-headline font-bold">Settings</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>Update your personal information and profile picture.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-6 max-w-lg">
                <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={profileImageUrl || ''} />
                        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div {...getRootProps()} className="w-full flex items-center justify-center border-2 border-dashed rounded-md p-6 cursor-pointer hover:border-primary transition-colors">
                        <input {...getInputProps()} />
                        <div className="text-center">
                            <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground" />
                            {isDragActive ? (
                                <p className="mt-2 text-sm text-primary">Drop the image here...</p>
                            ) : (
                                <p className="mt-2 text-sm text-muted-foreground">
                                    <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={role}
                    readOnly
                    disabled
                    className="bg-muted"
                  />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="region">Region</Label>
                <Select value={region} onValueChange={setRegion} required>
                  <SelectTrigger id="region" disabled={isLoading}>
                    <SelectValue placeholder="Select your region" />
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your login password.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 max-w-lg">
             <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input id="current-password" type={showCurrentPassword ? 'text' : 'password'} disabled={isLoading} className="pr-10" />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                  >
                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
               <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input id="new-password" type={showNewPassword ? 'text' : 'password'} disabled={isLoading} className="pr-10" />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
               <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input id="confirm-password" type={showConfirmPassword ? 'text' : 'password'} disabled={isLoading} className="pr-10" />
                   <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <Button type="button" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
