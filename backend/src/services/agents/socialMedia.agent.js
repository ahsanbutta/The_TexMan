import { BaseAgent } from './base.agent.js';
import { generateSocialMediaPosts } from '../aiTools/contentTools.js';
import { AIApproval } from '../../models/AIApproval.js';

export class SocialMediaAgent extends BaseAgent {
  constructor() {
    super('social_media', 'Social Media Agent', 'Drafts high-engagement posts for LinkedIn, Facebook, Instagram, and X with hooks and hashtags.');
  }

  async run(input = {}, context = {}) {
    const { title = 'New CA & ACCA Resources Released', link = 'https://the-taxmans-capital.vercel.app', category = 'Study Resources', requiresApproval = true } = input;
    
    const postBundle = generateSocialMediaPosts({ title, link, category });

    if (requiresApproval) {
      const approvalItem = await AIApproval.create({
        type: 'SocialPost',
        title: `Social Media Bundle: ${title}`,
        summary: `Multi-channel post for LinkedIn, X, Facebook, and Instagram`,
        status: 'Pending',
        agent: this.name,
        taskId: context.taskId,
        confidence: 95,
        source: "The TaxMan's Capital Social Desk",
        payload: postBundle
      });

      return {
        success: true,
        requiresApproval: true,
        approvalId: approvalItem._id,
        postBundle,
        message: 'Social media draft bundle created and enqueued for admin review before publishing.'
      };
    }

    return {
      success: true,
      requiresApproval: false,
      postBundle,
      message: 'Social media draft generated.'
    };
  }
}
