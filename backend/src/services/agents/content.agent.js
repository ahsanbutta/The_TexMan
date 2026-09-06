import { BaseAgent } from './base.agent.js';
import { generateContentDraft } from '../aiTools/contentTools.js';

export class ContentAgent extends BaseAgent {
  constructor() {
    super('content', 'Content Agent', 'Generates educational blog posts, news summaries, and resource descriptions.');
  }

  async run(input = {}, context = {}) {
    const {
      rawPrompt = '',
      title,
      category = 'Big 4 & Inductions',
      topic = '',
      targetAudience = 'CA & ACCA Students',
      tone = 'Professional & Practical',
      requiresApproval = true
    } = input;

    const draftResult = await generateContentDraft({
      rawPrompt,
      title,
      category,
      topic,
      targetAudience,
      tone,
      requiresApproval,
      agentName: this.name,
      taskId: context.taskId
    });

    return draftResult;
  }
}
