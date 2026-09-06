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
const READ_IDS_KEY = 'taxman_read_notification_ids';

const getPersistedReadIds = () => {
  try {
    const raw = localStorage.getItem(READ_IDS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
};

const savePersistedReadIds = (setOfIds) => {
  try {
    localStorage.setItem(READ_IDS_KEY, JSON.stringify(Array.from(setOfIds)));
  } catch {}
};

export const getNotifications = async () => {
  const readIds = getPersistedReadIds();

  try {
    const res = await api.get('/notifications');
    const serverNotifs = res?.data?.notifications || res?.data;
    if (Array.isArray(serverNotifs) && serverNotifs.length > 0) {
      const mapped = serverNotifs.map(n => {
        const id = String(n._id || n.id);
        const isRead = Boolean(n.read) || readIds.has(id);
        return {
          id,
          title: n.title,
          message: n.message || n.content,
          type: n.type || 'general',
          read: isRead,
          timestamp: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Recent',
          link: n.link || '#'
        };
      });
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(mapped));
      return mapped;
    }
  } catch (err) {
    // Graceful fallback to local storage if backend server is starting up or offline
  }

  // Local storage fallback
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(n => ({
          ...n,
          read: Boolean(n.read) || readIds.has(String(n.id))
        }));
      }
    }
  } catch {
    // Ignore storage parse error
  }

  const initial = DEFAULT_NOTIFICATIONS.map(n => ({
    ...n,
    read: readIds.has(String(n.id))
  }));
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

export const markNotificationAsRead = async (id, currentList = null) => {
  const idStr = String(id);
  const readIds = getPersistedReadIds();
  readIds.add(idStr);
  savePersistedReadIds(readIds);

  try {
    await api.put(`/notifications/${idStr}/read`, {}).catch(() =>
      api.patch(`/notifications/${idStr}/read`, {})
    );
  } catch {
    // Ignore offline errors
  }

  let list = currentList;
  if (!Array.isArray(list) || list.length === 0) {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      list = stored ? JSON.parse(stored) : DEFAULT_NOTIFICATIONS;
    } catch {
      list = DEFAULT_NOTIFICATIONS;
    }
  }

  const updated = list.map(n =>
    String(n.id) === idStr || readIds.has(String(n.id)) ? { ...n, read: true } : n
  );

  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch {}

  return updated;
};

export const markAllNotificationsAsRead = async (currentList = null) => {
  try {
    await api.put('/notifications/read-all', {}).catch(() =>
      api.patch('/notifications/read-all', {})
    );
  } catch {
    // Ignore offline errors
  }

  let list = currentList;
  if (!Array.isArray(list) || list.length === 0) {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      list = stored ? JSON.parse(stored) : DEFAULT_NOTIFICATIONS;
    } catch {
      list = DEFAULT_NOTIFICATIONS;
    }
  }

  const readIds = getPersistedReadIds();
  list.forEach(n => {
    if (n.id) readIds.add(String(n.id));
  });
  savePersistedReadIds(readIds);

  const updated = list.map(n => ({ ...n, read: true }));

  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch {}

  return updated;
};

export const deleteNotification = async (id, currentList = null) => {
  const idStr = String(id);
  try {
    await api.delete(`/notifications/${idStr}`).catch(() => {});
  } catch {
    // Ignore offline errors
  }

  let list = currentList;
  if (!Array.isArray(list) || list.length === 0) {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      list = stored ? JSON.parse(stored) : DEFAULT_NOTIFICATIONS;
    } catch {
      list = DEFAULT_NOTIFICATIONS;
    }
  }

  const updated = list.filter(n => String(n.id) !== idStr);

  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch {}

  return updated;
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
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return { success: true, notification: newNotif };
  }
};
