import { BaseAgent } from './base.agent.js';
import { checkDatabaseHealthTool } from '../aiTools/dbTools.js';

export class DatabaseManagementAgent extends BaseAgent {
  constructor() {
    super('database_management', 'Database Management Agent', 'Performs database diagnostics, health checks, and data maintenance.');
  }

  async run(input = {}, context = {}) {
    const health = await checkDatabaseHealthTool({
      agentName: this.name,
      taskId: context.taskId
    });

    return {
      message: 'Database health check completed.',
      health
    };
  }
}
