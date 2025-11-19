// src/utils/notification.utils.optimized.ts
import * as Notifications from 'expo-notifications';
import { Timestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ========================================
// 🔔 Optimized Notification Scheduler
// ========================================

interface PendingNotification {
  id: string;
  title: string;
  targetTime: number;
  type: 'task' | 'event';
}

const STORAGE_KEY = 'pending_notifications';
const activeTimeouts = new Map<string, NodeJS.Timeout>();

// Load pending notifications on app start
const loadPendingNotifications = async (): Promise<Map<string, PendingNotification>> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      const notifications: PendingNotification[] = JSON.parse(stored);
      const map = new Map<string, PendingNotification>();
      
      // Filter out expired notifications
      const now = Date.now();
      notifications.forEach(notification => {
        if (notification.targetTime > now) {
          map.set(notification.id, notification);
        }
      });
      
      return map;
    }
  } catch (error) {
    if (__DEV__) console.error('Failed to load pending notifications:', error);
  }
  return new Map();
};

// Save pending notifications to storage
const savePendingNotifications = async (notifications: Map<string, PendingNotification>) => {
  try {
    const array = Array.from(notifications.values());
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(array));
  } catch (error) {
    if (__DEV__) console.error('Failed to save pending notifications:', error);
  }
};

// Initialize notification scheduler
let pendingNotifications = new Map<string, PendingNotification>();
loadPendingNotifications().then(map => {
  pendingNotifications = map;
  // Reschedule notifications
  map.forEach(notification => {
    scheduleNotificationTimeout(notification);
  });
});

// Schedule a notification with timeout
const scheduleNotificationTimeout = (notification: PendingNotification) => {
  const now = Date.now();
  const delayMs = notification.targetTime - now;
  
  if (delayMs <= 0) return;
  
  // Clear existing timeout for this ID
  const existingTimeout = activeTimeouts.get(notification.id);
  if (existingTimeout) {
    clearTimeout(existingTimeout);
  }
  
  // Schedule new notification
  const timeoutId = setTimeout(async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.type === 'task' ? 'Task Due Soon' : 'Event Starting Soon',
          body: `${notification.title} starts in 1 hour`,
          data: { 
            [notification.type === 'task' ? 'taskId' : 'eventId']: notification.id,
            type: notification.type === 'task' ? 'task_due' : 'event_soon'
          },
        },
        trigger: null, // Fire immediately
      });
      
      // Remove from pending after sending
      pendingNotifications.delete(notification.id);
      activeTimeouts.delete(notification.id);
      await savePendingNotifications(pendingNotifications);
      
      if (__DEV__) console.log(`Sent ${notification.type} notification for ${notification.title}`);
    } catch (error) {
      if (__DEV__) console.error('Failed to send notification:', error);
    }
  }, delayMs);
  
  activeTimeouts.set(notification.id, timeoutId);
};

// ========================================
// 🔔 Main Scheduling Functions
// ========================================

export const scheduleTaskReminder = async (
  taskId: string,
  title: string,
  dueAt: Timestamp
) => {
  try {
    const reminderTime = new Date(dueAt.toDate().getTime() - 3600 * 1000);
    const now = new Date();
    
    if (reminderTime <= now) {
      if (__DEV__) console.log('Task reminder time is in the past, skipping');
      return;
    }
    
    const notification: PendingNotification = {
      id: taskId,
      title,
      targetTime: reminderTime.getTime(),
      type: 'task'
    };
    
    pendingNotifications.set(taskId, notification);
    await savePendingNotifications(pendingNotifications);
    scheduleNotificationTimeout(notification);
    
    if (__DEV__) console.log(`Scheduled task reminder for ${reminderTime}`);
  } catch (error) {
    if (__DEV__) console.error('Failed to schedule task reminder:', error);
  }
};

export const scheduleEventReminder = async (
  eventId: string,
  title: string,
  startsAt: Timestamp
) => {
  try {
    const reminderTime = new Date(startsAt.toDate().getTime() - 3600 * 1000);
    const now = new Date();
    
    if (reminderTime <= now) {
      if (__DEV__) console.log('Event reminder time is in the past, skipping');
      return;
    }
    
    const notification: PendingNotification = {
      id: eventId,
      title,
      targetTime: reminderTime.getTime(),
      type: 'event'
    };
    
    pendingNotifications.set(eventId, notification);
    await savePendingNotifications(pendingNotifications);
    scheduleNotificationTimeout(notification);
    
    if (__DEV__) console.log(`Scheduled event reminder for ${reminderTime}`);
  } catch (error) {
    if (__DEV__) console.error('Failed to schedule event reminder:', error);
  }
};

// ========================================
// ❌ Cancel Notifications
// ========================================

export const cancelTaskReminder = async (taskId: string) => {
  const timeoutId = activeTimeouts.get(taskId);
  if (timeoutId) {
    clearTimeout(timeoutId);
    activeTimeouts.delete(taskId);
  }
  
  pendingNotifications.delete(taskId);
  await savePendingNotifications(pendingNotifications);
  
  if (__DEV__) console.log(`Cancelled task reminder for ${taskId}`);
};

export const cancelEventReminder = async (eventId: string) => {
  const timeoutId = activeTimeouts.get(eventId);
  if (timeoutId) {
    clearTimeout(timeoutId);
    activeTimeouts.delete(eventId);
  }
  
  pendingNotifications.delete(eventId);
  await savePendingNotifications(pendingNotifications);
  
  if (__DEV__) console.log(`Cancelled event reminder for ${eventId}`);
};

// Cancel all notifications
export const cancelAllNotifications = async () => {
  // Clear all active timeouts
  activeTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
  activeTimeouts.clear();
  
  // Clear pending notifications
  pendingNotifications.clear();
  await savePendingNotifications(pendingNotifications);
  
  // Cancel scheduled expo notifications
  await Notifications.cancelAllScheduledNotificationsAsync();
  
  if (__DEV__) console.log('Cancelled all notifications');
};

// Get pending notifications count
export const getPendingNotificationsCount = (): number => {
  return pendingNotifications.size;
};
