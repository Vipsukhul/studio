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
  Users,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { Footer } from '@/components/footer';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { GoToTop } from '@/components/ui/go-to-top';
import { InstallPwaDialog } from '@/components/install-pwa-dialog';


const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/invoice-tracker', label: 'Invoice Tracker', icon: LineChart },
  { href: '/dashboard/data-sheet', label: 'Data Sheet', icon: SheetIcon },
  { href: '/dashboard/team-hierarchy', label: 'Team Hierarchy', icon: Users },
  { href: '/dashboard/upload-data', label: 'Upload Data', icon: Upload, roles: ['Country Manager', 'Admin'] },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [showInstallDialog, setShowInstallDialog] = useState(false);


  useEffect(() => {
    setIsClient(true);
    const role = localStorage.getItem('userRole');
    if (!role) {
      router.replace('/');
    } else {
      setUserRole(role);
    }
  }, [router]);
  
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUrl = localStorage.getItem('profileImageUrl');
      setProfileImageUrl(storedUrl);
       const role = localStorage.getItem('userRole');
      if (role) setUserRole(role);
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

  const handleLogout = () => {
    localStorage.clear();
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.replace('/');
  };

  if (!isClient || !userRole) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
      </div>
    );
  }
  
  const userInitial = 'A';

  return (
    <>
    <div className="flex min-h-screen w-full flex-col">
       <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Logo className="h-6 w-6 text-primary" />
            <span className="sr-only">Outstanding Tracker</span>
          </Link>
           {filteredNavItems.map((item) => (
            <DesktopNavItem key={item.href} {...item} />
          ))}
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Logo className="h-6 w-6 text-primary" />
                <span className="sr-only">Tracker</span>
              </Link>
               {filteredNavItems.map((item) => (
                <MobileNavItem key={item.href} {...item} />
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
           <div className="ml-auto flex-1 sm:flex-initial">
             {/* The department selector was here */}
          </div>
          <ThemeToggle />
          <Link href="/dashboard/notifications">
            <Button variant="ghost" size="icon" className="rounded-full relative">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={profileImageUrl || `https://picsum.photos/seed/${userInitial}/32/32`} />
                  <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/dashboard/settings" passHref>
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
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
      <Footer />
    </div>
    <InstallPwaDialog open={showInstallDialog} onOpenChange={setShowInstallDialog} />
    <GoToTop />
    </>
  );
}

function DesktopNavItem({ href, label }: { href: string; label: string; }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "transition-colors hover:text-foreground",
        isActive ? "text-foreground" : "text-muted-foreground"
      )}
    >
      {label}
    </Link>
  )
}

function MobileNavItem({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) {
  const pathname = usePathname();
  const isActive = pathname === href;
   return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
        isActive && "bg-muted text-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      {label}
    </Link>
  )
}
