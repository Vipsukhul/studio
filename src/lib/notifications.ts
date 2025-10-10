import { addDoc, collection, doc, updateDoc, Firestore } from 'firebase/firestore';
import type { Notification } from './types';

/**
 * Creates a new notification and adds it to the Firestore database.
 * @param firestore - The Firestore instance.
 * @param notificationData - The data for the new notification.
 */
export async function createNotification(firestore: Firestore, notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): Promise<void> {
    const newNotification = {
        ...notificationData,
        timestamp: new Date().toISOString(),
        isRead: false,
    };
    
    try {
        const notificationsCollection = collection(firestore, 'notifications');
        await addDoc(notificationsCollection, newNotification);
        console.log('Created notification in Firestore:', newNotification);
    } catch (error) {
        console.error("Error creating notification in Firestore:", error);
    }
}

/**
 * Marks a single notification as read in the Firestore database.
 * @param firestore - The Firestore instance.
 * @param notificationId The ID of the notification to mark as read.
 */
export async function markNotificationAsRead(firestore: Firestore, notificationId: string): Promise<{ success: boolean }> {
    try {
        const notificationRef = doc(firestore, 'notifications', notificationId);
        await updateDoc(notificationRef, { isRead: true });
        console.log('Marked notification as read in Firestore:', notificationId);
        return { success: true };
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return { success: false };
    }
}
