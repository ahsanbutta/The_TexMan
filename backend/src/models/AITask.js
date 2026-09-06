import mongoose from 'mongoose';

const aiTaskSchema = new mongoose.Schema(
  {
    taskId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    prompt: {
      type: String,
      default: ''
    },
    triggeredBy: {
      type: String,
      enum: ['admin', 'user', 'n8n_webhook', 'cron', 'system'],
      default: 'admin'
    },
    triggeredByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    status: {
      type: String,
      enum: ['pending', 'running', 'completed', 'failed', 'cancelled'],
      default: 'pending',
      index: true
    },
    targetAgents: {
      type: [String],
      default: []
    },
    plan: [
      {
        step: Number,
        agent: String,
        action: String,
        status: {
          type: String,
          enum: ['pending', 'running', 'completed', 'failed', 'skipped'],
          default: 'pending'
        },
        input: mongoose.Schema.Types.Mixed,
        output: mongoose.Schema.Types.Mixed,
        error: String,
        startedAt: Date,
        completedAt: Date
      }
    ],
    resultsSummary: {
      discovered: { type: Number, default: 0 },
      created: { type: Number, default: 0 },
      updated: { type: Number, default: 0 },
      approvalsNeeded: { type: Number, default: 0 },
      errorsCount: { type: Number, default: 0 },
      overview: { type: String, default: '' }
    },
    resultData: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    errorMessage: {
      type: String,
      default: null
    },
    executionTimeMs: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

aiTaskSchema.index({ createdAt: -1 });

export const AITask = mongoose.model('AITask', aiTaskSchema);
export default AITask;
