import { BaseAgent } from './base.agent.js';
import { Resource } from '../../models/Resource.js';
import { Event } from '../../models/Event.js';
import { Announcement } from '../../models/Announcement.js';
import { Job } from '../../models/Job.js';

export class StudentSupportAgent extends BaseAgent {
  constructor() {
    super('student_support', 'Student Support Agent', 'Answers student inquiries using verified, real platform database records.');
  }

  async run(input = {}, context = {}) {
    const { query = '' } = input;
    const cleanQuery = (query || '').trim();

    if (!cleanQuery) {
      return {
        reply: "Assalamu Alaikum! How can I assist you with your CA/ACCA study materials, firm inductions, or event dates today?",
        sources: []
      };
    }

    const regex = new RegExp(cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    // Search across real database collections
    const [resources, events, announcements, jobs] = await Promise.all([
      Resource.find({
        $or: [{ title: regex }, { description: regex }, { subject: regex }, { category: regex }, { tags: { $in: [regex] } }]
      }).limit(4).lean(),
      Event.find({
        $or: [{ title: regex }, { desc: regex }, { speakerName: regex }]
      }).limit(2).lean(),
      Announcement.find({
        $or: [{ title: regex }, { summary: regex }, { content: regex }]
      }).limit(2).lean(),
      Job.find({
        $or: [{ title: regex }, { company: regex }, { city: regex }]
      }).limit(2).lean()
    ]);

    const totalFound = resources.length + events.length + announcements.length + jobs.length;

    if (totalFound === 0) {
      return {
        found: false,
        reply: `I searched The TaxMan's Capital database for "${cleanQuery}", but I could not find any official resources, events, or announcements matching that exact query.\n\nTip: You can submit a resource request in the Resources tab or reach out to our mentors in Career Support!`,
        sources: []
      };
    }

    let reply = `Here is what I found in our official platform database for "${cleanQuery}":\n\n`;

    const sources = [];

    if (resources.length > 0) {
      reply += `### 📚 Verified Study Resources:\n`;
      resources.forEach((r) => {
        reply += `- **${r.title}** (${r.category} | ${r.qualification})\n  ${r.description ? r.description.slice(0, 120) + '...' : ''}\n  [Download Link](${r.fileUrl || r.externalUrl || '/resources'})\n\n`;
        sources.push({ type: 'Resource', title: r.title, url: r.fileUrl || '/resources' });
      });
    }

    if (events.length > 0) {
      reply += `### 🗓️ Upcoming Events & Webinars:\n`;
      events.forEach((e) => {
        reply += `- **${e.title}** (Date: ${e.date} at ${e.time})\n  Speaker: ${e.speakerName} (${e.speakerOrg})\n  Location: ${e.location}\n\n`;
        sources.push({ type: 'Event', title: e.title, date: e.date });
      });
    }

    if (jobs.length > 0) {
      reply += `### 💼 Matching Firm Inductions & Jobs:\n`;
      jobs.forEach((j) => {
        reply += `- **${j.title}** at **${j.company}** (${j.city || j.location})\n  Deadline: ${j.deadline || 'Open'}\n\n`;
        sources.push({ type: 'Job', title: j.title, company: j.company });
      });
    }

    return {
      found: true,
      totalFound,
      reply,
      sources
    };
  }
}
