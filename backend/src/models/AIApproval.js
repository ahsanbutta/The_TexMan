import mongoose from 'mongoose';

const aiApprovalSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Resource', 'Event', 'Announcement', 'Blog', 'SocialPost', 'CustomAction'],
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    summary: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Published'],
      default: 'Pending',
      index: true
    },
    agent: {
      type: String,
      required: true
    },
    taskId: {
      type: String,
      default: ''
    },
    confidence: {
      type: Number,
      default: 90
    },
    source: {
      type: String,
      default: ''
    },
    sourceUrl: {
      type: String,
      default: ''
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    targetEntityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    reviewNotes: {
      type: String,
      default: ''
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reviewedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

aiApprovalSchema.index({ createdAt: -1 });

export const AIApproval = mongoose.model('AIApproval', aiApprovalSchema);
export default AIApproval;
