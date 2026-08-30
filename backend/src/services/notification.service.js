import { Notification } from '../models/Notification.js';

export const createNotification = async ({ recipient, sender = null, type, title, message, link = '' }) => {
  try {
    const notification = await Notification.create({
      recipient,
      sender,
      type,
      title,
      message,
      link
    });
    return notification;
  } catch (err) {
    console.error('Failed to create system notification:', err.message);
    return null;
  }
};
