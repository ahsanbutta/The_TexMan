import { orchestrator } from '../services/agents/orchestrator.agent.js';
import { AITask } from '../models/AITask.js';
import { AIActivityLog } from '../models/AIActivityLog.js';
import { ResearchItem } from '../models/ResearchItem.js';
import { ResearchSource } from '../models/ResearchSource.js';
import { AIApproval } from '../models/AIApproval.js';
import { Resource } from '../models/Resource.js';
import { Event } from '../models/Event.js';
import { Blog } from '../models/Blog.js';
import { Announcement } from '../models/Announcement.js';
import { seedDefaultResearchSources, fetchExternalWebPage, parseHtmlContent, extractDiscoveriesWithAI } from '../services/aiTools/externalCrawler.js';
import { AISettings } from '../models/AISettings.js';
import { AIDailyReport } from '../models/AIDailyReport.js';
import { getOrCreateAISettings, runAutonomousDailyCycle, rescheduleAutonomousWorker, calculateNextRunTime } from '../services/scheduler/autonomousScheduler.js';
import { sendDailyReportNotification, sendEmailAlert, sendWhatsAppAlert, sendApprovalAlert, processIncomingWhatsAppMessage, getTelemetryDeliveryStatus, executeApprovalDecision } from '../services/aiTools/externalNotifier.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Execute natural language command through AI Orchestrator
 * POST /api/ai/orchestrator/command
 */
export const executeOrchestratorCommand = asyncHandler(async (req, res) => {
  const { commandText } = req.body;
  if (!commandText || !commandText.trim()) {
    throw new ApiError(400, 'commandText is required for Orchestrator execution.');
  }

  const result = await orchestrator.executeCommand({
    commandText: commandText.trim(),
    triggeredBy: req.user ? 'admin' : 'system',
    triggeredByUser: req.user?._id || null
  });

  return new ApiResponse(200, result, 'Orchestrator command executed successfully.').send(res);
});

/**
 * Run direct trigger for a single agent
 * POST /api/ai/agents/:agentId/run
 */
export const runSingleAgent = asyncHandler(async (req, res) => {
  const { agentId } = req.params;
  const { input = {} } = req.body;

  const result = await orchestrator.runSingleAgent(agentId, input);
  return new ApiResponse(200, result, `Agent "${agentId}" executed successfully.`).send(res);
});

/**
 * Get AI Control Center KPI Overview & Agent Status
 * GET /api/ai/control-center/stats
 */
export const getControlCenterStats = asyncHandler(async (req, res) => {
  const [
    totalTasks,
    runningTasks,
    completedTasks,
    failedTasks,
    pendingApprovals,
    researchInboxCount,
    recentActivity,
    recentTasks,
    settings
  ] = await Promise.all([
    AITask.countDocuments(),
    AITask.countDocuments({ status: 'running' }),
    AITask.countDocuments({ status: 'completed' }),
    AITask.countDocuments({ status: 'failed' }),
    AIApproval.countDocuments({ status: 'Pending' }),
    ResearchItem.countDocuments({ status: 'New' }),
    AIActivityLog.find().sort({ createdAt: -1 }).limit(8).lean(),
    AITask.find().sort({ createdAt: -1 }).limit(6).lean(),
    getOrCreateAISettings()
  ]);

  const agents = orchestrator.getAgentList();
  const telemetry = getTelemetryDeliveryStatus();

  const stats = {
    overview: {
      totalTasks,
      runningTasks,
      completedTasks,
      failedTasks,
      pendingApprovals,
      researchInboxCount
    },
    agents,
    recentActivity,
    recentTasks,
    scheduler: {
      status: settings.schedulerEnabled ? 'ACTIVE' : 'PAUSED',
      enabled: settings.schedulerEnabled,
      frequency: settings.scheduleFrequency || 'daily',
      scheduledTime: settings.scheduledTime || '09:00',
      timezone: settings.timezone || 'Asia/Karachi',
      nextRunAt: settings.nextRunAt || calculateNextRunTime(settings),
      lastRunAt: settings.lastRunAt,
      lastRunStatus: settings.lastRunStatus || 'Ready'
    },
    telemetry
  };

  return new ApiResponse(200, stats, 'AI Control Center statistics').send(res);
});

