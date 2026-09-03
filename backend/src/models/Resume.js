import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      default: 'My CA/ACCA Resume'
    },
    templateId: {
      type: String,
      default: 'classic-black'
    },
    template: {
      type: String,
      default: 'classic-black'
    },
    profileImage: {
      type: String,
      default: ''
    },
    personalInformation: {
      name: { type: String, required: true },
      fullName: { type: String },
      ftsBatch: { type: String, default: '' },
      crn: { type: String, default: '' },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String, default: 'Lahore' },
      address: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      website: { type: String, default: '' },
      targetRole: { type: String, default: '' },
      objective: { type: String, default: '' },
      personalStatement: { type: String, default: '' }
    },
    qualification: {
      type: String,
      default: 'CA Intermediate (CAF Qualified)'
    },
    professionalQualifications: [
      {
        title: String,
        details: String,
        dateInfo: String
      }
    ],
    attempts: {
      type: String,
      default: 'First Attempt Passed'
    },
    education: [
      {
        degree: String,
        institution: String,
        year: String,
        gradeOrGpa: String
      }
    ],
    academics: [
      {
        level: String,
        year: String,
        discipline: String,
        institute: String,
        score: String
      }
    ],
    papersCleared: [
      {
        subjectName: String,
        attemptDate: String,
        marksOrStatus: String
      }
    ],
    experience: {
      type: mongoose.Schema.Types.Mixed,
      default: []
    },
    skills: {
      type: [String],
      default: ['Financial Modeling', 'IFRS 15/16', 'MS Excel', 'Internal Controls', 'Audit Sampling']
    },
    certifications: {
      type: mongoose.Schema.Types.Mixed,
      default: []
    },
    achievements: {
      type: [String],
      default: []
    },
    extraCurricular: {
      type: [String],
      default: []
    },
    languages: {
      type: [String],
      default: ['English', 'Urdu']
    },
    reference: {
      name: { type: String, default: '' },
      designation: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' }
    }
  },
  {
    timestamps: true
  }
);

export const Resume = mongoose.model('Resume', resumeSchema);
