import { BaseAgent } from './base.agent.js';
import { sendNotificationTool } from '../aiTools/notificationTools.js';

export class NotificationAgent extends BaseAgent {
  constructor() {
    super('notification', 'Notification Agent', 'Dispatches alerts for newly approved resources, upcoming events, and system notifications.');
  }

  async run(input = {}, context = {}) {
    const {
      recipientId = null,
      broadcast = false,
      role = 'student',
      title,
      message,
      link = '',
      type = 'system_alert'
    } = input;

    return await sendNotificationTool({
      recipientId,
      broadcast,
      role,
      title: title || 'New Update on The TaxMan\'s Capital',
      message: message || 'Check out the latest updates.',
      link,
      type,
      agentName: this.name,
      taskId: context.taskId
    });
  }
}
