import { AITask } from '../../models/AITask.js';
import { AIActivityLog } from '../../models/AIActivityLog.js';
import { ResearchAgent } from './research.agent.js';
import { ResourceAgent } from './resource.agent.js';
import { EventAgent } from './event.agent.js';
import { ContentAgent } from './content.agent.js';
import { SEOAgent } from './seo.agent.js';
import { StudentSupportAgent } from './studentSupport.agent.js';
import { AnalyticsAgent } from './analytics.agent.js';
import { NotificationAgent } from './notification.agent.js';
import { SocialMediaAgent } from './socialMedia.agent.js';
import { DatabaseManagementAgent } from './dbManagement.agent.js';

export class AIOrchestrator {
  constructor() {
    this.agents = {
      research: new ResearchAgent(),
      resource: new ResourceAgent(),
      event: new EventAgent(),
      content: new ContentAgent(),
      seo: new SEOAgent(),
      student_support: new StudentSupportAgent(),
      analytics: new AnalyticsAgent(),
      notification: new NotificationAgent(),
      social_media: new SocialMediaAgent(),
      database_management: new DatabaseManagementAgent()
    };
  }

  getAgentList() {
    return Object.values(this.agents).map((agent) => ({
      id: agent.id,
      name: agent.name,
      description: agent.description,
      status: agent.status
    }));
  }

  /**
   * Parse natural language command and formulate execution plan
   */
  planCommand(commandText = '') {
    const text = commandText.toLowerCase();
    const plan = [];
    const targetAgents = [];

    const isBlogOrArticleRequest =
      text.includes('blog') ||
      text.includes('article') ||
      text.includes('write') ||
      text.includes('create a public') ||
      text.includes('seo-optimized blog') ||
      text.includes('content');

    // Extract dynamic topic / title from command
    let extractedTopic = '';
    let extractedCategory = 'Big 4 & Inductions';

    if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('tech') || text.includes('trends in ai')) {
      extractedTopic = 'Trends in AI & Accounting for CA & ACCA Students';
      extractedCategory = 'AI & Accounting';
    } else if (text.includes('tax') || text.includes('ordinance') || text.includes('fbr')) {
      extractedTopic = 'Taxation & Statutory Compliance';
      extractedCategory = 'Taxation';
    } else if (text.includes('audit') || text.includes('isa') || text.includes('ifrs')) {
      extractedTopic = 'Audit & Financial Reporting Mastery';
      extractedCategory = 'Financial Reporting';
    } else if (text.includes('induction') || text.includes('partner round') || text.includes('interview')) {
      extractedTopic = 'Top Technical Questions in Big 4 Partner Rounds';
      extractedCategory = 'Big 4 & Inductions';
    } else if (text.includes('leadership') || text.includes('career') || text.includes('mentor')) {
      extractedTopic = 'Strategic Leadership & Professional Ethics for Trainees';
      extractedCategory = 'Career & Leadership';
    } else {
      extractedTopic = commandText.length > 50 ? commandText.slice(0, 50) + '...' : commandText;
    }

