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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  Home,
  LineChart,
  LogOut,
  Menu,
  Sheet as SheetIcon,
  Upload,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { Footer } from '@/components/footer';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useUser } from '@/firebase';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/invoice-tracker', label: 'Invoice Tracker', icon: LineChart },
  { href: '/dashboard/data-sheet', label: 'Data Sheet', icon: SheetIcon },
  { href: '/dashboard/upload-data', label: 'Upload Data', icon: Upload },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  if (!user) {
    router.replace('/');
    return null; // or a loading spinner
  }

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.replace('/');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'There was a problem logging you out.',
      });
    }
  };

  const userInitial = user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-sidebar md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Logo className="h-6 w-6 text-sidebar-primary" />
              <span className="font-headline text-sidebar-foreground">Outstanding Tracker</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map((item) => (
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
              <nav className="grid gap-2 text-lg font-medium">
                <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <Logo className="h-6 w-6 text-sidebar-primary" />
                  <span className="font-headline text-sidebar-foreground">Tracker</span>
                </Link>
                {navItems.map((item) => (
                  <NavItem key={item.href} {...item} mobile />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Can add a global search here */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/32/32`} />
                  <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.displayName || user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
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
