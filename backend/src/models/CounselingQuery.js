import mongoose from 'mongoose';

const counselingQuerySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      default: ''
    },
    qualification: {
      type: String,
      default: 'CAF'
    },
    category: {
      type: String,
      default: 'General Inquiry',
      index: true
    },
    subject: {
      type: String,
      default: 'Career Counseling'
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Replied', 'Answered', 'Closed'],
      default: 'Pending',
      index: true
    },
    replyText: {
      type: String,
      default: ''
    },
    repliedBy: {
      type: String,
      default: ''
    },
    repliedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export const CounselingQuery = mongoose.model('CounselingQuery', counselingQuerySchema);
