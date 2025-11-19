// src/utils/notification.utils.ts

import * as Notifications from 'expo-notifications';
import { Timestamp } from 'firebase/firestore';

// ============================================================
// 🔔 Schedule Task Reminder
// ============================================================
export const scheduleTaskReminder = async (
  taskId: string,
  title: string,
  dueAt: Timestamp
) => {
  try {
    const reminderTime = new Date(dueAt.toDate().getTime() - 3600 * 1000);
    const now = new Date();

    if (reminderTime > now) {
      const delayMs = reminderTime.getTime() - now.getTime();

      // Use setTimeout with scheduleNotificationAsync(null) for immediate delivery
      setTimeout(async () => {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Task Due Soon',
            body: `"${title}" is due in 1 hour`,
            data: { taskId, type: 'task_due' },
          },
          trigger: null, // Fire immediately when setTimeout triggers
        });
      }, delayMs);
    }
  } catch (error) {
    console.error('Failed to schedule reminder:', error);
  }
};

// ============================================================
// 🔔 Schedule Event Reminder
// ============================================================
export const scheduleEventReminder = async (
  eventId: string,
  title: string,
  startsAt: Timestamp
) => {
  try {
    const reminderTime = new Date(startsAt.toDate().getTime() - 3600 * 1000);
    const now = new Date();

    if (reminderTime > now) {
      const delayMs = reminderTime.getTime() - now.getTime();

      setTimeout(async () => {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Event Starting Soon',
            body: `"${title}" starts in 1 hour`,
            data: { eventId, type: 'event_soon' },
          },
          trigger: null,
        });
      }, delayMs);
    }
  } catch (error) {
    console.error('Failed to schedule event reminder:', error);
  }
};

// ============================================================
// ❌ Cancel Notifications (Note: setTimeout-based can't be cancelled easily)
// ============================================================
export const cancelNotifications = async (identifier: string) => {
  try {
    // For setTimeout approach, we'd need to track timeout IDs
    // This is a limitation of the setTimeout approach
    console.log('Cancellation not fully supported with setTimeout approach');
  } catch (error) {
    console.error('Failed to cancel notifications:', error);
  }
};

// ============================================================
// 🔔 Alternative: Store notification data for background scheduling
// ============================================================
interface PendingNotification {
  id: string;
  title: string;
  targetTime: number;
  type: 'task' | 'event';
  timeoutId?: NodeJS.Timeout;
}

// In-memory store of pending notifications
const pendingNotifications = new Map<string, PendingNotification>();

export const scheduleNotificationWithTracking = async (
  id: string,
  title: string,
  targetTime: Timestamp,
  type: 'task' | 'event'
) => {
  try {
    const reminderTime = new Date(targetTime.toDate().getTime() - 3600 * 1000);
    const now = new Date();

    if (reminderTime <= now) {
      return; // Don't schedule if reminder time is in the past
    }

    const delayMs = reminderTime.getTime() - now.getTime();

    // Cancel existing notification for this ID
    const existing = pendingNotifications.get(id);
    if (existing?.timeoutId) {
      clearTimeout(existing.timeoutId);
    }

    // Schedule new notification
    const timeoutId = setTimeout(async () => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: type === 'task' ? 'Task Due Soon' : 'Event Starting Soon',
          body: type === 'task' 
            ? `"${title}" is due in 1 hour` 
            : `"${title}" starts in 1 hour`,
          data: { 
            [type === 'task' ? 'taskId' : 'eventId']: id, 
            type: type === 'task' ? 'task_due' : 'event_soon' 
          },
        },
        trigger: null,
      });
      
      // Remove from pending after sending
      pendingNotifications.delete(id);
    }, delayMs);

    // Store notification info
    pendingNotifications.set(id, {
      id,
      title,
      targetTime: reminderTime.getTime(),
      type,
      timeoutId,
    });

    console.log(`Scheduled ${type} notification for ${reminderTime}`);
  } catch (error) {
    console.error('Failed to schedule notification:', error);
  }
};

export const cancelNotificationById = (id: string) => {
  const notification = pendingNotifications.get(id);
  if (notification?.timeoutId) {
    clearTimeout(notification.timeoutId);
    pendingNotifications.delete(id);
    console.log(`Cancelled notification for ${id}`);
  }
};

// ============================================================
// 🔔 Main Functions using Tracking Approach
// ============================================================
export const scheduleTaskReminderNew = async (
  taskId: string,
  title: string,
  dueAt: Timestamp
) => {
  return scheduleNotificationWithTracking(taskId, title, dueAt, 'task');
};

export const scheduleEventReminderNew = async (
  eventId: string,
  title: string,
  startsAt: Timestamp
) => {
  return scheduleNotificationWithTracking(eventId, title, startsAt, 'event');
};

export const cancelTaskReminder = (taskId: string) => {
  cancelNotificationById(taskId);
};

export const cancelEventReminder = (eventId: string) => {
  cancelNotificationById(eventId);
};