import { BaseAgent } from './base.agent.js';
import { createEventTool, searchEvents, cleanupExpiredEventsTool } from '../aiTools/eventTools.js';

export class EventAgent extends BaseAgent {
  constructor() {
    super('event', 'Event Agent', 'Discovers, drafts, and manages webinars, workshops, mock interviews, and student events.');
  }

  async run(input = {}, context = {}) {
    const { action = 'create', query = '', limit = 10 } = input;
    const eventData = input.payload || input;

    if (action === 'search') {
      const results = await searchEvents({ query, limit });
      return { action: 'search', count: results.length, events: results };
    }

    if (action === 'cleanup_expired') {
      return await cleanupExpiredEventsTool({
        agentName: this.name,
        taskId: context.taskId
      });
    }

    // Default: create event draft
    return await createEventTool({
      title: eventData.title || 'CA & ACCA Career Webinar',
      desc: eventData.desc || eventData.description || 'Exclusive interactive guidance session.',
      date: eventData.date || 'Upcoming Date TBA',
      time: eventData.time || '08:00 PM PST',
      speakerName: eventData.speakerName || 'Saboor Ahmad CA',
      speakerTitle: eventData.speakerTitle || 'Lead Career Mentor',
      speakerOrg: eventData.speakerOrg || "The TaxMan's Capital",
      speakerRole: eventData.speakerRole || 'Mentor',
      status: eventData.status || 'Upcoming',
      qualTarget: eventData.qualTarget || 'CA & ACCA Students',
      location: eventData.location || 'Live Zoom Meeting',
      meetingLink: eventData.meetingLink || '',
      maxParticipants: eventData.maxParticipants || 500,
      requiresApproval: eventData.requiresApproval !== undefined ? eventData.requiresApproval : true,
      agentName: this.name,
      taskId: context.taskId
    });
  }
}
