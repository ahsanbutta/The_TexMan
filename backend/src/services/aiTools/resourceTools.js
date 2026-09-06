import { Resource } from '../../models/Resource.js';
import { AIApproval } from '../../models/AIApproval.js';
import { AIActivityLog } from '../../models/AIActivityLog.js';
import { performMultiSignalDuplicateCheck } from './duplicateDetector.js';

/**
 * Validate a resource thoroughly using AI and duplicate detection algorithms
 */
export async function validateResourceWithAI({
  title = '',
  description = '',
  category = '',
  qualification = '',
  subject = '',
  source = '',
  sourceUrl = '',
  fileUrl = ''
}) {
  const urlToCheck = sourceUrl || fileUrl || '';
  
  // 1. Multi-signal Duplicate Detection
  const duplicateCheck = await performMultiSignalDuplicateCheck({
    title,
    sourceUrl: urlToCheck,
    category,
    qualification
  });

  const isDuplicate = duplicateCheck.isDuplicate;

  // 2. CA / ACCA Relevance Evaluation
  const textToCheck = `${title} ${description} ${subject} ${category} ${qualification}`.toLowerCase();
  const validKeywords = [
    'ca', 'acca', 'icap', 'prc', 'caf', 'cfap', 'scs', 'mfa', 'far', 'audit', 'tax', 'taxation',
    'law', 'corporate', 'finance', 'past paper', 'notes', 'induction', 'interview', 'firm', 'articleship',
    'study', 'syllabus', 'exam', 'accounting', 'ifrs', 'isa', 'cfa', 'chartered'
  ];
  const matchedKeywords = validKeywords.filter(k => textToCheck.includes(k));
  const isRelevant = matchedKeywords.length > 0 || ['CA', 'ACCA', 'Both'].includes(qualification);

  // 3. Source & URL Validity
  const isValidUrlFormat = !urlToCheck || /^(http|https):\/\/[^ "]+$/.test(urlToCheck);
  const sourceValid = isValidUrlFormat && (source.length > 0 || urlToCheck.length > 0);

  // 4. Content Completeness & Quality Scoring
  let score = 0.6; // Base score
  if (title.trim().length >= 5) score += 0.1;
  if (description.trim().length >= 15) score += 0.1;
  if (subject.trim().length >= 2) score += 0.05;
  if (category && category !== 'All') score += 0.05;
  if (sourceValid) score += 0.05;
  if (isRelevant) score += 0.05;
  if (isDuplicate) score -= 0.3;

  const confidence = Math.min(0.99, Math.max(0.4, Math.round(score * 100) / 100));

  let recommendation = 'approve';
  let validationNotes = 'Resource passed CA/ACCA quality and relevance criteria.';

  if (isDuplicate) {
    recommendation = 'needs_review';
    validationNotes = `Possible duplicate detected: Matched ${duplicateCheck.matchType} in existing ${duplicateCheck.matchedEntity?.collection || 'collection'}.`;
  } else if (!isRelevant) {
    recommendation = 'reject';
    validationNotes = 'Resource does not appear sufficiently relevant to CA/ACCA curriculum.';
  } else if (!sourceValid && urlToCheck.length > 0) {
    recommendation = 'needs_review';
    validationNotes = 'Source URL format is invalid or unreachable.';
  } else if (title.trim().length < 5 || description.trim().length < 10) {
    recommendation = 'needs_review';
    validationNotes = 'Title or description is too brief. Manual review advised.';
  }

  return {
    isRelevant,
    isDuplicate,
    duplicateDetails: duplicateCheck,
    sourceValid,
    confidence,
    recommendation,
    validationNotes,
    reviewedAt: new Date()
  };
}

/**
 * Search resources in the database
 */
export async function searchResources({ query = '', category = 'All', qualification = 'Both', limit = 10 }) {
  const filter = {};
  if (category && category !== 'All') {
    filter.category = category;
  }
  if (qualification && qualification !== 'Both') {
    filter.qualification = { $in: [qualification, 'Both'] };
  }
  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { subject: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ];
  }

  const resources = await Resource.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return resources;
}

/**
 * Check if a resource already exists based on title or download fileUrl
 */