    // 1. If it's a dedicated Blog/Article Request:
    if (isBlogOrArticleRequest) {
      // Step 1: Optional quick research on topic if requested
      if (text.includes('research') || text.includes('fact-check') || text.includes('source')) {
        plan.push({
          step: plan.length + 1,
          agent: 'research',
          action: 'run_research',
          input: {
            query: extractedTopic,
            qualification: text.includes('acca') ? 'ACCA' : text.includes('ca') ? 'CA' : 'Both',
            limit: 3
          }
        });
        targetAgents.push('research');
      }

      // Step 2: Content Agent to generate the publication-ready article
      plan.push({
        step: plan.length + 1,
        agent: 'content',
        action: 'generate_article',
        input: {
          rawPrompt: commandText,
          title: extractedTopic,
          topic: extractedTopic,
          category: extractedCategory,
          targetAudience: 'CA & ACCA Students',
          tone: 'Authoritative, Practical & Engaging',
          requiresApproval: true
        }
      });
      targetAgents.push('content');

      // Step 3: SEO Agent
      plan.push({
        step: plan.length + 1,
        agent: 'seo',
        action: 'generate_seo',
        input: {
          title: extractedTopic,
          category: extractedCategory
        }
      });
      targetAgents.push('seo');

      // Step 4: Social Media posts
      plan.push({
        step: plan.length + 1,
        agent: 'social_media',
        action: 'generate_social_posts',
        input: {
          title: extractedTopic,
          requiresApproval: true
        }
      });
      targetAgents.push('social_media');
    } else {
      // General Research / Resource / Event Intent
      if (
        text.includes('research') ||
        text.includes('find') ||
        text.includes('search') ||
        text.includes('discover') ||
        text.includes('scan') ||
        text.includes('acca') ||
        text.includes('icap') ||
        text.includes('resources') ||
        text.includes('events')
      ) {
        const isEventOnly = text.includes('event') && !text.includes('resource') && !text.includes('material');

        if (!isEventOnly) {
          plan.push({
            step: plan.length + 1,
            agent: 'research',
            action: 'run_research',
            input: {
              query: commandText,
              qualification: text.includes('acca') ? 'ACCA' : text.includes('ca') || text.includes('icap') ? 'CA' : 'Both',
              limit: 4
            }
          });
          targetAgents.push('research');
        }

        if (text.includes('resource') || text.includes('material') || text.includes('draft') || text.includes('scan') || text.includes('find')) {
          plan.push({
            step: plan.length + 1,
            agent: 'resource',
            action: 'process_resource_draft',
            input: {
              title: text.includes('acca') ? 'ACCA Financial Reporting (FR) IAS 16 & IFRS 15 Summary Pack' : 'ICAP CAF 5 Financial Accounting & Reporting 1 Past Papers Solution',
              category: text.includes('acca') ? 'ACCA' : 'CAF',
              qualification: text.includes('acca') ? 'ACCA' : 'CA',
              description: 'Comprehensive study materials and exam technique breakdown prepared for students in Pakistan.',
              requiresApproval: true
            }
          });
          targetAgents.push('resource');
        }

        if (text.includes('event') || text.includes('webinar') || text.includes('workshop') || text.includes('scan')) {
          plan.push({
            step: plan.length + 1,
            agent: 'event',
            action: 'create_event_draft',
            input: {
              title: 'Big 4 Articleship Induction & Mock Partner Round 2026',
              desc: 'Exclusive Zoom interactive workshop on clearing partner rounds at PwC, EY, KPMG, and Deloitte.',
              date: '15 June 2026',
              time: '08:00 PM PST',
              speakerName: 'Saboor Ahmad CA',
              location: 'Live Zoom Meeting',
              requiresApproval: true
            }
          });
          targetAgents.push('event');
        }
      }

      // Analytics Intent
      if (text.includes('analytics') || text.includes('stats') || text.includes('performance') || text.includes('analyze') || text.includes('demand')) {
        plan.push({
          step: plan.length + 1,
          agent: 'analytics',
          action: 'compute_analytics',
          input: {}
        });
        targetAgents.push('analytics');
      }
    }

    // Default fallback if empty
    if (plan.length === 0) {
      plan.push({
        step: 1,
        agent: 'content',
        action: 'generate_article',
        input: {
          rawPrompt: commandText,
          title: extractedTopic,
          topic: extractedTopic,
          category: extractedCategory,
          requiresApproval: true
        }
      });
      targetAgents.push('content');
    }

