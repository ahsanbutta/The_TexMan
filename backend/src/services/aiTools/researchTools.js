import { ResearchSource } from '../../models/ResearchSource.js';
import { ResearchItem } from '../../models/ResearchItem.js';
import { AIActivityLog } from '../../models/AIActivityLog.js';
import { AIApproval } from '../../models/AIApproval.js';
import {
  seedDefaultResearchSources,
  fetchExternalWebPage,
  parseHtmlContent,
  extractDiscoveriesWithAI
} from './externalCrawler.js';
import { evaluateDiscoveryDecision } from './duplicateDetector.js';

/**
 * Execute real external autonomous research across configured active sources
 */
export async function runResearchQuery({
  query = '',
  qualification = 'Both',
  category = '',
  limit = 5,
  autonomyLevel = 2,
  agentName = 'Research Agent',
  taskId = ''
}) {
  const startTime = Date.now();
  await seedDefaultResearchSources();

  // Find active research sources
  const sourceFilter = { isActive: true };
  if (qualification && qualification !== 'Both') {
    sourceFilter.qualification = { $in: [qualification, 'Both'] };
  }
  if (category && category !== 'All') {
    sourceFilter.category = category;
  }

  const sources = await ResearchSource.find(sourceFilter).sort({ priority: 1, createdAt: -1 });
  const totalSourcesCount = sources.length;

  const discoveredItems = [];
  const autoDraftsCreated = [];
  let duplicatesCount = 0;
  let skippedMemoryCount = 0;
  let successfulSourcesCount = 0;

  for (const src of sources) {
    try {
      // 1. Fetch live web page
      const fetchResult = await fetchExternalWebPage(src.url);

      if (!fetchResult.success) {
        src.lastError = fetchResult.error;
        src.errorCount = (src.errorCount || 0) + 1;
        src.lastScannedAt = new Date();
        await src.save();

        await AIActivityLog.create({
          agent: agentName,
          taskId,
          action: 'SOURCE_FETCH_WARNING',
          toolUsed: 'runResearchQuery',
          input: { url: src.url, name: src.name },
          output: { error: fetchResult.error },
          status: 'warning'
        });
        continue;
      }

      // 2. Parse HTML & check memory hash
      const { cleanText, hash } = parseHtmlContent(fetchResult.html);

      if (src.contentFingerprint && src.contentFingerprint === hash && !query) {
        skippedMemoryCount++;
        src.lastScannedAt = new Date();
        src.lastSuccessAt = new Date();
        await src.save();
        continue;
      }

      // 3. Extract structured discoveries with AI
      const rawDiscoveries = await extractDiscoveriesWithAI({
        rawText: cleanText,
        sourceUrl: src.url,
        sourceName: src.name,
        qualification: src.qualification
      });

      // 4. Evaluate each discovery through Duplicate & Decision Engine
      for (const disc of rawDiscoveries) {
        const decision = await evaluateDiscoveryDecision(disc);

        if (decision.duplicate) {
          duplicatesCount++;
          continue;
        }

        // Check if already in ResearchItem collection by URL
        const existingResearch = await ResearchItem.findOne({ sourceUrl: disc.sourceUrl, title: disc.title });
        if (existingResearch) {
          duplicatesCount++;
          continue;
        }

        const savedItem = await ResearchItem.create({
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

        discoveredItems.push(savedItem);

        // Autonomy Level 2+: Auto-create draft in AI Approval Queue
        if (autonomyLevel >= 2 && decision.recommendation === 'create_draft') {
          const approvalType = decision.contentType === 'event' ? 'Event' : decision.contentType === 'announcement' ? 'Announcement' : 'Resource';

          const draftItem = await AIApproval.create({
            type: approvalType,
            title: savedItem.title,
            summary: savedItem.summary,
            status: 'Pending',
            agent: agentName,
            taskId,
            confidence: savedItem.confidence,
            source: savedItem.source,
            sourceUrl: savedItem.sourceUrl,
            payload: {
              title: savedItem.title,
              description: savedItem.summary,
              category: savedItem.category,
              qualification: savedItem.qualification,
              fileUrl: savedItem.sourceUrl,
              externalUrl: savedItem.sourceUrl,
              author: savedItem.source,
              published: false
            }
          });

          autoDraftsCreated.push(draftItem);
        }
      }

      // Update source telemetry
      src.contentFingerprint = hash;
      src.lastScannedAt = new Date();
      src.lastSuccessAt = new Date();
      src.lastError = null;
      src.totalDiscoveriesFound = (src.totalDiscoveriesFound || 0) + rawDiscoveries.length;
      await src.save();
      successfulSourcesCount++;
    } catch (err) {
      console.warn(`[ResearchAgent] Error scanning source "${src.name}":`, err.message);
      src.lastError = err.message;
      src.errorCount = (src.errorCount || 0) + 1;
      src.lastScannedAt = new Date();
      await src.save();
    }
  }

  const durationMs = Date.now() - startTime;

  await AIActivityLog.create({
    agent: agentName,
    taskId,
    action: 'AUTONOMOUS_EXTERNAL_RESEARCH_COMPLETED',
    toolUsed: 'runResearchQuery',
    input: { totalSources: totalSourcesCount, qualification, category },
    output: {
      sourcesScanned: successfulSourcesCount,
      newDiscoveries: discoveredItems.length,
      duplicatesFiltered: duplicatesCount,
      memorySkips: skippedMemoryCount,
      autoDraftsQueued: autoDraftsCreated.length
    },
    status: 'success',
    durationMs
  });

  return {
    success: true,
    totalSources: totalSourcesCount,
    sourcesScanned: successfulSourcesCount,
    totalFound: discoveredItems.length,
    newSaved: discoveredItems.length,
    duplicates: duplicatesCount,
    memorySkips: skippedMemoryCount,
    autoDraftsCreated: autoDraftsCreated.length,
    items: discoveredItems,
    durationMs
  };
}

/**
 * Fetch Research Inbox with filtering
 */
export async function getResearchInbox({ status = '', qualification = '', category = '', page = 1, limit = 15 }) {
  const filter = {};
  if (status && status !== 'All') filter.status = status;
  if (qualification && qualification !== 'Both') filter.qualification = { $in: [qualification, 'Both'] };
  if (category && category !== 'All') filter.category = category;

  const total = await ResearchItem.countDocuments(filter);
  const items = await ResearchItem.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return {
    items,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit) || 1
    }
  };
}
