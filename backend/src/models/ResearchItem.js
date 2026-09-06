import mongoose from 'mongoose';

const researchItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    summary: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: [
        'PRC',
        'CAF',
        'Training/Induction',
        'CFAP & SCS (Finals)',
        'CA Qualified',
        'ACCA',
        'Exams & Syllabus',
        'Scholarships',
        'Events & Webinars',
        'General Industry'
      ],
      default: 'CAF',
      index: true
    },
    qualification: {
      type: String,
      enum: ['CA', 'ACCA', 'Both'],
      default: 'Both',
      index: true
    },
    source: {
      type: String,
      required: true,
      trim: true
    },
    sourceUrl: {
      type: String,
      required: true,
      trim: true
    },
    publishDate: {
      type: Date,
      default: Date.now
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 85
    },
    status: {
      type: String,
      enum: ['New', 'Reviewed', 'Approved', 'Rejected', 'Published'],
      default: 'New',
      index: true
    },
    aiRecommendation: {
      suggestedAction: {
        type: String,
        enum: ['Create Resource', 'Create Event', 'Create Announcement', 'Create Blog Post', 'Archive'],
        default: 'Create Resource'
      },
      reasoning: {
        type: String,
        default: ''
      },
      tags: [String]
    },
    rawContent: {
      type: String,
      default: ''
    },
    convertedEntity: {
      entityType: {
        type: String,
        enum: ['Resource', 'Event', 'Announcement', 'Blog', 'None'],
        default: 'None'
      },
      entityId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
      }
    }
  },
  {
    timestamps: true
  }
);

researchItemSchema.index({ sourceUrl: 1 });
researchItemSchema.index({ createdAt: -1 });

export const ResearchItem = mongoose.model('ResearchItem', researchItemSchema);
