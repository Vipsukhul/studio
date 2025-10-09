'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DownloadCloud } from "lucide-react";
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
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center justify-center mb-4">
                        <div className="p-4 bg-primary/10 rounded-full">
                           <DownloadCloud className="w-10 h-10 text-primary" />
                        </div>
                    </div>
                    <AlertDialogTitle className="text-center text-2xl font-headline">Install Outstanding Tracker</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        For a better experience, install the app on your device. It's fast, works offline, and is always up-to-date.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-center">
                    <AlertDialogCancel>Not Now</AlertDialogCancel>
                    <AlertDialogAction onClick={handleInstallClick}>Install App</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
