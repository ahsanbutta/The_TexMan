/**
 * Notification Service for The TaxMan's Capital
 * Handles notification fetching, read state persistence, live updates, and admin broadcasts.
 */

import { api } from './api';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif_1',
    title: 'EY Pakistan Fall 2026 Inductions Open',
    message: 'Applications for CA Inter & ACCA trainees are now open. Apply before the deadline!',
    type: 'induction',
    read: false,
    timestamp: '2 hours ago',
    link: '#jobs'
  },
  {
    id: 'notif_2',
    title: 'Free Webinar: Cracking Big 4 Partner Interviews',
    message: 'Join lead mentor Saboor Ahmad CA this Saturday for a live case-study breakdown.',
    type: 'event',
    read: false,
    timestamp: '5 hours ago',
    link: '#events'
  },
  {
    id: 'notif_3',
    title: 'New CAF Financial Reporting Study Guide Added',
    message: 'Updated with latest IFRS standards and exam tips. Download now from Resources.',
    type: 'resource',
    read: false,
    timestamp: '1 day ago',
    link: '#resources'
  }
];

const NOTIFICATIONS_STORAGE_KEY = 'taxman_user_notifications';

export const getNotifications = async () => {
  try {
    const res = await api.get('/notifications');
    const serverNotifs = res?.data?.notifications || res?.data;
    if (Array.isArray(serverNotifs) && serverNotifs.length > 0) {
      return serverNotifs.map(n => ({
        id: n._id || n.id,
        title: n.title,
        message: n.message || n.content,
        type: n.type || 'general',
        read: !!n.read,
        timestamp: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Recent',
      }));
    }
  } catch (err) {
    // Graceful fallback to local storage if backend server is starting up or offline
  }

  // Local storage fallback
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore storage parse error
  }

  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
  return DEFAULT_NOTIFICATIONS;
};

export const markNotificationAsRead = async (id) => {
  try {
    await api.patch(`/notifications/${id}/read`, {}).catch(() => {});
  } catch {
    // Ignore offline errors
  }

  try {
    const notifs = await getNotifications();
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    await api.patch('/notifications/read-all', {}).catch(() => {});
  } catch {
    // Ignore offline errors
  }

  try {
    const notifs = await getNotifications();
    const updated = notifs.map(n => ({ ...n, read: true }));
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

export const deleteNotification = async (id) => {
  try {
    await api.delete(`/notifications/${id}`).catch(() => {});
  } catch {
    // Ignore offline errors
  }

  try {
    const notifs = await getNotifications();
    const updated = notifs.filter(n => n.id !== id);
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

export const broadcastNotification = async (notificationData) => {
  try {
    const res = await api.post('/notifications/broadcast', notificationData);
    return res?.data || res;
  } catch (err) {
    console.warn('[NotificationService] Broadcast fallback:', err.message);
    const notifs = await getNotifications();
    const newNotif = {
      id: 'notif_' + Date.now(),
      title: notificationData.title || 'System Announcement',
      message: notificationData.message || notificationData.content || '',
      type: notificationData.type || 'general',
      read: false,
      timestamp: 'Just now',
      link: notificationData.link || '#'
    };
    const updated = [newNotif, ...notifs];
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    return { success: true, notification: newNotif };
  }
};
