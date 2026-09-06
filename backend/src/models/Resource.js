import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
      index: true
    },
    description: {
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
        'All'
      ],
      required: true,
      index: true
    },
    subject: {
      type: String,
      default: ''
    },
    qualification: {
      type: String,
      enum: ['CA', 'ACCA', 'Both'],
      default: 'Both'
    },
    resourceType: {
      type: String,
      enum: [
        'Notes',
        'PDF',
        'DOCX',
        'ZIP',
        'XLSX',
        'Video',
        'Article',
        'Past Paper',
        'Study Material',
        'Template',
        'Calculator',
        'Guide',
        'Other'
      ],
      default: 'PDF',
      index: true
    },
    thumbnail: {
      type: String,
      default: ''
    },
    fileUrl: {
      type: String,
      required: [true, 'Resource download URL or file URL is required']
    },
    externalUrl: {
      type: String,
      default: ''
    },
    author: {
      type: String,
      default: "The TaxMan's Capital Mentorship Team"
    },
    tag: {
      type: String,
      default: ''
    },
    tagColor: {
      type: String,
      default: 'bg-emerald-500/10 text-emerald-600'
    },
    btnColor: {
      type: String,
      default: 'bg-brandGreen hover:bg-brandGreen-dark'
    },
    downloads: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    tags: {
      type: [String],
      default: []
    },
    featured: {
      type: Boolean,
      default: false,
      index: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    published: {
      type: Boolean,
      default: false,
      index: true
    },
    status: {
      type: String,
      enum: ['draft', 'pending_review', 'approved', 'rejected', 'published'],
      default: 'pending_review',
      index: true
    },
    aiReview: {
      isRelevant: { type: Boolean, default: true },
      isDuplicate: { type: Boolean, default: false },
      duplicateDetails: { type: mongoose.Schema.Types.Mixed, default: null },
      sourceValid: { type: Boolean, default: true },
      confidence: { type: Number, default: 0.95 },
      recommendation: {
        type: String,
        enum: ['approve', 'reject', 'needs_review'],
        default: 'approve'
      },
      validationNotes: { type: String, default: '' },
      reviewedAt: { type: Date, default: Date.now }
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rejectedAt: {
      type: Date
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

resourceSchema.index({ title: 'text', description: 'text', subject: 'text' });

export const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
