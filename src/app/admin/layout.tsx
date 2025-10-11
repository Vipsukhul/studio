
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
  FileText,
  Home,
  LogOut,
  Menu,
  PanelLeft,
  ShieldCheck,
  Users,
  Webhook,
  LayoutDashboard,
  TrendingUp,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { Footer } from '@/components/footer';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { InstallPwaDialog } from '@/components/install-pwa-dialog';
import { ThemeToggle } from '@/components/theme-toggle';
import { GoToTop } from '@/components/ui/go-to-top';

const navItems = [
  { href: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'User Management', icon: Users },
  { href: '/admin/management', label: 'Admin Management', icon: ShieldCheck },
  { href: '/admin/api', label: 'API Management', icon: Webhook },
  { href: '/admin/logs', label: 'Logs', icon: FileText },
  { href: '/admin/engineer-performance', label: 'Engineer Performance', icon: TrendingUp },
  { href: '/', label: 'Back to App', icon: PanelLeft },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [showInstallDialog, setShowInstallDialog] = useState(false);


  const handleLogout = async () => {
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.replace('/admin/login');
  };

  const userInitial = 'A';

  return (
    <>
    <div className="flex min-h-screen w-full flex-col">
       <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-headline">Admin Panel</span>
          </Link>
          {navItems.map((item) => (
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
                href="/admin"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Logo className="h-6 w-6 text-primary" />
                <span className="font-headline">Admin</span>
              </Link>
              {navItems.map((item) => (
                <MobileNavItem key={item.href} {...item} />
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial">
             <h1 className="text-xl font-semibold hidden md:block">Admin</h1>
          </div>
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={`https://picsum.photos/seed/admin/32/32`} />
                  <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
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
  const isActive = pathname.startsWith(href) && (href !== '/admin' || pathname === '/admin');
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
  const isActive = pathname.startsWith(href) && (href !== '/admin' || pathname === '/admin');
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
