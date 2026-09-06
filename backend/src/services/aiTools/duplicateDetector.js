import { Resource } from '../../models/Resource.js';
import { Event } from '../../models/Event.js';
import { Announcement } from '../../models/Announcement.js';
import { Blog } from '../../models/Blog.js';
import { ResearchItem } from '../../models/ResearchItem.js';

/**
 * Calculate Jaccard word-overlap similarity ratio between two titles (0 to 1)
 */
export function calculateTitleSimilarity(titleA = '', titleB = '') {
  const normalize = (t) => t.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  const wordsA = new Set(normalize(titleA));
  const wordsB = new Set(normalize(titleB));

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  const intersection = new Set([...wordsA].filter((x) => wordsB.has(x)));
  const union = new Set([...wordsA, ...wordsB]);

  return intersection.size / union.size;
}

/**
 * Comprehensive multi-signal duplicate analysis across all platform collections
 */
export async function performMultiSignalDuplicateCheck({
  title = '',
  sourceUrl = '',
  category = '',
  qualification = ''
}) {
  const cleanTitle = (title || '').trim().toLowerCase();
  const cleanUrl = (sourceUrl || '').trim();

  // 1. Exact URL Match Check
  if (cleanUrl) {
    const [existingResource, existingEvent, existingBlog, existingResearch] = await Promise.all([
      Resource.findOne({ $or: [{ fileUrl: cleanUrl }, { externalUrl: cleanUrl }] }).lean(),
      Event.findOne({ meetingLink: cleanUrl }).lean(),
      Blog.findOne({ 'seo.canonicalUrl': cleanUrl }).lean(),
      ResearchItem.findOne({ sourceUrl: cleanUrl }).lean()
    ]);

    const matched = existingResource || existingEvent || existingBlog || existingResearch;
    if (matched) {
      return {
        isDuplicate: true,
        matchType: 'Exact URL Match',
        similarity: 1.0,
        matchedEntity: {
          id: matched._id,
          title: matched.title,
          collection: existingResource ? 'Resource' : existingEvent ? 'Event' : existingBlog ? 'Blog' : 'ResearchInbox'
        }
      };
    }
  }

  // 2. Exact Title Match Check
  const [exactRes, exactEvt, exactAnn] = await Promise.all([
    Resource.findOne({ title: { $regex: `^${cleanTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } }).lean(),
    Event.findOne({ title: { $regex: `^${cleanTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } }).lean(),
    Announcement.findOne({ title: { $regex: `^${cleanTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } }).lean()
  ]);

  const exactMatch = exactRes || exactEvt || exactAnn;
  if (exactMatch) {
    return {
      isDuplicate: true,
      matchType: 'Exact Title Match',
      similarity: 1.0,
      matchedEntity: {
        id: exactMatch._id,
        title: exactMatch.title,
        collection: exactRes ? 'Resource' : exactEvt ? 'Event' : 'Announcement'
      }
    };
  }

  // 3. High-Similarity Title Word Overlap Check
  const recentResources = await Resource.find().sort({ createdAt: -1 }).limit(50).select('title').lean();
  for (const r of recentResources) {
    const sim = calculateTitleSimilarity(title, r.title);
    if (sim >= 0.75) {
      return {
        isDuplicate: true,
        matchType: 'High Semantic Title Similarity',
        similarity: Math.round(sim * 100) / 100,
        matchedEntity: {
          id: r._id,
          title: r.title,
          collection: 'Resource'
        }
      };
    }
  }

  return {
    isDuplicate: false,
    matchType: 'None',
    similarity: 0,
    matchedEntity: null
  };
}

/**
 * AI Decision Engine for Discovered Knowledge Items
 */
export async function evaluateDiscoveryDecision(discoveryItem) {
  const duplicateCheck = await performMultiSignalDuplicateCheck(discoveryItem);

  const isRelevant = !discoveryItem.title.toLowerCase().includes('irrelevant') && discoveryItem.confidence >= 60;
  const isTrusted = discoveryItem.sourceUrl.includes('icap.org.pk') ||
                    discoveryItem.sourceUrl.includes('accaglobal.com') ||
                    discoveryItem.sourceUrl.includes('vercel.app') ||
                    discoveryItem.confidence >= 80;

  let recommendation = 'create_draft';
  if (duplicateCheck.isDuplicate) {
    recommendation = 'ignore_duplicate';
  } else if (!isRelevant) {
    recommendation = 'discard_irrelevant';
  } else if (!isTrusted || discoveryItem.confidence < 75) {
    recommendation = 'needs_verification';
  }

  return {
    relevant: isRelevant,
    trustedSource: isTrusted,
    duplicate: duplicateCheck.isDuplicate,
    duplicateDetails: duplicateCheck,
    contentType: discoveryItem.category === 'Events & Webinars' ? 'event' : discoveryItem.category === 'Exams & Syllabus' ? 'announcement' : 'resource',
    qualification: discoveryItem.qualification || 'Both',
    confidence: discoveryItem.confidence || 85,
    recommendation
  };
}
