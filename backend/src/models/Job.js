import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please specify the job title'],
      trim: true,
      index: true
    },
    company: {
      type: String,
      required: [true, 'Please specify the hiring organization / firm'],
      trim: true,
      index: true
    },
    companyLogo: {
      type: String,
      default: ''
    },
    logoSvg: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      required: [true, 'Please provide job description and role details']
    },
    requirements: {
      type: [String],
      default: []
    },
    responsibilities: {
      type: [String],
      default: []
    },
    location: {
      type: String,
      required: [true, 'Please provide the job location/city']
    },
    city: {
      type: String,
      required: [true, 'Please specify city'],
      index: true
    },
    country: {
      type: String,
      default: 'Pakistan',
      index: true
    },
    workMode: {
      type: String,
      enum: ['On-site', 'Virtual / Remote', 'Hybrid'],
      default: 'On-site',
      index: true
    },
    jobType: {
      type: String,
      enum: ['Internship', 'Articleship', 'Full Time', 'Part Time', 'Trainee', 'Contract'],
      required: [true, 'Please specify job type'],
      index: true
    },
    category: {
      type: String,
      enum: [
        'Audit',
        'Tax',
        'Accounting',
        'Finance',
        'Advisory',
        'Consulting',
        'Banking',
        'Corporate Finance',
        'Risk',
        'Other'
      ],
      default: 'Audit',
      index: true
    },
    salary: {
      type: String,
      default: 'Market Competitive'
    },
    stipend: {
      type: String,
      default: ''
    },
    experienceLevel: {
      type: String,
      default: 'Entry Level / Trainee'
    },
    qualification: {
      type: String,
      required: [true, 'Please specify target qualification level (e.g. CAF / CA Inter, ACCA Finalist, CA Finalist, CA Qualified)'],
      index: true
    },
    level: {
      type: String,
      default: 'CAF / CA Inter',
      index: true
    },
    deadline: {
      type: Date,
      required: [true, 'Please set an application deadline']
    },
    skills: {
      type: [String],
      default: []
    },
    applicationUrl: {
      type: String,
      default: ''
    },
    isOverseas: {
      type: Boolean,
      default: false,
      index: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'Closed', 'Draft'],
      default: 'Open',
      index: true
    },
    featured: {
      type: Boolean,
      default: false,
      index: true
    },
    viewsCount: {
      type: Number,
      default: 0
    },
    applicationsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound Text Index for Full-Text Search on Jobs
jobSchema.index({
  title: 'text',
  company: 'text',
  description: 'text',
  city: 'text',
  country: 'text',
  qualification: 'text',
  level: 'text'
});

export const Job = mongoose.model('Job', jobSchema);
