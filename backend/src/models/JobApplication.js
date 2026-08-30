import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    resume: {
      type: String,
      required: [true, 'Resume / CV file URL is required']
    },
    coverLetter: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Applied', 'Reviewing', 'Shortlisted', 'Interview', 'Rejected', 'Selected'],
      default: 'Applied',
      index: true
    },
    notes: {
      type: String,
      default: ''
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate applications by the same user to the same job
jobApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);
