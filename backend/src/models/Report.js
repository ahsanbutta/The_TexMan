import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    targetType: {
      type: String,
      enum: ['Post', 'Comment', 'User', 'Job', 'Resource'],
      required: true
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },
    reason: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Dismissed', 'Action_Taken'],
      default: 'Pending',
      index: true
    },
    actionTaken: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const Report = mongoose.model('Report', reportSchema);
