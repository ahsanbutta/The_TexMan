import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      default: 'Study Tutor Session'
    },
    qualification: {
      type: String,
      default: 'CAF'
    },
    subject: {
      type: String,
      default: 'FAR-1 (Financial Accounting)'
    },
    messages: [
      {
        sender: {
          type: String,
          enum: ['user', 'tutor', 'ai', 'system'],
          required: true
        },
        text: {
          type: String,
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

export const Conversation = mongoose.model('Conversation', conversationSchema);