/**
 * Get Paginated AI Tasks
 * GET /api/ai/tasks
 */
export const getAITasks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const filter = {};
  if (status && status !== 'All') filter.status = status;

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;

  const total = await AITask.countDocuments(filter);
  const tasks = await AITask.find(filter)
    .sort({ createdAt: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .lean();

  return new ApiResponse(200, tasks, 'AI tasks retrieved', {
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum) || 1
  }).send(res);
});

/**
 * Get Activity Logs
 * GET /api/ai/activity
 */
export const getAIActivityLogs = asyncHandler(async (req, res) => {
  const { limit = 25 } = req.query;
  const logs = await AIActivityLog.find()
    .sort({ createdAt: -1 })
    .limit(parseInt(limit, 10) || 25)
    .lean();

  return new ApiResponse(200, logs, 'AI activity audit logs').send(res);
});

/**
 * Get Research Inbox
 * GET /api/ai/research-inbox
 */
export const getResearchInboxList = asyncHandler(async (req, res) => {
  const { status, qualification, category, page = 1, limit = 15 } = req.query;
  const filter = {};
  if (status && status !== 'All') filter.status = status;
  if (qualification && qualification !== 'Both') filter.qualification = { $in: [qualification, 'Both'] };
  if (category && category !== 'All') filter.category = category;

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 15;

  const total = await ResearchItem.countDocuments(filter);
  const items = await ResearchItem.find(filter)
    .sort({ createdAt: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .lean();

  return new ApiResponse(200, items, 'Research inbox items', {
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum) || 1
  }).send(res);
});

/**
 * Update Research Item Status
 * PUT /api/ai/research-inbox/:id
 */
export const updateResearchItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const item = await ResearchItem.findByIdAndUpdate(
    id,
    { status: status || 'Reviewed' },
    { new: true }
  );

  if (!item) {
    throw new ApiError(404, 'Research item not found.');
  }

  return new ApiResponse(200, item, 'Research item updated').send(res);
});

/**
 * Convert Research Item to Real Resource or Event
 * POST /api/ai/research-inbox/:id/convert
 */
export const convertResearchItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { targetType = 'Resource' } = req.body;

  const item = await ResearchItem.findById(id);
  if (!item) {
    throw new ApiError(404, 'Research item not found.');
  }

  let createdEntity = null;

  if (targetType === 'Resource') {
    createdEntity = await Resource.create({
      title: item.title,
      description: item.summary,
      category: item.category === 'ACCA' ? 'ACCA' : 'CAF',
      qualification: item.qualification,
      fileUrl: item.sourceUrl,
      externalUrl: item.sourceUrl,
      author: item.source,
      published: true
    });
  } else if (targetType === 'Event') {
    createdEntity = await Event.create({
      title: item.title,
      desc: item.summary,
      date: 'Date Announced on Portal',
      time: '08:00 PM PST',
      speakerOrg: item.source,
      meetingLink: item.sourceUrl
    });
  }

  item.status = 'Published';
  item.convertedEntity = {
    entityType: targetType,
    entityId: createdEntity ? createdEntity._id : null
  };
  await item.save();

  return new ApiResponse(200, { item, createdEntity }, `Research item converted to ${targetType} and published.`).send(res);
});

/**
 * Get AI Approvals Queue
 * GET /api/ai/approvals
 */
