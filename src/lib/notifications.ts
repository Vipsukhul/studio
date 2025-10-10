import { collection, addDoc, doc, updateDoc, Firestore } from 'firebase/firestore';
import type { Notification } from './types';


/**
 * Creates a new notification and adds it to our in-memory store.
 * @param notificationData - The data for the new notification.
 */
export async function createNotification(firestore: Firestore, notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) {
    const notificationsCollection = collection(firestore, 'notifications');
    const newNotification = {
        ...notificationData,
        timestamp: new Date().toISOString(),
        isRead: false,
    };
    try {
        await addDoc(notificationsCollection, newNotification);
        console.log('Created notification:', newNotification);
    } catch (error) {
        console.error("Error creating notification:", error);
    }
}

/**
 * Marks a single notification as read.
 * @param notificationId The ID of the notification to mark as read.
 */
export async function markNotificationAsRead(firestore: Firestore, notificationId: string): Promise<{ success: boolean }> {
    const notificationRef = doc(firestore, 'notifications', notificationId);
    try {
        await updateDoc(notificationRef, { isRead: true });
        return { success: true };
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return { success: false };
    }
}
