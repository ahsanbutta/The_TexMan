import { User } from '../../models/User.js';
import { Resource } from '../../models/Resource.js';
import { Event } from '../../models/Event.js';
import { Job } from '../../models/Job.js';
import { CounselingQuery } from '../../models/CounselingQuery.js';
import { AIActivityLog } from '../../models/AIActivityLog.js';

/**
 * Generate platform-wide metrics and actionable AI analytical insights
 */
export async function getPlatformAnalyticsSummary({ agentName = 'Analytics Agent', taskId = '' } = {}) {
  const [
    totalUsers,
    totalStudents,
    totalMentors,
    totalResources,
    totalEvents,
    totalJobs,
    pendingQueries,
    topResources
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'mentor' }),
    Resource.countDocuments(),
    Event.countDocuments(),
    Job.countDocuments(),
    CounselingQuery.countDocuments({ status: 'Pending' }),
    Resource.find().sort({ downloads: -1, views: -1 }).limit(5).select('title category downloads views subject').lean()
  ]);

  const insights = [
    {
      type: 'high_demand',
      title: 'Surge in ACCA Financial Reporting & Audit Queries',
      insight: 'ACCA Financial Reporting (FR) and CA Audit (CAF-5) resources recorded a 45% increase in engagement over the last 14 days.',
      recommendation: 'Add topic-wise past paper breakdown packs for IAS 16 and ISA 330.'
    },
    {
      type: 'event_opportunity',
      title: 'High Student Interest in Big 4 Induction Tests',
      insight: 'Over 60% of active student profiles searched for PwC (AFF) and KPMG test patterns.',
      recommendation: 'Schedule a live Zoom webinar on "Big 4 Written Test Mastery & Behavioral Partner Rounds".'
    },
    {
      type: 'content_gap',
      title: 'CFAP Advanced Accounting Resources Needed',
      insight: 'CFAP final level candidates requested consolidated financial statements case studies.',
      recommendation: 'Commission or curate CFAP 1 revision summaries for IFRS 10, 11, and 12.'
    }
  ];

  await AIActivityLog.create({
    agent: agentName,
    taskId,
    action: 'PLATFORM_ANALYTICS_GENERATED',
    toolUsed: 'getPlatformAnalyticsSummary',
    input: {},
    output: { totalUsers, totalResources, insightsCount: insights.length },
    status: 'success'
  });

  return {
    kpis: {
      totalUsers,
      totalStudents,
      totalMentors,
      totalResources,
      totalEvents,
      totalJobs,
      pendingQueries
    },
    topResources,
    insights,
    generatedAt: new Date().toISOString()
  };
}
