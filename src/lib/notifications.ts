import type { Notification } from './types';

// In a real app, this would be stored in a database.
// For simulation purposes, we'll use an in-memory array.
let notifications: Notification[] = [
    {
        id: 1,
        from: { name: 'System', role: 'System' },
        to: 'all',
        message: 'Welcome to the new notification system!',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        isRead: false,
    },
    {
        id: 2,
        from: { name: 'Country Manager', role: 'Country Manager' },
        to: 'all',
        message: 'The data sheet for Mar-25 has been updated.',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        isRead: true,
    }
];

let nextId = 3;

/**
 * Creates a new notification and adds it to our in-memory store.
 * @param notificationData - The data for the new notification.
 */
export function createNotification(notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) {
    const newNotification: Notification = {
        ...notificationData,
        id: nextId++,
        timestamp: new Date().toISOString(),
        isRead: false,
    };
    // Add to the beginning of the array
    notifications.unshift(newNotification);
    console.log('Created notification:', newNotification);
}

/**
 * Fetches notifications based on the user's role.
 * @param userRole The role of the user fetching notifications.
 */
export async function getNotifications(userRole: string): Promise<Notification[]> {
    // Simulate network delay
    await new Promise(res => setTimeout(res, 300));
    
    return notifications.filter(notif => {
        if (notif.to === 'all') return true;
        return notif.to === userRole;
    });
}

/**
 * Marks a single notification as read.
 * @param notificationId The ID of the notification to mark as read.
 */
export async function markNotificationAsRead(notificationId: number): Promise<{ success: boolean }> {
    await new Promise(res => setTimeout(res, 100));
    const notifIndex = notifications.findIndex(n => n.id === notificationId);
    if (notifIndex !== -1) {
        notifications[notifIndex].isRead = true;
        return { success: true };
    }
    return { success: false };
}
