'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  Home,
  LineChart,
  LogOut,
  Menu,
  Settings,
  Sheet as SheetIcon,
  Upload,
  Bell,
  Download,
  Users,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { Footer } from '@/components/footer';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { InstallPwaDialog } from '@/components/install-pwa-dialog';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { GoToTop } from '@/components/ui/go-to-top';
import { Toaster } from '@/components/ui/toaster';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/invoice-tracker', label: 'Invoice Tracker', icon: LineChart },
  { href: '/data-sheet', label: 'Data Sheet', icon: SheetIcon },
  { href: '/team-hierarchy', label: 'Team Hierarchy', icon: Users },
  { href: '/upload-data', label: 'Upload Data', icon: Upload, roles: ['Country Manager', 'Admin'] },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toast } = useToast();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [showInstallDialog, setShowInstallDialog] = useState(false);
  const [userRole, setUserRole] = useState('Country Manager'); // Mock role

  useEffect(() => {
    // In a real app, you'd fetch this. For now, we mock it.
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setUserRole(storedRole);
    }

    const handleStorageChange = () => {
      const storedUrl = localStorage.getItem('profileImageUrl');
      setProfileImageUrl(storedUrl);
    };
    
    handleStorageChange();

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(userRole || '');
  });

  const handleLogout = async () => {
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    // In a real app, you'd redirect to a login page.
    // Here we can just show a toast.
  };

  return (
     <html lang="en" suppressHydrationWarning>
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <div className="hidden border-r bg-sidebar md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                  <Logo className="h-6 w-6 text-sidebar-primary" />
                  <span className="font-headline text-sidebar-foreground">Outstanding Tracker</span>
                </Link>
              </div>
              <div className="flex-1">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                  {filteredNavItems.map((item) => (
                    <NavItem key={item.href} {...item} />
                  ))}
                </nav>
              </div>
              <div className="mt-auto p-4">
                {/* Future content like a card can go here */}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col bg-sidebar">
                 <SheetHeader>
                    <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                    <SheetDescription className="sr-only">A list of links to navigate the application.</SheetDescription>
                     <Link href="/" className="flex items-center gap-2 text-lg font-semibold mb-4">
                      <Logo className="h-6 w-6 text-sidebar-primary" />
                      <span className="font-headline text-sidebar-foreground">Tracker</span>
                    </Link>
                  </SheetHeader>
                  <nav className="grid gap-2 text-lg font-medium">
                    {filteredNavItems.map((item) => (
                      <NavItem key={item.href} {...item} mobile />
                    ))}
                      <button onClick={() => setShowInstallDialog(true)} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all hover:text-sidebar-accent-foreground hover:bg-sidebar-accent", "text-lg")}>
                        <Download className="h-4 w-4" />
                        Install App
                    </button>
                  </nav>
                </SheetContent>
              </Sheet>
              <div className="w-full flex-1">
                 {/* The department selector was here */}
              </div>
               <ThemeToggle />
               <Link href="/notifications">
                <Button variant="ghost" size="icon" className="rounded-full relative">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="rounded-full">
                    <Avatar>
                      <AvatarImage src={profileImageUrl || `https://picsum.photos/seed/user/32/32`} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/settings" passHref>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
              {children}
            </main>
            <Footer />
          </div>
        </div>
        <InstallPwaDialog open={showInstallDialog} onOpenChange={setShowInstallDialog} />
        <GoToTop />
        <Toaster />
      </ThemeProvider>
      </body>
    </html>
  );
}

function NavItem({ href, label, icon: Icon, mobile = false }: { href: string; label: string; icon: React.ElementType; mobile?: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const linkClasses = cn(
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all hover:text-sidebar-accent-foreground hover:bg-sidebar-accent",
    isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
    mobile && "text-lg"
  );
  return (
    <Link href={href} className={linkClasses}>
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
