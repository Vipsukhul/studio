import type { Notification } from './types';

// In-memory store for notifications for the current session.
let notifications: Notification[] = [
    {
        id: '1',
        from: { name: 'System', role: 'System' },
        to: 'all',
        message: 'Welcome to the Outstanding Tracker! This is a mock notification.',
        timestamp: new Date().toISOString(),
        isRead: false,
    }
];

let nextId = 2;

/**
 * Creates a new notification and adds it to our in-memory store.
 * @param notificationData - The data for the new notification.
 */
export function createNotification(notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) {
    const newNotification: Notification = {
        ...notificationData,
        id: (nextId++).toString(),
        timestamp: new Date().toISOString(),
        isRead: false,
    };
    notifications.unshift(newNotification); // Add to the beginning of the array
    console.log('Created notification (client-side):', newNotification);
}

/**
 * Retrieves all notifications relevant to the user role.
 * @param userRole The role of the current user.
 */
export function getNotifications(userRole: string): Notification[] {
    console.log('Fetching notifications (client-side) for role:', userRole);
    return notifications.filter(n => n.to === 'all' || n.to === userRole);
}

/**
 * Marks a single notification as read in the in-memory store.
 * @param notificationId The ID of the notification to mark as read.
 */
export function markNotificationAsRead(notificationId: string): { success: boolean } {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.isRead = true;
        console.log('Marked notification as read (client-side):', notificationId);
        return { success: true };
    }
    return { success: false };
}
