import mongoose from 'mongoose';

const aiActivityLogSchema = new mongoose.Schema(
  {
    agent: {
      type: String,
      required: true,
      index: true
    },
    taskId: {
      type: String,
      index: true,
      default: ''
    },
    action: {
      type: String,
      required: true
    },
    toolUsed: {
      type: String,
      default: ''
    },
    input: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    output: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    status: {
      type: String,
      enum: ['success', 'warning', 'error', 'info'],
      default: 'info',
      index: true
    },
    durationMs: {
      type: Number,
      default: 0
    },
    actor: {
      type: String,
      default: 'system'
    },
    error: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

aiActivityLogSchema.index({ createdAt: -1 });

export const AIActivityLog = mongoose.model('AIActivityLog', aiActivityLogSchema);
export default AIActivityLog;
