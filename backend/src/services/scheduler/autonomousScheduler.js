import cron from 'node-cron';
import { AISettings } from '../../models/AISettings.js';
import { AIDailyReport } from '../../models/AIDailyReport.js';
import { AIApproval } from '../../models/AIApproval.js';
import { AIActivityLog } from '../../models/AIActivityLog.js';
import { ResearchSource } from '../../models/ResearchSource.js';
import { ResearchItem } from '../../models/ResearchItem.js';
import { Event } from '../../models/Event.js';
import { Resource } from '../../models/Resource.js';
import {
  fetchExternalWebPage,
  parseHtmlContent,
  extractDiscoveriesWithAI,
  seedDefaultResearchSources
} from '../aiTools/externalCrawler.js';
import { evaluateDiscoveryDecision } from '../aiTools/duplicateDetector.js';
import { sendDailyReportNotification, sendApprovalAlert } from '../aiTools/externalNotifier.js';

let activeCronJob = null;
let isCycleRunning = false;

/**
 * Calculate next scheduled execution Date based on settings
 */
export function calculateNextRunTime(settings = {}) {
  const now = new Date();
  const timeStr = settings.scheduledTime || '09:00';
  const [hours, minutes] = timeStr.split(':').map((v) => parseInt(v, 10) || 0);

  if (settings.scheduleFrequency === 'specific_date' && settings.scheduledDate) {
    const target = new Date(`${settings.scheduledDate}T${timeStr}:00`);
    if (!isNaN(target.getTime())) {
      return target;
    }
  }

  const next = new Date(now);
  next.setHours(hours, minutes, 0, 0);

  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }

  if (settings.scheduleFrequency === 'weekdays') {
    while (next.getDay() === 0 || next.getDay() === 6) {
      next.setDate(next.getDate() + 1);
    }
  }

  return next;
}

/**
 * Get or initialize default AISettings
 */
export async function getOrCreateAISettings() {
  let settings = await AISettings.findOne();
  if (!settings) {
    settings = await AISettings.create({
      schedulerEnabled: true,
      scheduleCron: '0 9 * * *',
      scheduledTime: '09:00',
      scheduleFrequency: 'daily',
      scheduledDate: '',
      scheduledDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      autonomyLevel: 2,
      confidenceThresholdAuto: 0.95,
      confidenceThresholdDraft: 0.80,
      notificationChannels: { email: true, whatsapp: true, telegram: false, inApp: true },
      notificationRecipients: {
        email: 'muhammadahsaniftikaharahmad@gmail.com',
        phone: '03269754249',
        whatsappNumber: '+923269754249'
      },
      autoArchiveExpiredEvents: true
    });
  }

  // Ensure nextRunAt is computed if missing
  if (!settings.nextRunAt) {
    settings.nextRunAt = calculateNextRunTime(settings);
    await settings.save();
  }

  return settings;
}

/**
 * Execute the Complete Autonomous Research, Operational, and Reporting Cycle
 */
