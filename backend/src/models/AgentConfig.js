import mongoose from 'mongoose';

const agentConfigSchema = new mongoose.Schema(
  {
    agentId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    isEnabled: {
      type: Boolean,
      default: true
    },
    autoApproveConfidenceThreshold: {
      type: Number,
      default: 100 // 100 means require manual approval
    },
    temperature: {
      type: Number,
      default: 0.3
    },
    approvedSources: {
      type: [String],
      default: [
        'https://www.icap.org.pk',
        'https://www.accaglobal.com',
        'https://icap.org.pk/students/study-resources',
        'https://www.accaglobal.com/gb/en/student/exam-support-resources.html'
      ]
    },
    customPromptInstructions: {
      type: String,
      default: ''
    },
    executionSchedule: {
      type: String,
      default: '0 8 * * *' // e.g. every morning 8 AM
    },
    lastRunAt: {
      type: Date,
      default: null
    },
    lastRunStatus: {
      type: String,
      enum: ['idle', 'running', 'success', 'failed'],
      default: 'idle'
    }
  },
  {
    timestamps: true
  }
);

export const AgentConfig = mongoose.model('AgentConfig', agentConfigSchema);
