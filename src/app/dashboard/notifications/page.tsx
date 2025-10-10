
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Notification } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { markNotificationAsRead } from '@/lib/notifications';
import { Button } from '@/components/ui/button';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';

export default function NotificationsPage() {
    const firestore = useFirestore();
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const role = localStorage.getItem('userRole') || '';
        setUserRole(role);
    }, []);

    const notificationsQuery = useMemoFirebase(() => {
        if (!firestore || !userRole) return null;

        return query(
            collection(firestore, 'notifications'),
            where('to', 'in', ['all', userRole]),
            orderBy('timestamp', 'desc')
        );
    }, [firestore, userRole]);

    const { data: notifications, isLoading } = useCollection<Notification>(notificationsQuery);

    const handleNotificationClick = async (notificationId?: string) => {
        if (!notificationId || !firestore) return;
        await markNotificationAsRead(firestore, notificationId);
        // The real-time listener will handle the UI update.
    };

    return (
        <>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-headline font-bold">Notifications</h1>
              {/* Refresh button is no longer needed with real-time updates */}
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Your Recent Alerts</CardTitle>
                    <CardDescription>
                        Here are the latest updates and alerts for you.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center h-48">
                            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary"></div>
                        </div>
                    ) : notifications && notifications.length > 0 ? (
                        <div className="space-y-2">
                            {notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={cn(
                                        "flex items-start gap-4 p-2 rounded-lg cursor-pointer transition-colors border-b",
                                        !notif.isRead ? "bg-card hover:bg-muted/80" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                    )}
                                    onClick={() => handleNotificationClick(notif.id)}
                                >
                                    <Avatar className="h-10 w-10 mt-1">
                                        <AvatarImage src={`https://picsum.photos/seed/${notif.from.name}/40/40`} />
                                        <AvatarFallback>{notif.from.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 grid gap-1">
                                        <p className="font-semibold text-foreground">
                                            {notif.from.name}
                                            <span className="text-xs font-normal text-muted-foreground ml-2">({notif.from.role})</span>
                                        </p>
                                        <p className="text-sm">{notif.message}</p>
                                         <p className="text-xs text-muted-foreground text-right">
                                            {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                                        </p>
                                    </div>
                                    {!notif.isRead && (
                                        <div className="w-2.5 h-2.5 bg-primary rounded-full mt-2 animate-pulse" title="Unread"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>You have no new notifications.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
