'use client';

import { Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import { Logo } from './logo';

interface NavItem {
  href: string;
  label: string;
}

interface FooterProps {
  navItems: NavItem[];
}

export function Footer({ navItems }: FooterProps) {
  const linkColumns = [
    navItems.slice(0, Math.ceil(navItems.length / 2)),
    navItems.slice(Math.ceil(navItems.length / 2))
  ];

  return (
    <footer className="mt-auto border-t border-border/50 bg-card/50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <h1 className="max-w-lg text-xl font-semibold tracking-tight text-foreground xl:text-2xl">
              Stay on top of your outstanding invoices.
            </h1>
            <div className="mt-6 flex flex-col items-start space-y-3">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <Logo className="h-7 w-7 text-primary" />
                <span className="font-headline text-xl text-foreground">Outstanding Tracker</span>
              </Link>
            </div>
          </div>
          {linkColumns[0].length > 0 && (
            <div>
              <p className="font-semibold text-foreground">Quick Links</p>
              <div className="mt-5 flex flex-col items-start space-y-2">
                {linkColumns[0].map(item => (
                   <Link key={item.href} href={item.href} className="text-muted-foreground transition-colors duration-300 hover:text-primary hover:underline">{item.label}</Link>
                ))}
              </div>
            </div>
          )}
           {linkColumns[1].length > 0 && (
              <div>
                 <p className="font-semibold text-foreground opacity-0 hidden sm:block">More Links</p>
                <div className="mt-5 flex flex-col items-start space-y-2 sm:mt-11">
                  {linkColumns[1].map(item => (
                     <Link key={item.href} href={item.href} className="text-muted-foreground transition-colors duration-300 hover:text-primary hover:underline">{item.label}</Link>
                  ))}
                </div>
              </div>
           )}
        </div>
        
        <hr className="my-6 border-muted-foreground/20 md:my-8" />
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} vipsukhul. All rights reserved.</p>
          <div className="flex -mx-2">
            <a href="#" className="mx-2 text-muted-foreground transition-colors duration-300 hover:text-primary" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" className="mx-2 text-muted-foreground transition-colors duration-300 hover:text-primary" aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
