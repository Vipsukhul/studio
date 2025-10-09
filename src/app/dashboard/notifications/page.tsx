
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getNotifications, markNotificationAsRead } from '@/lib/notifications';
import type { Notification } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadNotifications() {
            setLoading(true);
            const userRole = localStorage.getItem('userRole') || '';
            const data = await getNotifications(userRole);
            setNotifications(data);
            setLoading(false);
        }
        loadNotifications();
    }, []);

    const handleNotificationClick = async (notificationId: number) => {
        // Mark as read on the backend (simulated)
        await markNotificationAsRead(notificationId);
        // Update the state locally
        setNotifications(prev => 
            prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        );
    };

    return (
        <>
            <h1 className="text-3xl font-headline font-bold">Notifications</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Your Recent Alerts</CardTitle>
                    <CardDescription>
                        Here are the latest updates and alerts for you.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center h-48">
                            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary"></div>
                        </div>
                    ) : notifications.length > 0 ? (
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
