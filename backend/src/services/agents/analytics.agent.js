import { BaseAgent } from './base.agent.js';
import { getPlatformAnalyticsSummary } from '../aiTools/analyticsTools.js';

export class AnalyticsAgent extends BaseAgent {
  constructor() {
    super('analytics', 'Analytics Agent', 'Monitors platform KPIs, student engagement, high-demand subjects, and content performance.');
  }

  async run(input = {}, context = {}) {
    const summary = await getPlatformAnalyticsSummary({
      agentName: this.name,
      taskId: context.taskId
    });

    return {
      message: 'Platform analytics and actionable student demand insights generated successfully.',
      ...summary
    };
  }
}
