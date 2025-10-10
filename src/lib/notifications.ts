
import type { Notification } from './types';

// In-memory array to store notifications for the current session.
let notifications: Notification[] = [];
let nextId = 1;

/**
 * Creates a new notification and adds it to the in-memory array.
 * @param notificationData - The data for the new notification.
 */
export function createNotification(notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): void {
    const newNotification: Notification = {
        ...notificationData,
        id: (nextId++).toString(),
        timestamp: new Date().toISOString(),
        isRead: false,
    };
    
    notifications.push(newNotification);
    console.log('Created client-side notification:', newNotification);
}

/**
 * Retrieves all notifications from the in-memory array.
 * @returns An array of notifications.
 */
export function getNotifications(): Notification[] {
    return notifications;
}

/**
 * Marks a single notification as read in the in-memory array.
 * @param notificationId The ID of the notification to mark as read.
 */
export function markNotificationAsRead(notificationId: string): { success: boolean } {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.isRead = true;
        console.log('Marked notification as read (client-side):', notificationId);
        return { success: true };
    }
    console.error("Error marking notification as read: Not found.");
    return { success: false };
}