export const getApprovalsList = asyncHandler(async (req, res) => {
  const { status = 'Pending', page = 1, limit = 15 } = req.query;
  const filter = {};
  if (status && status !== 'All') filter.status = status;

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 15;

  const total = await AIApproval.countDocuments(filter);
  const items = await AIApproval.find(filter)
    .sort({ createdAt: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .lean();

  return new ApiResponse(200, items, 'AI approvals queue', {
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum) || 1
  }).send(res);
});

/**
 * Approve or Reject Approval Item (Human in the Loop)
 * POST /api/ai/approvals/:id/decide
 */
export const decideApproval = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { decision = 'Approved', reviewNotes = '' } = req.body; // Approved | Rejected

  const approval = await AIApproval.findById(id);
  if (!approval) {
    throw new ApiError(404, 'Approval item not found.');
  }

  approval.status = decision;
  approval.reviewNotes = reviewNotes;
  approval.reviewedAt = new Date();
  approval.reviewedBy = req.user?._id || null;

  let publishedEntity = null;

  if (decision === 'Approved') {
    if (approval.type === 'Resource') {
      const existingResId = approval.targetEntityId || approval.payload?.resourceId;
      if (existingResId) {
        publishedEntity = await Resource.findByIdAndUpdate(
          existingResId,
          {
            $set: {
              status: 'approved',
              published: true,
              approvedBy: req.user?._id,
              approvedAt: new Date()
            }
          },
          { new: true }
        );
      }

      if (!publishedEntity) {
        publishedEntity = await Resource.create({
          title: approval.payload.title || approval.title,
          description: approval.payload.description || approval.summary || 'Study resource file',
          category: approval.payload.category || 'CAF',
          subject: approval.payload.subject || '',
          qualification: approval.payload.qualification || 'Both',
          resourceType: approval.payload.resourceType || 'PDF',
          fileUrl: approval.payload.fileUrl || approval.payload.externalUrl || 'https://the-taxmans-capital.vercel.app',
          externalUrl: approval.payload.externalUrl || '',
          author: approval.payload.author || "The TaxMan's Capital Mentorship Team",
          tag: approval.payload.tag || '',
          tags: Array.isArray(approval.payload.tags) ? approval.payload.tags : [],
          status: 'approved',
          published: true,
          approvedBy: req.user?._id,
          approvedAt: new Date()
        });
      }

      approval.targetEntityId = publishedEntity._id;
      approval.status = 'Published';
    } else if (approval.type === 'Event') {
      publishedEntity = await Event.create({
        title: approval.payload.title || approval.title,
        desc: approval.payload.desc || approval.payload.description || approval.summary || 'Interactive educational session',
        date: approval.payload.date || 'Upcoming Date TBA',
        time: approval.payload.time || '08:00 PM PST',
        speakerName: approval.payload.speakerName || 'Saboor Ahmad CA',
        speakerTitle: approval.payload.speakerTitle || 'Lead Career Mentor',
        speakerOrg: approval.payload.speakerOrg || "The TaxMan's Capital",
        location: approval.payload.location || 'Live Zoom Meeting',
        meetingLink: approval.payload.meetingLink || '',
        status: approval.payload.status || 'Upcoming'
      });
      approval.targetEntityId = publishedEntity._id;
      approval.status = 'Published';
    } else if (approval.type === 'Blog') {
      const cleanSlug = (approval.payload.title || approval.title || 'article')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString(36);

      publishedEntity = await Blog.create({
        title: approval.payload.title || approval.title,
        slug: approval.payload.slug || cleanSlug,
        category: approval.payload.category || 'Big 4 & Inductions',
        author: {
          name: approval.payload.authorName || 'Saboor Ahmad CA',
          role: approval.payload.authorRole || 'Founder & Lead Career Mentor',
          avatar: ''
        },
        coverImage: approval.payload.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
        summary: approval.payload.summary || approval.summary || 'Educational article',
        content: approval.payload.content || approval.payload.summary || approval.summary,
        tags: Array.isArray(approval.payload.tags)
          ? approval.payload.tags
          : typeof approval.payload.tags === 'string'
          ? approval.payload.tags.split(',').map((t) => t.trim())
          : ['Career', 'Guidance'],
        readTime: approval.payload.readTime || '4 min read',
        status: 'published'
      });
      approval.targetEntityId = publishedEntity._id;
      approval.status = 'Published';
    } else if (approval.type === 'Announcement') {
      publishedEntity = await Announcement.create({
        title: approval.payload.title || approval.title,
        summary: approval.payload.summary || approval.summary,
        content: approval.payload.content || approval.summary,
        category: approval.payload.category || 'General',
        eventDate: approval.payload.eventDate || '',
        status: 'Upcoming'
      });
      approval.targetEntityId = publishedEntity._id;
      approval.status = 'Published';
    } else if (approval.type === 'SocialPost') {
      publishedEntity = {
        type: 'SocialPost',
        title: approval.title,
        posts: approval.payload?.posts || {},
        published: true
      };
      approval.status = 'Published';
    }
  } else if (decision === 'Rejected') {
    const existingResId = approval.targetEntityId || approval.payload?.resourceId;
    if (existingResId) {
      await Resource.findByIdAndUpdate(existingResId, {
        $set: {
          status: 'rejected',
          published: false,
          rejectionReason: reviewNotes || 'Rejected by Admin',
          rejectedBy: req.user?._id,
          rejectedAt: new Date()
        }
      });
    }
  }

  await approval.save();

  await AIActivityLog.create({
    agent: 'AI Approval System',
    taskId: approval.taskId,
    action: `APPROVAL_${decision.toUpperCase()}`,
    toolUsed: 'decideApproval',
    input: { id, decision, reviewNotes },
    output: { approvalId: id, entityId: publishedEntity?._id || null },
    status: decision === 'Approved' ? 'success' : 'warning',
    actor: req.user?.email || 'admin'
  });

  return new ApiResponse(200, { approval, publishedEntity }, `Item ${decision.toLowerCase()} successfully.`).send(res);
});

