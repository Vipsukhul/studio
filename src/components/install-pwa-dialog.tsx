
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DownloadCloud, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InstallPwaDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function InstallPwaDialog({ open, onOpenChange }: InstallPwaDialogProps) {
    const { toast } = useToast();

    const handleInstallClick = () => {
        // In a real PWA, you would trigger the beforeinstallprompt event here.
        // For now, we'll just show a toast.
        toast({
            title: 'Installation Requested',
            description: "Follow your browser's instructions to install the app.",
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="top-0 translate-y-0 sm:top-4 sm:translate-y-0 rounded-b-lg">
                 <DialogHeader>
                    <div className="flex items-center justify-center mb-4">
                        <div className="p-4 bg-primary/10 rounded-full">
                           <DownloadCloud className="w-10 h-10 text-primary" />
                        </div>
                    </div>
                    <DialogTitle className="text-center text-2xl font-headline">Install Outstanding Tracker</DialogTitle>
                    <DialogDescription className="text-center">
                        For a better experience, install the app on your device. It's fast, works offline, and is always up-to-date.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-center">
                    <Button onClick={handleInstallClick}>Install App</Button>
                </DialogFooter>
                 <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}
