import mongoose from 'mongoose';

const mentorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    headline: {
      type: String,
      default: 'Career Counselor & Mentor'
    },
    bio: {
      type: String,
      default: ''
    },
    profileImage: {
      type: String,
      default: ''
    },
    expertise: {
      type: [String],
      default: ['Audit & Assurance', 'Big 4 Placements', 'CV Review', 'Partner Interview Prep']
    },
    qualifications: {
      type: [String],
      default: ['CA (ICAP)', 'ACCA (UK)']
    },
    experience: {
      type: String,
      default: '8+ Years Experience'
    },
    company: {
      type: String,
      default: 'PwC / EY Alum'
    },
    availability: {
      type: String,
      default: 'Weekends & Evenings'
    },
    hourlyRate: {
      type: String,
      default: 'Free Mentorship'
    },
    languages: {
      type: [String],
      default: ['English', 'Urdu']
    },
    location: {
      type: String,
      default: 'Pakistan'
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    verified: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const MentorProfile = mongoose.model('MentorProfile', mentorProfileSchema);
