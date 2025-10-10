
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Notification } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { getNotifications, markNotificationAsRead } from '@/lib/notifications';
import { Button } from '@/components/ui/button';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching data for consistent UX
        setLoading(true);
        const data = getNotifications();
        setNotifications(data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        setLoading(false);
    }, []);

    const handleNotificationClick = (notificationId?: string) => {
        if (!notificationId) return;
        markNotificationAsRead(notificationId);
        // Re-fetch and re-render to show the "read" state
        const updatedNotifications = getNotifications().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setNotifications(updatedNotifications);
    };

    const handleRefresh = () => {
        setLoading(true);
        const data = getNotifications();
        setNotifications(data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        setLoading(false);
    }

    return (
        <>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-headline font-bold">Notifications</h1>
              <Button onClick={handleRefresh} variant="outline">Refresh</Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Your Recent Alerts</CardTitle>
                    <CardDescription>
                        Here are the latest updates and alerts for you. These will clear when you refresh the page.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
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
