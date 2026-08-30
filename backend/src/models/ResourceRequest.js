import mongoose from 'mongoose';

const resourceRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    resourceTitle: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: 'CAF'
    },
    notes: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending', 'Fulfilled', 'Rejected'],
      default: 'Pending',
      index: true
    }
  },
  {
    timestamps: true
  }
);

export const ResourceRequest = mongoose.model('ResourceRequest', resourceRequestSchema);
