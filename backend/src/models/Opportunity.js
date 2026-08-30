import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    organization: {
      type: String,
      required: true,
      trim: true
    },
    logo: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      required: true
    },
    opportunityType: {
      type: String,
      enum: ['Articleship', 'CA Induction', 'ACCA Trainee', 'Firm Internship', 'SMP Induction'],
      default: 'Articleship',
      index: true
    },
    qualification: {
      type: String,
      enum: ['PRC', 'CAF', 'CFAP', 'ACCA', 'Both', 'Qualified'],
      default: 'CAF'
    },
    location: {
      type: String,
      required: true
    },
    city: {
      type: String,
      default: 'Lahore'
    },
    stipend: {
      type: String,
      default: 'ICAP Standard Stipend (Rs. 29,700/mo)'
    },
    requirements: {
      type: [String],
      default: []
    },
    deadline: {
      type: Date,
      required: true
    },
    contactEmail: {
      type: String
    },
    applicationUrl: {
      type: String,
      default: ''
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['Open', 'Closed'],
      default: 'Open'
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const Opportunity = mongoose.model('Opportunity', opportunitySchema);
