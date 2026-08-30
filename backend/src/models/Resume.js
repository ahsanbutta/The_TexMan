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
    personalInformation: {
      name: { type: String, required: true },
      crn: { type: String, default: '' },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String, default: 'Lahore' },
      address: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      objective: { type: String, default: '' }
    },
    qualification: {
      type: String,
      default: 'CA Intermediate (CAF Qualified)'
    },
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
    papersCleared: [
      {
        subjectName: String,
        attemptDate: String,
        marksOrStatus: String
      }
    ],
    experience: [
      {
        company: String,
        role: String,
        location: String,
        startDate: String,
        endDate: String,
        responsibilities: [String]
      }
    ],
    skills: {
      type: [String],
      default: ['Financial Modeling', 'IFRS 15/16', 'MS Excel', 'Internal Controls', 'Audit Sampling']
    },
    certifications: [
      {
        name: String,
        issuer: String,
        date: String
      }
    ],
    languages: {
      type: [String],
      default: ['English', 'Urdu']
    },
    template: {
      type: String,
      default: 'Big4_Classic'
    }
  },
  {
    timestamps: true
  }
);

export const Resume = mongoose.model('Resume', resumeSchema);
