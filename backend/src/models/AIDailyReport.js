import mongoose from 'mongoose';

const aiDailyReportSchema = new mongoose.Schema(
  {
    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true
    },
    sourcesScanned: {
      type: Number,
      default: 0
    },
    discoveriesCount: {
      type: Number,
      default: 0
    },
    duplicatesCount: {
      type: Number,
      default: 0
    },
    newResourcesCount: {
      type: Number,
      default: 0
    },
    newEventsCount: {
      type: Number,
      default: 0
    },
    newAnnouncementsCount: {
      type: Number,
      default: 0
    },
    pendingApprovalsCount: {
      type: Number,
      default: 0
    },
    autoActionsCount: {
      type: Number,
      default: 0
    },
    failedSourcesCount: {
      type: Number,
      default: 0
    },
    summaryText: {
      type: String,
      required: true
    },
    highlights: {
      type: [String],
      default: []
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    sentToEmail: {
      type: Boolean,
      default: false
    },
    sentToPhone: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['Success', 'Partial', 'Failed'],
      default: 'Success'
    },
    executedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export const AIDailyReport = mongoose.model('AIDailyReport', aiDailyReportSchema);
export default AIDailyReport;
