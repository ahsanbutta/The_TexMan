import mongoose from 'mongoose';

const researchSourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    category: {
      type: String,
      enum: ['Official', 'Educational', 'University', 'Professional Body', 'Career', 'Events', 'News'],
      default: 'Official',
      index: true
    },
    qualification: {
      type: String,
      enum: ['CA', 'ACCA', 'Both'],
      default: 'Both',
      index: true
    },
    sourceType: {
      type: String,
      enum: ['Web Page', 'RSS Feed', 'API Endpoint', 'Portal'],
      default: 'Web Page'
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'High'
    },
    scanFrequency: {
      type: String,
      enum: ['Hourly', 'Daily', 'Weekly'],
      default: 'Daily'
    },
    lastScannedAt: {
      type: Date,
      default: null
    },
    lastSuccessAt: {
      type: Date,
      default: null
    },
    lastError: {
      type: String,
      default: null
    },
    errorCount: {
      type: Number,
      default: 0
    },
    contentFingerprint: {
      type: String,
      default: ''
    },
    totalDiscoveriesFound: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

researchSourceSchema.index({ isActive: 1, priority: 1 });

export const ResearchSource = mongoose.model('ResearchSource', researchSourceSchema);