export async function checkDuplicateResource({ title, fileUrl = '', externalUrl = '' }) {
  const cleanTitle = (title || '').trim().toLowerCase();
  
  const existing = await Resource.findOne({
    $or: [
      { title: { $regex: `^${cleanTitle}$`, $options: 'i' } },
      ...(fileUrl ? [{ fileUrl: fileUrl.trim() }] : []),
      ...(externalUrl ? [{ externalUrl: externalUrl.trim() }] : [])
    ]
  }).lean();

  return {
    isDuplicate: !!existing,
    matchedResource: existing || null
  };
}

/**
 * Create a new resource directly or enqueue into AI Approval Queue
 */
export async function createResourceTool({
  title,
  description,
  category = 'CAF',
  subject = '',
  qualification = 'CA',
  resourceType = 'PDF',
  fileUrl = '',
  externalUrl = '',
  author = "The TaxMan's Capital Mentorship Team",
  tag = '',
  tags = [],
  requiresApproval = true,
  agentName = 'Resource Agent',
  taskId = ''
}) {
  const duplicateCheck = await checkDuplicateResource({ title, fileUrl, externalUrl });
  if (duplicateCheck.isDuplicate) {
    return {
      success: false,
      isDuplicate: true,
      message: `Duplicate resource found: "${duplicateCheck.matchedResource.title}"`,
      resource: duplicateCheck.matchedResource
    };
  }

  const payload = {
    title: title.trim(),
    description: description.trim(),
    category,
    subject: subject.trim(),
    qualification,
    resourceType,
    fileUrl: fileUrl || externalUrl || 'https://the-taxmans-capital.vercel.app',
    externalUrl: externalUrl || '',
    author,
    tag: tag || subject || category,
    tags: tags.length ? tags : [category, qualification, subject].filter(Boolean),
    published: !requiresApproval
  };

  if (requiresApproval) {
    const approvalItem = await AIApproval.create({
      type: 'Resource',
      title: payload.title,
      summary: `${payload.category} | ${payload.qualification} - ${payload.description.slice(0, 100)}...`,
      status: 'Pending',
      agent: agentName,
      taskId,
      confidence: 92,
      source: author,
      sourceUrl: payload.externalUrl || payload.fileUrl,
      payload
    });

    await AIActivityLog.create({
      agent: agentName,
      taskId,
      action: 'RESOURCE_DRAFT_CREATED_FOR_APPROVAL',
      toolUsed: 'createResourceTool',
      input: { title, category, qualification },
      output: { approvalId: approvalItem._id },
      status: 'success'
    });

    return {
      success: true,
      requiresApproval: true,
      approvalId: approvalItem._id,
      message: `Resource "${title}" created and sent to AI Approval Queue.`,
      payload
    };
  }

  const newResource = await Resource.create(payload);

  await AIActivityLog.create({
    agent: agentName,
    taskId,
    action: 'RESOURCE_PUBLISHED_DIRECTLY',
    toolUsed: 'createResourceTool',
    input: { title, category },
    output: { resourceId: newResource._id },
    status: 'success'
  });

  return {
    success: true,
    requiresApproval: false,
    resource: newResource,
    message: `Resource "${title}" published successfully.`
  };
}

/**
 * Update an existing resource
 */
export async function updateResourceTool({ id, updates = {}, agentName = 'Resource Agent', taskId = '' }) {
  const resource = await Resource.findByIdAndUpdate(id, updates, { new: true }).lean();
  if (!resource) {
    return { success: false, message: 'Resource not found' };
  }

  await AIActivityLog.create({
    agent: agentName,
    taskId,
    action: 'RESOURCE_UPDATED',
    toolUsed: 'updateResourceTool',
    input: { id, updates },
    output: { resourceId: id },
    status: 'success'
  });

  return { success: true, resource };
}

/**
 * Delete a resource
 */
export async function deleteResourceTool({ id, agentName = 'Resource Agent', taskId = '' }) {
  const deleted = await Resource.findByIdAndDelete(id).lean();
  if (!deleted) {
    return { success: false, message: 'Resource not found' };
  }

  await AIActivityLog.create({
    agent: agentName,
    taskId,
    action: 'RESOURCE_DELETED',
    toolUsed: 'deleteResourceTool',
    input: { id },
    output: { deletedId: id },
    status: 'warning'
  });

  return { success: true, message: `Resource "${deleted.title}" deleted.` };
}
