import { AIActivityLog } from '../../models/AIActivityLog.js';

/**
 * Base Agent with resilient logging, execution timer, and safety boundaries
 */
export class BaseAgent {
  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = 'idle'; // idle | working | completed | error
  }

  async logActivity({ taskId = '', action, toolUsed = '', input = {}, output = {}, status = 'info', error = null, durationMs = 0, actor = 'agent' }) {
    try {
      await AIActivityLog.create({
        agent: this.name,
        taskId,
        action,
        toolUsed,
        input,
        output,
        status,
        error: error ? (error.message || String(error)) : null,
        durationMs,
        actor
      });
    } catch (err) {
      console.warn(`[${this.name}] Activity logging failed:`, err.message);
    }
  }

  async execute(input = {}, context = {}) {
    const startTime = Date.now();
    this.status = 'working';
    const taskId = context.taskId || `task_${Date.now()}`;

    try {
      await this.logActivity({
        taskId,
        action: `${this.id.toUpperCase()}_STARTED`,
        input,
        status: 'info'
      });

      const result = await this.run(input, { ...context, taskId });
      const durationMs = Date.now() - startTime;
      this.status = 'idle';

      await this.logActivity({
        taskId,
        action: `${this.id.toUpperCase()}_COMPLETED`,
        output: result,
        durationMs,
        status: 'success'
      });

      return {
        success: true,
        agentId: this.id,
        agentName: this.name,
        durationMs,
        result
      };
    } catch (err) {
      const durationMs = Date.now() - startTime;
      this.status = 'error';

      await this.logActivity({
        taskId,
        action: `${this.id.toUpperCase()}_FAILED`,
        error: err,
        durationMs,
        status: 'error'
      });

      return {
        success: false,
        agentId: this.id,
        agentName: this.name,
        durationMs,
        error: err.message
      };
    }
  }

  /**
   * Abstract run method to be implemented by child agent
   */
  async run(input, context) {
    throw new Error(`Run method not implemented in ${this.name}`);
  }
}