export async function runAutonomousDailyCycle(triggerSource = 'Scheduler') {
  if (isCycleRunning) {
    console.log('[AutonomousScheduler] Cycle already in progress. Skipping duplicate run.');
    return { success: false, message: 'Cycle already running.' };
  }

  isCycleRunning = true;
  const startTime = Date.now();
  const todayStr = new Date().toISOString().split('T')[0];
  console.log(`\n======================================================`);
  console.log(`🤖 STARTING AUTONOMOUS AI DIGITAL EMPLOYEE CYCLE [${triggerSource}]`);
  console.log(`📅 Date: ${todayStr} | Time: ${new Date().toLocaleTimeString()}`);
  console.log(`======================================================`);

  try {
    await seedDefaultResearchSources();
    const settings = await getOrCreateAISettings();
    const autonomyLevel = settings.autonomyLevel || 2;

    const sources = await ResearchSource.find({ isActive: true }).sort({ priority: 1 });
    let sourcesScanned = 0;
    let failedSourcesCount = 0;
    let discoveriesCount = 0;
    let duplicatesCount = 0;
    let newResourcesCount = 0;
    let newEventsCount = 0;
    let newAnnouncementsCount = 0;
    let pendingApprovalsCount = 0;
    let autoActionsCount = 0;
    const highlights = [];

    // 1. Scan External Configured Sources
    for (const src of sources) {
      try {
        console.log(`[AutonomousWorker] Crawling: ${src.name} (${src.url})...`);
        const fetchResult = await fetchExternalWebPage(src.url);

        if (!fetchResult.success) {
          failedSourcesCount++;
          src.lastError = fetchResult.error;
          src.errorCount = (src.errorCount || 0) + 1;
          src.lastScannedAt = new Date();
          await src.save();
          continue;
        }

        const { cleanText, hash } = parseHtmlContent(fetchResult.html);

        // Memory fingerprint check
        if (src.contentFingerprint && src.contentFingerprint === hash) {
          src.lastScannedAt = new Date();
          src.lastSuccessAt = new Date();
          await src.save();
          sourcesScanned++;
          continue;
        }

        // Semantic AI Extraction
        const discoveries = await extractDiscoveriesWithAI({
          rawText: cleanText,
          sourceUrl: src.url,
          sourceName: src.name,
          qualification: src.qualification
        });

        for (const disc of discoveries) {
          discoveriesCount++;
          const decision = await evaluateDiscoveryDecision(disc);

          if (decision.duplicate) {
            duplicatesCount++;
            continue;
          }

          // Check if already in ResearchInbox
          const existingItem = await ResearchItem.findOne({ sourceUrl: disc.sourceUrl, title: disc.title });
          if (existingItem) {
            duplicatesCount++;
            continue;
          }

          // Save to ResearchItem collection
          const savedResearch = await ResearchItem.create({
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

          // Process into Resource, Event, or Announcement draft
          const suggestedType = decision.contentType === 'event' ? 'Event' : decision.contentType === 'announcement' ? 'Announcement' : 'Resource';

          if (suggestedType === 'Resource') newResourcesCount++;
          if (suggestedType === 'Event') newEventsCount++;
          if (suggestedType === 'Announcement') newAnnouncementsCount++;

          // Autonomy Level Handling
          if (autonomyLevel >= 4 && disc.confidence >= (settings.confidenceThresholdAuto * 100)) {
            // Level 4: Auto-Publish Verified Low Risk Items
            if (suggestedType === 'Resource') {
              await Resource.create({
                title: savedResearch.title,
                description: savedResearch.summary,
                category: savedResearch.category || 'CAF',
                qualification: savedResearch.qualification || 'Both',
                resourceType: 'PDF',
                fileUrl: savedResearch.sourceUrl,
                externalUrl: savedResearch.sourceUrl,
                author: savedResearch.source,
                status: 'published',
                published: true
              });
            }
            autoActionsCount++;
            highlights.push(`Auto-published verified ${suggestedType}: "${savedResearch.title}"`);
          } else {
            // Level 1-3: Create Pending Approval in Queue
            const approval = await AIApproval.create({
              type: suggestedType,
              title: savedResearch.title,
              summary: `${savedResearch.category} | ${savedResearch.qualification} - ${savedResearch.summary.slice(0, 100)}...`,
              status: 'Pending',
              agent: 'Research Agent',
              confidence: savedResearch.confidence,
              source: savedResearch.source,
              sourceUrl: savedResearch.sourceUrl,
              targetEntityId: null,
              payload: {
                title: savedResearch.title,
                description: savedResearch.summary,
                category: savedResearch.category,
                qualification: savedResearch.qualification,
                fileUrl: savedResearch.sourceUrl,
                externalUrl: savedResearch.sourceUrl,
                author: savedResearch.source
              }
            });

            pendingApprovalsCount++;
            highlights.push(`New ${suggestedType} enqueued for review: "${savedResearch.title}"`);

            // Send instant approval notification if high confidence
            if (savedResearch.confidence >= 90) {
              await sendApprovalAlert({
                itemTitle: savedResearch.title,
                itemType: suggestedType,
                qualification: savedResearch.qualification,
                recipientEmail: settings.notificationRecipients?.email,
                recipientPhone: settings.notificationRecipients?.phone
              }).catch(() => {});
            }
          }
        }

        src.contentFingerprint = hash;
        src.lastScannedAt = new Date();
        src.lastSuccessAt = new Date();
        src.lastError = null;
        src.totalDiscoveriesFound = (src.totalDiscoveriesFound || 0) + discoveries.length;
        await src.save();
        sourcesScanned++;
      } catch (srcErr) {
        failedSourcesCount++;
        console.warn(`[AutonomousWorker] Error scanning source ${src.name}:`, srcErr.message);
      }
    }

    // 2. Auto-Archive Expired Events (if enabled)
    if (settings.autoArchiveExpiredEvents) {
      try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const expired = await Event.updateMany(
          { status: 'Upcoming', createdAt: { $lt: yesterday } },
          { $set: { status: 'Completed' } }
        );
        if (expired.modifiedCount > 0) {
          autoActionsCount += expired.modifiedCount;
          highlights.push(`Auto-archived ${expired.modifiedCount} completed event(s).`);
        }
      } catch (evtErr) {
        console.warn('[AutonomousWorker] Event archiving check warning:', evtErr.message);
      }
    }

    // 3. Generate Summary Text
    const summaryText = `Autonomous research completed in ${((Date.now() - startTime) / 1000).toFixed(1)}s. Scanned ${sourcesScanned} sources, found ${discoveriesCount} raw discoveries, filtered ${duplicatesCount} duplicates. Created ${newResourcesCount} resource drafts and ${newEventsCount} event drafts. Total ${pendingApprovalsCount} item(s) currently awaiting approval.`;

    // 4. Save AIDailyReport to Database
    const dailyReport = await AIDailyReport.create({
      date: todayStr,
      sourcesScanned,
      discoveriesCount,
      duplicatesCount,
      newResourcesCount,
      newEventsCount,
      newAnnouncementsCount,
      pendingApprovalsCount,
      autoActionsCount,
      failedSourcesCount,
      summaryText,
      highlights,
      details: {
        autonomyLevel,
        durationSeconds: ((Date.now() - startTime) / 1000).toFixed(1),
        triggerSource
      },
      sentToEmail: settings.notificationChannels?.email || false,
      sentToPhone: settings.notificationChannels?.whatsapp || false,
      status: failedSourcesCount === sources.length && sources.length > 0 ? 'Failed' : 'Success'
    });

    // 5. Dispatch External Notifications (WhatsApp & Email)
    if (settings.notificationChannels?.email || settings.notificationChannels?.whatsapp) {
      await sendDailyReportNotification({
        report: dailyReport,
        recipientEmail: settings.notificationRecipients?.email || 'muhammadahsaniftikaharahmad@gmail.com',
        recipientPhone: settings.notificationRecipients?.phone || '03269754249'
      });
    }

    // 6. Update Settings Metadata
    settings.lastRunAt = new Date();
    settings.nextRunAt = calculateNextRunTime(settings);
    settings.lastRunStatus = `Success (${discoveriesCount} found, ${pendingApprovalsCount} pending)`;
    await settings.save();

    await AIActivityLog.create({
      agent: 'Autonomous Scheduler',
      action: 'AUTONOMOUS_CYCLE_COMPLETED',
      toolUsed: 'runAutonomousDailyCycle',
      input: { triggerSource, date: todayStr },
      output: {
        sourcesScanned,
        discoveriesCount,
        duplicatesCount,
        pendingApprovalsCount,
        reportId: dailyReport._id
      },
      status: 'success'
    });

    console.log(`✅ AUTONOMOUS CYCLE FINISHED: ${summaryText}\n`);
    isCycleRunning = false;
    return { success: true, report: dailyReport, summaryText };
  } catch (err) {
    isCycleRunning = false;
    console.error('🔥 [AutonomousWorker] Fatal cycle error:', err);
    await AIActivityLog.create({
      agent: 'Autonomous Scheduler',
      action: 'AUTONOMOUS_CYCLE_FAILED',
      toolUsed: 'runAutonomousDailyCycle',
      input: { triggerSource },
      output: { error: err.message },
      status: 'failed'
    });
    return { success: false, error: err.message };
  }
}

/**
 * Compute valid Cron string from schedule settings
 */
export function buildCronExpression(settings = {}) {
  if (settings.scheduleFrequency === 'custom_cron' && settings.scheduleCron) {
    return settings.scheduleCron;
  }

  const timeStr = settings.scheduledTime || '09:00';
  const [h, m] = timeStr.split(':').map((v) => parseInt(v, 10) || 0);

  if (settings.scheduleFrequency === 'weekdays') {
    return `${m} ${h} * * 1-5`;
  }

  if (settings.scheduleFrequency === 'custom_days' && Array.isArray(settings.scheduledDays) && settings.scheduledDays.length > 0) {
    const dayMap = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
    const dayNums = settings.scheduledDays.map((d) => dayMap[d]).filter((d) => d !== undefined);
    if (dayNums.length > 0) {
      return `${m} ${h} * * ${dayNums.join(',')}`;
    }
  }

  // Default Daily
  return `${m} ${h} * * *`;
}

/**
 * Initialize Autonomous Background Scheduler
 */
export async function initializeAutonomousScheduler() {
  try {
    const settings = await getOrCreateAISettings();

    if (activeCronJob) {
      activeCronJob.stop();
      activeCronJob = null;
    }

    if (!settings.schedulerEnabled) {
      console.log('🛑 [AutonomousScheduler] Scheduler is disabled in settings.');
      return;
    }

    const cronPattern = buildCronExpression(settings);
    settings.scheduleCron = cronPattern;
    settings.nextRunAt = calculateNextRunTime(settings);
    await settings.save();

    console.log(`⏰ [AutonomousScheduler] Initializing AI Digital Employee Schedule: "${cronPattern}" (Time: ${settings.scheduledTime || '09:00'}, Timezone: ${settings.timezone || 'Asia/Karachi'})`);

    activeCronJob = cron.schedule(
      cronPattern,
      async () => {
        console.log(`\n⏰ [AutonomousScheduler] Scheduled Trigger Fired at ${new Date().toISOString()}`);
        await runAutonomousDailyCycle('Scheduled Calendar Trigger');
      },
      {
        timezone: settings.timezone || 'Asia/Karachi'
      }
    );

    console.log('🚀 [AutonomousScheduler] AI Digital Employee is active in background.');
  } catch (err) {
    console.error('🔥 [AutonomousScheduler] Initialization error:', err.message);
  }
}

/**
 * Reschedule with updated settings
 */
export async function rescheduleAutonomousWorker() {
  if (activeCronJob) {
    activeCronJob.stop();
    activeCronJob = null;
  }
  await initializeAutonomousScheduler();
}
