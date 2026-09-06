import { BaseAgent } from './base.agent.js';
import { runResearchQuery } from '../aiTools/researchTools.js';

export class ResearchAgent extends BaseAgent {
  constructor() {
    super('research', 'Research Agent', 'Discovers new CA/ACCA resources, exam updates, syllabus changes, and webinars from approved sources.');
  }

  async run(input = {}, context = {}) {
    const { query = '', qualification = 'Both', category = '', limit = 5 } = input;
    const researchResults = await runResearchQuery({
      query,
      qualification,
      category,
      limit,
      agentName: this.name,
      taskId: context.taskId
    });

    return {
      message: `Research complete: ${researchResults.totalFound} items analyzed, ${researchResults.newSaved} new discoveries saved to Research Inbox.`,
      ...researchResults
    };
  }
}
