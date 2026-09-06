import { BaseAgent } from './base.agent.js';
import { generateSEOMetadata } from '../aiTools/contentTools.js';

export class SEOAgent extends BaseAgent {
  constructor() {
    super('seo', 'SEO Agent', 'Generates search-engine optimized meta titles, descriptions, and focus keywords.');
  }

  async run(input = {}, context = {}) {
    const { title = '', topic = '', category = 'Career', qualification = 'CA & ACCA' } = input;
    const seoData = generateSEOMetadata({ title, topic, category, qualification });

    return {
      success: true,
      seo: seoData,
      message: `SEO metadata generated for "${title || topic}".`
    };
  }
}
