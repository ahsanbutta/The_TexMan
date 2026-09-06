import { Notification } from '../../models/Notification.js';
import { User } from '../../models/User.js';
import { AIActivityLog } from '../../models/AIActivityLog.js';

/**
 * Dispatch notification to specific user or broadcast to all active students
 */
export async function sendNotificationTool({
  recipientId = null,
  broadcast = false,
  role = 'student',
  title,
  message,
  link = '',
  type = 'system_alert',
  agentName = 'Notification Agent',
  taskId = ''
}) {
  if (broadcast) {
    const filter = role && role !== 'all' ? { role } : {};
    const users = await User.find(filter).select('_id').lean();
    
    if (users.length === 0) {
      return { success: true, count: 0, message: 'No recipients matched filter.' };
    }

    const docs = users.map((u) => ({
      recipient: u._id,
      title,
      message,
      link,
      type,
      read: false
    }));

    await Notification.insertMany(docs);

    await AIActivityLog.create({
      agent: agentName,
      taskId,
      action: 'NOTIFICATION_BROADCAST_SENT',
      toolUsed: 'sendNotificationTool',
      input: { broadcast: true, role, title },
      output: { deliveredCount: docs.length },
      status: 'success'
    });

    return {
      success: true,
      deliveredCount: docs.length,
      message: `Notification broadcast sent to ${docs.length} users.`
    };
  }

  if (recipientId) {
    const notif = await Notification.create({
      recipient: recipientId,
      title,
      message,
      link,
      type,
      read: false
    });

    await AIActivityLog.create({
      agent: agentName,
      taskId,
      action: 'NOTIFICATION_SENT',
      toolUsed: 'sendNotificationTool',
      input: { recipientId, title },
      output: { notificationId: notif._id },
      status: 'success'
    });

    return { success: true, notification: notif };
  }

  return { success: false, message: 'Recipient ID or broadcast flag required.' };
}
