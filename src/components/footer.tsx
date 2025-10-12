'use client';

import { Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import { Logo } from './logo';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/50 bg-card/50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
                <Logo className="h-7 w-7 text-primary" />
                <span className="font-headline text-xl text-foreground">Outstanding Tracker</span>
            </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} vipsukhul. All rights reserved.</p>
          <div className="flex -mx-2">
            <a href="https://www.linkedin.com/in/vipul-sukhdeve-692b29221?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="mx-2 text-muted-foreground transition-colors duration-300 hover:text-primary" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://x.com/Vipul1212k?t=AFpRI5I55_j3QdngFvqzCQ&s=09" target="_blank" rel="noopener noreferrer" className="mx-2 text-muted-foreground transition-colors duration-300 hover:text-primary" aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