    return {
      plan,
      targetAgents: [...new Set(targetAgents)]
    };
  }

  /**
   * Execute high-level command through the Orchestrator
   */
  async executeCommand(params, maybeTriggeredBy = 'admin', customUser = null) {
    let commandText = '';
    let triggeredBy = 'admin';
    let triggeredByUser = null;

    if (typeof params === 'string') {
      commandText = params;
      triggeredBy = maybeTriggeredBy || 'admin';
      triggeredByUser = customUser;
    } else if (params && typeof params === 'object') {
      commandText = params.commandText || '';
      triggeredBy = params.triggeredBy || 'admin';
      triggeredByUser = params.triggeredByUser || null;
    }

    const startTime = Date.now();
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const { plan, targetAgents } = this.planCommand(commandText);

    // Create persistent task record
    const taskRecord = await AITask.create({
      taskId,
      title: commandText && commandText.length > 80 ? `${commandText.slice(0, 80)}...` : (commandText || 'Orchestrator Run'),
      prompt: commandText,
      triggeredBy,
      triggeredByUser,
      status: 'running',
      targetAgents,
      plan: plan.map((p) => ({
        ...p,
        status: 'pending',
        startedAt: null,
        completedAt: null
      }))
    });

    const results = {};
    const executionLogs = [];
    let discoveredCount = 0;
    let createdCount = 0;
    let updatedCount = 0;
    let approvalsCount = 0;
    let errorsCount = 0;

    for (let i = 0; i < plan.length; i++) {
      const step = plan[i];
      const agent = this.agents[step.agent];

      if (!agent) {
        taskRecord.plan[i].status = 'failed';
        taskRecord.plan[i].error = `Unknown agent: ${step.agent}`;
        errorsCount++;
        continue;
      }

      taskRecord.plan[i].status = 'running';
      taskRecord.plan[i].startedAt = new Date();

      try {
        const stepResult = await agent.execute(step.input, { taskId, orchestrator: this });
        taskRecord.plan[i].completedAt = new Date();

        if (stepResult.success) {
          taskRecord.plan[i].status = 'completed';
          taskRecord.plan[i].output = stepResult.result;
          results[step.agent] = stepResult.result;

          // Compute summaries
          if (step.agent === 'research') {
            discoveredCount += stepResult.result.totalFound || 0;
          }
          if (step.agent === 'resource' || step.agent === 'event' || step.agent === 'content' || step.agent === 'social_media') {
            createdCount++;
            if (stepResult.result.requiresApproval || stepResult.result.approvalId) {
              approvalsCount++;
            }
          }
          if (step.agent === 'analytics') {
            updatedCount++;
          }
        } else {
          taskRecord.plan[i].status = 'failed';
          taskRecord.plan[i].error = stepResult.error;
          errorsCount++;
        }
      } catch (err) {
        taskRecord.plan[i].status = 'failed';
        taskRecord.plan[i].error = err.message;
        errorsCount++;
      }
    }

    const executionTimeMs = Date.now() - startTime;
    taskRecord.status = errorsCount > 0 && Object.keys(results).length === 0 ? 'failed' : 'completed';
    taskRecord.executionTimeMs = executionTimeMs;
    taskRecord.resultsSummary = {
      discovered: discoveredCount,
      created: createdCount,
      updated: updatedCount,
      approvalsNeeded: approvalsCount,
      errorsCount,
      overview: `Orchestrator completed ${plan.length} steps across ${targetAgents.length} agents in ${executionTimeMs}ms.`
    };
    taskRecord.resultData = results;

    await taskRecord.save();

    await AIActivityLog.create({
      agent: 'AI Orchestrator',
      taskId,
      action: 'ORCHESTRATOR_RUN_COMPLETED',
      toolUsed: 'executeCommand',
      input: { commandText, triggeredBy },
      output: taskRecord.resultsSummary,
      status: taskRecord.status === 'completed' ? 'success' : 'warning',
      durationMs: executionTimeMs
    });

    return {
      taskId,
      status: taskRecord.status,
      executionTimeMs,
      summary: {
        whatFound: discoveredCount > 0 ? `Discovered ${discoveredCount} authentic resources & updates.` : 'No new external items needed.',
        whatCreated: createdCount > 0 ? `Created ${createdCount} draft resources/events/articles.` : 'No new entities drafted.',
        whatChanged: updatedCount > 0 ? `Updated platform analytics and system indexes.` : 'Database maintained.',
        whatFailed: errorsCount > 0 ? `${errorsCount} sub-tasks encountered errors (logged in activity timeline).` : 'Zero errors encountered.',
        whatRequiresApproval: approvalsCount > 0 ? `${approvalsCount} items enqueued in AI Approval Queue for review.` : 'All actions processed.'
      },
      results,
      plan: taskRecord.plan
    };
  }

  /**
   * Run direct trigger for a single agent
   */
  async runSingleAgent(agentId, input = {}) {
    const agent = this.agents[agentId];
    if (!agent) {
      throw new Error(`Agent with ID "${agentId}" not found.`);
    }

    const taskId = `single_${agentId}_${Date.now()}`;
    return await agent.execute(input, { taskId });
  }
}

export const orchestrator = new AIOrchestrator();
