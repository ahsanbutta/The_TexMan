import { BaseAgent } from './base.agent.js';
import { createResourceTool, searchResources, updateResourceTool, deleteResourceTool, checkDuplicateResource } from '../aiTools/resourceTools.js';

export class ResourceAgent extends BaseAgent {
  constructor() {
    super('resource', 'Resource Agent', 'Manages, structures, categorizes, and validates CA and ACCA study materials.');
  }

  async run(input = {}, context = {}) {
    const { action = 'create', query = '', limit = 10 } = input;
    const resourceData = input.payload || input;

    if (action === 'search') {
      const results = await searchResources({ query, limit });
      return { action: 'search', count: results.length, resources: results };
    }

    if (action === 'check_duplicate') {
      const check = await checkDuplicateResource(resourceData);
      return { action: 'check_duplicate', ...check };
    }

    if (action === 'update' && resourceData.id) {
      return await updateResourceTool({
        id: resourceData.id,
        updates: resourceData.updates || resourceData,
        agentName: this.name,
        taskId: context.taskId
      });
    }

    if (action === 'delete' && resourceData.id) {
      return await deleteResourceTool({
        id: resourceData.id,
        agentName: this.name,
        taskId: context.taskId
      });
    }

    // Default: create resource draft
    const createResult = await createResourceTool({
      title: resourceData.title || 'CA / ACCA Study Material',
      description: resourceData.description || 'Comprehensive revision material for students.',
      category: resourceData.category || 'CAF',
      subject: resourceData.subject || '',
      qualification: resourceData.qualification || 'CA',
      resourceType: resourceData.resourceType || 'PDF',
      fileUrl: resourceData.fileUrl || resourceData.externalUrl || 'https://the-taxmans-capital.vercel.app',
      externalUrl: resourceData.externalUrl || '',
      author: resourceData.author || "The TaxMan's Capital Mentorship Team",
      tag: resourceData.tag || '',
      tags: resourceData.tags || [],
      requiresApproval: resourceData.requiresApproval !== undefined ? resourceData.requiresApproval : true,
      agentName: this.name,
      taskId: context.taskId
    });

    return createResult;
  }
}
