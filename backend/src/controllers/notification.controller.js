import { Notification } from '../models/Notification.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Get User Notifications
 * GET /api/notifications
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .limit(30);

  const unreadCount = await Notification.countDocuments({
    recipient: req.user._id,
    read: false
  });

  return new ApiResponse(
    200,
    { notifications, unreadCount },
    'Notifications retrieved'
  ).send(res);
});

/**
 * Mark Single Notification as Read
 * PUT /api/notifications/:id/read
 */
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { read: true },
    { new: true }
  );

  return new ApiResponse(200, notification, 'Notification marked as read').send(res);
});

/**
 * Mark All Notifications as Read
 * PUT /api/notifications/read-all
 */
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
  return new ApiResponse(200, null, 'All notifications marked as read').send(res);
});