/**
 * 1-Click Direct Email Approval / Rejection Action (No Dashboard Login Required)
 * GET /api/ai/quick-action?id=:id&action=:action
 */
export const quickApproveOrRejectViaEmail = asyncHandler(async (req, res) => {
  const { id, action = 'Approved' } = req.query;
  const decision = action === 'Rejected' || action === 'reject' ? 'Rejected' : 'Approved';

  if (!id) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Invalid Action Link</title><meta name="viewport" content="width=device-width, initial-scale=1"></head>
      <body style="font-family: Arial, sans-serif; background: #0A0E17; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
        <div style="background: #111827; padding: 32px; border-radius: 16px; border: 1px solid #1E293B; max-width: 480px; text-align: center;">
          <h2 style="color: #EF4444; margin-top: 0;">⚠️ Missing Approval ID</h2>
          <p style="color: #94A3B8;">The approval link is invalid or incomplete.</p>
        </div>
      </body>
      </html>
    `);
  }

  const approval = await AIApproval.findById(id);
  if (!approval) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Item Not Found</title><meta name="viewport" content="width=device-width, initial-scale=1"></head>
      <body style="font-family: Arial, sans-serif; background: #0A0E17; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
        <div style="background: #111827; padding: 32px; border-radius: 16px; border: 1px solid #1E293B; max-width: 480px; text-align: center;">
          <h2 style="color: #EF4444; margin-top: 0;">⚠️ Item Not Found</h2>
          <p style="color: #94A3B8;">This approval item does not exist or was already deleted.</p>
        </div>
      </body>
      </html>
    `);
  }

  // If already actioned
  if (approval.status === 'Published' || approval.status === 'Approved' || approval.status === 'Rejected') {
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Already Processed</title><meta name="viewport" content="width=device-width, initial-scale=1"></head>
      <body style="font-family: Arial, sans-serif; background: #0A0E17; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
        <div style="background: #111827; padding: 32px; border-radius: 16px; border: 1px solid #1E293B; max-width: 520px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 12px;">ℹ️</div>
          <h2 style="color: #38BDF8; margin-top: 0;">Already Processed</h2>
          <p style="color: #CBD5E1; font-size: 15px;"><strong>"${approval.title}"</strong> is already marked as <strong>${approval.status}</strong>.</p>
          <div style="margin-top: 24px;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/resources" style="background: #10B981; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; display: inline-block;">View Resources</a>
          </div>
        </div>
      </body>
      </html>
    `);
  }

  approval.status = decision;
  approval.reviewNotes = `Direct 1-Click action via Email (${decision})`;
  approval.reviewedAt = new Date();

  let publishedEntity = null;

  if (decision === 'Approved') {
    if (approval.type === 'Resource' || !approval.type) {
      publishedEntity = await Resource.create({
        title: approval.payload?.title || approval.title,
        description: approval.payload?.description || approval.summary || 'Study resource file',
        category: approval.payload?.category || 'CAF',
        subject: approval.payload?.subject || '',
        qualification: approval.payload?.qualification || 'Both',
        resourceType: approval.payload?.resourceType || 'PDF',
        fileUrl: approval.payload?.fileUrl || approval.payload?.externalUrl || 'https://the-taxmans-capital.vercel.app',
        externalUrl: approval.payload?.externalUrl || '',
        author: approval.payload?.author || "The TaxMan's Capital Mentorship Team",
        tags: Array.isArray(approval.payload?.tags) ? approval.payload.tags : [],
        status: 'approved',
        published: true,
        approvedAt: new Date()
      });
      approval.targetEntityId = publishedEntity._id;
      approval.status = 'Published';
    } else if (approval.type === 'Blog') {
      const cleanSlug = (approval.payload?.title || approval.title || 'article')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString(36);

      publishedEntity = await Blog.create({
        title: approval.payload?.title || approval.title,
        slug: approval.payload?.slug || cleanSlug,
        category: approval.payload?.category || 'Big 4 & Inductions',
        author: {
          name: approval.payload?.authorName || 'Saboor Ahmad CA',
          role: approval.payload?.authorRole || 'Founder & Lead Career Mentor',
          avatar: ''
        },
        coverImage: approval.payload?.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
        summary: approval.payload?.summary || approval.summary || 'Educational article',
        content: approval.payload?.content || approval.payload?.summary || approval.summary,
        status: 'published'
      });
      approval.targetEntityId = publishedEntity._id;
      approval.status = 'Published';
    } else if (approval.type === 'Event') {
      publishedEntity = await Event.create({
        title: approval.payload?.title || approval.title,
        desc: approval.payload?.desc || approval.payload?.description || approval.summary || 'Educational Session',
        date: approval.payload?.date || 'Upcoming Date TBA',
        time: approval.payload?.time || '08:00 PM PST',
        speakerName: approval.payload?.speakerName || 'Saboor Ahmad CA',
        speakerTitle: approval.payload?.speakerTitle || 'Lead Career Mentor',
        speakerOrg: approval.payload?.speakerOrg || "The TaxMan's Capital",
        location: approval.payload?.location || 'Live Zoom Meeting',
        meetingLink: approval.payload?.meetingLink || '',
        status: 'Upcoming'
      });
      approval.targetEntityId = publishedEntity._id;
      approval.status = 'Published';
    }
  }

  await approval.save();

  await AIActivityLog.create({
    agent: 'AI Approval System',
    taskId: approval.taskId || '',
    action: `APPROVAL_DIRECT_EMAIL_${decision.toUpperCase()}`,
    toolUsed: 'quickApproveOrRejectViaEmail',
    input: { id, decision },
    output: { approvalId: id, entityId: publishedEntity?._id || null },
    status: decision === 'Approved' ? 'success' : 'warning',
    actor: 'email_recipient'
  });

  const isApproved = decision === 'Approved';
  const accentColor = isApproved ? '#10B981' : '#EF4444';
  const headline = isApproved ? '✅ Approved & Published Successfully!' : '❌ Item Dismissed / Rejected';
  const message = isApproved 
    ? `The ${approval.type || 'resource'} <strong>"${approval.title}"</strong> has been approved and is now LIVE on The TaxMan's Capital portal.` 
    : `The item <strong>"${approval.title}"</strong> has been rejected and will not be published.`;

  return res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${isApproved ? 'Approved' : 'Rejected'} — The TaxMan's Capital</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0A0E17; color: #FFFFFF; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
        .card { background: #111827; max-width: 540px; width: 100%; border-radius: 16px; border: 1px solid #1E293B; padding: 36px 28px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
        .badge { display: inline-block; background: ${accentColor}22; color: ${accentColor}; border: 1px solid ${accentColor}55; padding: 6px 16px; border-radius: 20px; font-weight: 600; font-size: 13px; margin-bottom: 16px; }
        h1 { font-size: 22px; margin: 0 0 12px 0; color: #F8FAFC; }
        p { color: #94A3B8; font-size: 15px; line-height: 1.6; margin-bottom: 24px; }
        .btn { background: #10B981; color: #ffffff; padding: 12px 28px; border-radius: 10px; font-weight: bold; text-decoration: none; display: inline-block; font-size: 14px; transition: 0.2s; }
        .btn:hover { opacity: 0.9; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="badge">${decision.toUpperCase()}</div>
        <h1>${headline}</h1>
        <p>${message}</p>
        <div>
          <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/resources" class="btn">View Live on Portal</a>
        </div>
      </div>
    </body>
    </html>
  `);
});


/**
 * Grounded Student Support RAG Search (No Hallucinations)
 * POST /api/ai/support/query
 */
export const queryStudentSupport = asyncHandler(async (req, res) => {
  const { query } = req.body;
  const agent = orchestrator.agents.student_support;
  const result = await agent.execute({ query: query || '' });

  return new ApiResponse(200, result.result, 'Student support response generated').send(res);
});

/**
 * WhatsApp Two-Way Webhook (Meta Cloud API / Webhook Integration)
 * GET /api/ai/webhook/whatsapp (Meta Webhook Handshake)
 * POST /api/ai/webhook/whatsapp (Incoming Messages & Button Actions)
 */
export const handleWhatsAppWebhook = asyncHandler(async (req, res) => {
  // 1. Meta Webhook Handshake Verification
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || process.env.N8N_WEBHOOK_SECRET || 'taxman_whatsapp_token_2026';

    if (mode === 'subscribe' && token === expectedToken) {
      console.log('[WhatsAppWebhook] Handshake verified successfully.');
      return res.status(200).send(challenge);
    }
    return res.status(403).send('Verification failed.');
  }

  // 2. Process Incoming Message / Interactive Button
  const body = req.body || {};
  let fromNumber = body.from || body.phone || body.From || '';
  let messageText = body.text || body.message || body.Body || '';
  let buttonPayload = body.buttonPayload || body.payload || body.buttonId || '';

  // Parse Meta Graph API Payload Structure if present
  if (body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
    const metaMsg = body.entry[0].changes[0].value.messages[0];
    fromNumber = metaMsg.from;
    if (metaMsg.type === 'text') {
      messageText = metaMsg.text.body;
    } else if (metaMsg.type === 'interactive') {
      buttonPayload = metaMsg.interactive?.button_reply?.id || metaMsg.interactive?.list_reply?.id || '';
    } else if (metaMsg.type === 'button') {
      buttonPayload = metaMsg.button?.payload || '';
    }
  }

  const result = await processIncomingWhatsAppMessage({
    from: fromNumber,
    text: messageText,
    buttonPayload
  });

  return new ApiResponse(200, result, 'WhatsApp message processed successfully.').send(res);
});

/**
 * Secured Webhook for n8n Autonomous Workflow Execution & Two-Way Relay
 * POST /api/ai/webhook/n8n
 */
export const handleN8nWebhook = asyncHandler(async (req, res) => {
  const webhookSecret = req.headers['x-n8n-webhook-secret'] || req.query.secret;
  const expectedSecret = process.env.N8N_WEBHOOK_SECRET || 'n8n_taxman_secret_2026';

  if (webhookSecret !== expectedSecret && process.env.NODE_ENV === 'production') {
    throw new ApiError(401, 'Unauthorized: Invalid n8n webhook secret.');
  }

  const { action = 'morning_research_scan', commandText, message, from, buttonPayload } = req.body;

  // If n8n forwarded an incoming WhatsApp message/reply
  if (message || buttonPayload || from) {
    const replyResult = await processIncomingWhatsAppMessage({
      from: from || '+923269754249',
      text: message || commandText || '',
      buttonPayload: buttonPayload || ''
    });
    return new ApiResponse(200, replyResult, 'n8n two-way message handled.').send(res);
  }

  let executionCommand = commandText;
  if (!executionCommand) {
    if (action === 'morning_research_scan') {
      executionCommand = 'Research new ACCA and CA resources, find upcoming events, check duplicate entries and enqueue for approval.';
    } else if (action === 'weekly_analytics_report') {
      executionCommand = 'Analyze platform performance and calculate high-demand student subjects.';
    } else if (action === 'expired_events_cleanup') {
      const cleanResult = await orchestrator.runSingleAgent('event', { action: 'cleanup_expired' });
      return new ApiResponse(200, cleanResult, 'Expired events cleaned up via n8n webhook.').send(res);
    } else {
      executionCommand = 'Run Full AI Scan across approved sources.';
    }
  }

  const result = await orchestrator.executeCommand({
    commandText: executionCommand,
    triggeredBy: 'n8n_webhook'
  });

  return new ApiResponse(200, result, 'n8n autonomous trigger executed successfully.').send(res);
});

/**
 * Get Telemetry & Real Delivery Verification Status
 * GET /api/ai/telemetry/status
 */
export const getTelemetryStatusController = asyncHandler(async (req, res) => {
  const telemetry = getTelemetryDeliveryStatus();
  const settings = await getOrCreateAISettings();

  const data = {
    telemetry,
    scheduler: {
      status: settings.schedulerEnabled ? 'ACTIVE' : 'PAUSED',
      scheduleCron: settings.scheduleCron,
      scheduledTime: settings.scheduledTime,
      scheduleFrequency: settings.scheduleFrequency,
      timezone: settings.timezone,
      nextRunAt: settings.nextRunAt || calculateNextRunTime(settings),
      lastRunAt: settings.lastRunAt,
      lastRunStatus: settings.lastRunStatus
    }
  };

  return new ApiResponse(200, data, 'Telemetry and delivery status retrieved.').send(res);
});

/**
 * Get All Research Sources
 * GET /api/ai/sources
 */
export const getResearchSources = asyncHandler(async (req, res) => {
  await seedDefaultResearchSources();
  const sources = await ResearchSource.find().sort({ priority: 1, createdAt: -1 });
  return new ApiResponse(200, sources, 'Research sources retrieved.').send(res);
});

/**
 * Create New Research Source
 * POST /api/ai/sources
 */
export const createResearchSource = asyncHandler(async (req, res) => {
  const { name, url, category = 'Official', qualification = 'Both', sourceType = 'Web Page', priority = 'High', scanFrequency = 'Daily' } = req.body;
  if (!name || !url) {
    throw new ApiError(400, 'Source name and valid URL are required.');
  }

  const existing = await ResearchSource.findOne({ url: url.trim() });
  if (existing) {
    throw new ApiError(409, 'A research source with this URL already exists.');
  }

  const source = await ResearchSource.create({
    name: name.trim(),
    url: url.trim(),
    category,
    qualification,
    sourceType,
    priority,
    scanFrequency,
    isActive: true
  });

  return new ApiResponse(201, source, 'Research source added successfully.').send(res);
});

/**
 * Update Research Source (edit / toggle active status)
 * PUT /api/ai/sources/:id
 */
export const updateResearchSource = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const source = await ResearchSource.findByIdAndUpdate(id, updates, { new: true });
  if (!source) {
    throw new ApiError(404, 'Research source not found.');
  }

  return new ApiResponse(200, source, 'Research source updated.').send(res);
});

/**
 * Delete Research Source
 * DELETE /api/ai/sources/:id
 */
export const deleteResearchSource = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await ResearchSource.findByIdAndDelete(id);
  if (!deleted) {
    throw new ApiError(404, 'Research source not found.');
  }

  return new ApiResponse(200, { id }, 'Research source deleted.').send(res);
});

/**
 * Scan Single External Source On-Demand
 * POST /api/ai/sources/:id/scan
 */
export const scanSingleSource = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const source = await ResearchSource.findById(id);
  if (!source) {
    throw new ApiError(404, 'Research source not found.');
  }

  const fetchResult = await fetchExternalWebPage(source.url);
  if (!fetchResult.success) {
    source.lastError = fetchResult.error;
    source.errorCount = (source.errorCount || 0) + 1;
    source.lastScannedAt = new Date();
    await source.save();
    return new ApiResponse(200, { source, success: false, error: fetchResult.error, discoveriesCount: 0 }, `Remote site unreachable: ${fetchResult.error}`).send(res);
  }

  const { cleanText, hash } = parseHtmlContent(fetchResult.html);
  const rawDiscoveries = await extractDiscoveriesWithAI({
    rawText: cleanText,
    sourceUrl: source.url,
    sourceName: source.name,
    qualification: source.qualification
  });

  const newDiscoveries = [];
  for (const disc of rawDiscoveries) {
    const decision = await evaluateDiscoveryDecision(disc);
    if (!decision.duplicate) {
      const saved = await ResearchItem.create({
        title: disc.title,
        summary: disc.summary,
        category: disc.category,
        qualification: disc.qualification,
        source: disc.source,
        sourceUrl: disc.sourceUrl,
        confidence: disc.confidence,
        status: 'New',
        aiRecommendation: disc.aiRecommendation,
        rawContent: disc.summary
      });
      newDiscoveries.push(saved);
    }
  }

  source.contentFingerprint = hash;
  source.lastScannedAt = new Date();
  source.lastSuccessAt = new Date();
  source.lastError = null;
  source.totalDiscoveriesFound = (source.totalDiscoveriesFound || 0) + newDiscoveries.length;
  await source.save();

  return new ApiResponse(
    200,
    { source, discoveriesCount: newDiscoveries.length, discoveries: newDiscoveries },
    `Source scanned: ${newDiscoveries.length} new items discovered.`
  ).send(res);
});

/**
 * Get Autonomous AI Settings
 * GET /api/ai/settings
 */
export const getAISettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateAISettings();
  return new ApiResponse(200, settings, 'AI settings retrieved.').send(res);
});

/**
 * Update Autonomous AI Settings
 * PUT /api/ai/settings
 */
export const updateAISettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateAISettings();
  const updates = req.body || {};

  if (updates.schedulerEnabled !== undefined) settings.schedulerEnabled = Boolean(updates.schedulerEnabled);
  if (updates.scheduleCron) settings.scheduleCron = updates.scheduleCron;
  if (updates.scheduledTime) settings.scheduledTime = updates.scheduledTime;
  if (updates.scheduleFrequency) settings.scheduleFrequency = updates.scheduleFrequency;
  if (updates.scheduledDate !== undefined) settings.scheduledDate = updates.scheduledDate;
  if (updates.scheduledDays) settings.scheduledDays = updates.scheduledDays;
  if (updates.timezone) settings.timezone = updates.timezone;

  if (updates.autonomyLevel) settings.autonomyLevel = parseInt(updates.autonomyLevel, 10);
  if (updates.confidenceThresholdAuto) settings.confidenceThresholdAuto = parseFloat(updates.confidenceThresholdAuto);
  if (updates.confidenceThresholdDraft) settings.confidenceThresholdDraft = parseFloat(updates.confidenceThresholdDraft);
  if (updates.maxDailyActions) settings.maxDailyActions = parseInt(updates.maxDailyActions, 10);
  if (updates.autoArchiveExpiredEvents !== undefined) settings.autoArchiveExpiredEvents = Boolean(updates.autoArchiveExpiredEvents);

  if (updates.notificationChannels) {
    settings.notificationChannels = { ...settings.notificationChannels, ...updates.notificationChannels };
  }

  if (updates.notificationRecipients) {
    settings.notificationRecipients = { ...settings.notificationRecipients, ...updates.notificationRecipients };
  }

  await settings.save();

  // Reschedule background worker with new settings
  await rescheduleAutonomousWorker();

  return new ApiResponse(200, settings, 'AI settings and schedule updated successfully.').send(res);
});

/**
 * Get Daily AI Intelligence Reports
 * GET /api/ai/reports
 */
export const getDailyReportsList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;

  const total = await AIDailyReport.countDocuments();
  const reports = await AIDailyReport.find()
    .sort({ createdAt: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .lean();

  return new ApiResponse(200, reports, 'Daily reports retrieved.', {
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum) || 1
  }).send(res);
});

/**
 * Trigger Autonomous Daily Operations Cycle On-Demand
 * POST /api/ai/scheduler/trigger-now
 */
export const triggerAutonomousCycleNow = asyncHandler(async (req, res) => {
  const result = await runAutonomousDailyCycle('Admin On-Demand Trigger');
  return new ApiResponse(200, result, 'Autonomous research cycle completed.').send(res);
});

/**
 * Test External Notification (Email & WhatsApp)
 * POST /api/ai/notifications/test
 */
export const testExternalNotification = asyncHandler(async (req, res) => {
  const { email = 'muhammadahsaniftikaharahmad@gmail.com', phone = '03269754249' } = req.body;

  const sampleReport = {
    date: new Date().toISOString().split('T')[0],
    sourcesScanned: 5,
    discoveriesCount: 3,
    duplicatesCount: 2,
    newResourcesCount: 1,
    newEventsCount: 1,
    pendingApprovalsCount: 2,
    autoActionsCount: 1,
    summaryText: 'Test autonomous cycle intelligence report successfully generated by AI Digital Employee.'
  };

  const dispatchResult = await sendDailyReportNotification({
    report: sampleReport,
    recipientEmail: email,
    recipientPhone: phone
  });

  return new ApiResponse(200, dispatchResult, `Test notification dispatched to ${email} and ${phone}.`).send(res);
});

