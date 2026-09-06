import { Event } from '../../models/Event.js';
import { AIApproval } from '../../models/AIApproval.js';
import { AIActivityLog } from '../../models/AIActivityLog.js';

/**
 * Search events in the database
 */
export async function searchEvents({ query = '', status = '', limit = 10 }) {
  const filter = {};
  if (status) {
    filter.status = status;
  }
  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: 'i' } },
      { desc: { $regex: query, $options: 'i' } },
      { speakerName: { $regex: query, $options: 'i' } },
      { qualTarget: { $regex: query, $options: 'i' } }
    ];
  }

  return await Event.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
}

/**
 * Check if an event already exists
 */
export async function checkDuplicateEvent({ title, date = '' }) {
  const cleanTitle = (title || '').trim().toLowerCase();
  const existing = await Event.findOne({
    title: { $regex: `^${cleanTitle}$`, $options: 'i' }
  }).lean();

  return {
    isDuplicate: !!existing,
    matchedEvent: existing || null
  };
}

/**
 * Create an event or queue in Approval Queue
 */
export async function createEventTool({
  title,
  desc,
  date,
  time = '08:00 PM PST',
  speakerName = 'Saboor Ahmad',
  speakerTitle = 'Lead Career Mentor',
  speakerOrg = "The TaxMan's Capital",
  speakerRole = 'Mentor',
  status = 'Upcoming',
  qualTarget = 'CA & ACCA Students',
  location = 'Live Zoom Meeting',
  meetingLink = '',
  maxParticipants = 500,
  requiresApproval = true,
  agentName = 'Event Agent',
  taskId = ''
}) {
  const duplicateCheck = await checkDuplicateEvent({ title, date });
  if (duplicateCheck.isDuplicate) {
    return {
      success: false,
      isDuplicate: true,
      message: `Duplicate event found: "${duplicateCheck.matchedEvent.title}"`,
      event: duplicateCheck.matchedEvent
    };
  }

  const payload = {
    title: title.trim(),
    desc: desc.trim(),
    date: date || 'Upcoming Date TBA',
    time: time || '08:00 PM PST',
    speakerName,
    speakerTitle,
    speakerOrg,
    speakerRole,
    status,
    qualTarget,
    location,
    meetingLink,
    maxParticipants
  };

  if (requiresApproval) {
    const approvalItem = await AIApproval.create({
      type: 'Event',
      title: payload.title,
      summary: `${payload.date} | ${payload.location} - ${payload.desc.slice(0, 100)}...`,
      status: 'Pending',
      agent: agentName,
      taskId,
      confidence: 88,
      source: speakerOrg,
      sourceUrl: meetingLink,
      payload
    });

    await AIActivityLog.create({
      agent: agentName,
      taskId,
      action: 'EVENT_DRAFT_CREATED_FOR_APPROVAL',
      toolUsed: 'createEventTool',
      input: { title, date, location },
      output: { approvalId: approvalItem._id },
      status: 'success'
    });

    return {
      success: true,
      requiresApproval: true,
      approvalId: approvalItem._id,
      message: `Event "${title}" sent to AI Approval Queue.`,
      payload
    };
  }

  const newEvent = await Event.create(payload);

  await AIActivityLog.create({
    agent: agentName,
    taskId,
    action: 'EVENT_PUBLISHED_DIRECTLY',
    toolUsed: 'createEventTool',
    input: { title, date },
    output: { eventId: newEvent._id },
    status: 'success'
  });

  return {
    success: true,
    requiresApproval: false,
    event: newEvent,
    message: `Event "${title}" created successfully.`
  };
}

/**
 * Remove or mark expired events
 */
export async function cleanupExpiredEventsTool({ agentName = 'Event Agent', taskId = '' }) {
  const now = new Date();
  // We check for events where date may have passed or marked as Recorded
  const events = await Event.find({ status: 'Upcoming' });
  let updatedCount = 0;

  for (const ev of events) {
    // Basic date parsing heuristic if string format allows
    const parsed = Date.parse(ev.date);
    if (!isNaN(parsed) && parsed < now.getTime() - 86400000) {
      ev.status = 'Recorded';
      await ev.save();
      updatedCount++;
    }
  }

  await AIActivityLog.create({
    agent: agentName,
    taskId,
    action: 'EXPIRED_EVENTS_CLEANED_UP',
    toolUsed: 'cleanupExpiredEventsTool',
    input: {},
    output: { updatedCount },
    status: 'info'
  });

  return { success: true, updatedCount };
}
