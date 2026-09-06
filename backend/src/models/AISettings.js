import mongoose from 'mongoose';

const aiSettingsSchema = new mongoose.Schema(
  {
    schedulerEnabled: {
      type: Boolean,
      default: true
    },
    scheduleCron: {
      type: String,
      default: '0 9 * * *' // Daily at 09:00 AM PST
    },
    scheduledTime: {
      type: String,
      default: '09:00'
    },
    scheduleFrequency: {
      type: String,
      enum: ['daily', 'weekdays', 'custom_days', 'specific_date', 'custom_cron'],
      default: 'daily'
    },
    scheduledDate: {
      type: String,
      default: '' // Format: YYYY-MM-DD
    },
    scheduledDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    timezone: {
      type: String,
      default: 'Asia/Karachi'
    },
    contentType: {
      type: String,
      default: 'Blog Post'
    },
    targetTopic: {
      type: String,
      default: '' // e.g. "AI & Accounting for CA/ACCA" or specific topic
    },
    resourcesPerCycle: {
      type: Number,
      default: 3
    },
    requiresApproval: {
      type: Boolean,
      default: true
    },
    autonomyLevel: {
      type: Number,
      enum: [1, 2, 3, 4],
      default: 2 // L1: Research Only, L2: Human in the loop, L3: Auto-Draft with Safety Limits, L4: Full Auto
    },
    confidenceThresholdAuto: {
      type: Number,
      default: 0.95
    },
    confidenceThresholdDraft: {
      type: Number,
      default: 0.80
    },
    notificationChannels: {
      email: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: true },
      telegram: { type: Boolean, default: false },
      inApp: { type: Boolean, default: true }
    },
    notificationRecipients: {
      email: {
        type: String,
        default: 'muhammadahsaniftikaharahmad@gmail.com'
      },
      phone: {
        type: String,
        default: '03269754249'
      },
      whatsappNumber: {
        type: String,
        default: '+923269754249'
      },
      telegramChatId: {
        type: String,
        default: ''
      }
    },
    maxDailyActions: {
      type: Number,
      default: 50
    },
    autoArchiveExpiredEvents: {
      type: Boolean,
      default: true
    },
    lastRunAt: {
      type: Date,
      default: null
    },
    nextRunAt: {
      type: Date,
      default: null
    },
    lastRunStatus: {
      type: String,
      default: 'Ready'
    }
  },
  {
    timestamps: true
  }
);

export const AISettings = mongoose.model('AISettings', aiSettingsSchema);
export default AISettings;
