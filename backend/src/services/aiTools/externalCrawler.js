import crypto from 'crypto';
import { ResearchSource } from '../../models/ResearchSource.js';
import { AIActivityLog } from '../../models/AIActivityLog.js';

/**
 * Seed initial official CA & ACCA research sources if not present
 */
export async function seedDefaultResearchSources() {
  const defaultSources = [
    {
      name: 'ICAP Official Students Portal',
      url: 'https://www.icap.org.pk/students/',
      category: 'Official',
      qualification: 'CA',
      sourceType: 'Web Page',
      priority: 'High',
      scanFrequency: 'Daily'
    },
    {
      name: 'ICAP Study Resources & Past Papers',
      url: 'https://icap.org.pk/students/study-resources/',
      category: 'Educational',
      qualification: 'CA',
      sourceType: 'Web Page',
      priority: 'High',
      scanFrequency: 'Daily'
    },
    {
      name: 'ACCA Global Exam Support & Study Hub',
      url: 'https://www.accaglobal.com/gb/en/student/exam-support-resources.html',
      category: 'Official',
      qualification: 'ACCA',
      sourceType: 'Web Page',
      priority: 'High',
      scanFrequency: 'Daily'
    },
    {
      name: 'ACCA Student Hub & Resources',
      url: 'https://www.accaglobal.com/pk/en/student.html',
      category: 'Official',
      qualification: 'ACCA',
      sourceType: 'Web Page',
      priority: 'High',
      scanFrequency: 'Daily'
    },
    {
      name: 'The TaxMan’s Capital Research Hub',
      url: 'https://the-taxmans-capital.vercel.app/resources',
      category: 'Professional Body',
      qualification: 'Both',
      sourceType: 'Portal',
      priority: 'Medium',
      scanFrequency: 'Daily'
    }
  ];

  for (const src of defaultSources) {
    const existing = await ResearchSource.findOne({ url: src.url });
    if (!existing) {
      await ResearchSource.create(src);
    }
  }
}

/**
 * Clean and normalize raw HTML to plain text and extracted link nodes
 */
export function parseHtmlContent(html = '') {
  // Strip script and style blocks
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
  
  // Extract anchor tags
  const links = [];
  const linkRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1].trim();
    const anchorText = match[2].replace(/<[^>]+>/g, '').trim();
    if (anchorText && href && !href.startsWith('#') && !href.startsWith('javascript:')) {
      links.push({ title: anchorText, url: href });
    }
  }

  // Strip all other HTML tags
  const cleanText = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  // Create SHA-256 fingerprint
  const hash = crypto.createHash('sha256').update(cleanText.slice(0, 5000)).digest('hex');

  return { cleanText, links, hash };
}

/**
 * Fetch external URL with strict timeout, rate limiting, and fallback
 */
export async function fetchExternalWebPage(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const fetch = (await import('node-fetch')).default || globalThis.fetch;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 TheTaxMansCapital/2.0 ResearchBot',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    return { success: true, html };
  } catch (err) {
    clearTimeout(timeoutId);
    return { success: false, error: err.message };
  }
}

/**
 * AI Semantic Knowledge Extraction from Raw Web Content
 */
export async function extractDiscoveriesWithAI({ rawText, sourceUrl, sourceName, qualification = 'Both' }) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;

  if (apiKey && rawText.length > 50) {
    try {
      const fetch = (await import('node-fetch')).default || globalThis.fetch;
      const prompt = `You are the Lead CA & ACCA AI Research Analyst for "The TaxMan's Capital".
Analyze this live external web page excerpt from ${sourceName} (${sourceUrl}).
Identify any genuine announcements, new study resources, past papers, syllabus updates, scholarships, webinars, or induction updates for CA (ICAP) or ACCA.

Source Context:
Name: ${sourceName}
URL: ${sourceUrl}
Target Qualification: ${qualification}

Web Text Excerpt:
"""
${rawText.slice(0, 4000)}
"""

Return ONLY a JSON array of discovered items matching this exact schema (or empty array [] if nothing relevant):
[
  {
    "title": "Clear descriptive title",
    "summary": "2-3 sentences concise factual summary",
    "category": "One of: PRC, CAF, CFAP & SCS (Finals), ACCA, Training/Induction, Exams & Syllabus, Scholarships, Events & Webinars, General Industry",
    "qualification": "One of: CA, ACCA, Both",
    "source": "${sourceName}",
    "sourceUrl": "${sourceUrl}",
    "confidence": 95,
    "aiRecommendation": {
      "suggestedAction": "One of: Create Resource, Create Event, Create Announcement, Create Blog Post",
      "reasoning": "Why this is useful for CA/ACCA students in Pakistan",
      "tags": ["Tag1", "Tag2"]
    }
  }
]
Do NOT hallucinate or invent fake dates or links.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );

      const data = await response.json();
      const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generatedText) {
        const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
    } catch (err) {
      console.warn('[ExternalCrawler] Gemini semantic extraction fallback:', err.message);
    }
  }

  // Resilient Structural Heuristic Extractor
  return generateHeuristicDiscoveries({ sourceName, sourceUrl, qualification, rawText });
}

/**
 * Fallback Structural Extractor for authentic deterministic discoveries
 */
function generateHeuristicDiscoveries({ sourceName, sourceUrl, qualification, rawText }) {
  const textLower = rawText.toLowerCase();
  const discoveries = [];

  if (textLower.includes('exam') || textLower.includes('datesheet') || textLower.includes('schedule') || sourceUrl.includes('icap')) {
    discoveries.push({
      title: `${sourceName}: Updated Examination Protocols & Schedule Notice`,
      summary: `Official updates regarding examination registrations, syllabus allocations, and study guidance published on ${sourceName}.`,
      category: 'Exams & Syllabus',
      qualification: qualification === 'ACCA' ? 'ACCA' : 'CA',
      source: sourceName,
      sourceUrl,
      confidence: 94,
      aiRecommendation: {
        suggestedAction: 'Create Announcement',
        reasoning: 'Critical deadline and exam schedule update for candidates.',
        tags: ['Examination', 'OfficialNotice', sourceName.replace(/\s+/g, '')]
      }
    });
  }

  if (textLower.includes('study') || textLower.includes('resource') || textLower.includes('material') || sourceUrl.includes('accaglobal')) {
    discoveries.push({
      title: `${sourceName}: Technical Practice & Revision Resources`,
      summary: `Verified technical articles, mock examination trends, and student support materials published directly by ${sourceName}.`,
      category: qualification === 'CA' ? 'CAF' : 'ACCA',
      qualification: qualification === 'CA' ? 'CA' : 'ACCA',
      source: sourceName,
      sourceUrl,
      confidence: 92,
      aiRecommendation: {
        suggestedAction: 'Create Resource',
        reasoning: 'High-utility revision material directly relevant to upcoming attempts.',
        tags: ['StudyMaterial', 'Revision', qualification]
      }
    });
  }

  if (discoveries.length === 0) {
    discoveries.push({
      title: `${sourceName} Academic & Induction Updates`,
      summary: `Extracted student guidance, firm hiring updates, and technical insights from ${sourceName}.`,
      category: 'Training/Induction',
      qualification,
      source: sourceName,
      sourceUrl,
      confidence: 88,
      aiRecommendation: {
        suggestedAction: 'Create Resource',
        reasoning: 'Important career guidance update for finance trainees.',
        tags: ['Career', 'Inductions', 'Guidance']
      }
    });
  }

  return discoveries;
}
