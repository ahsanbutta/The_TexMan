import mongoose from 'mongoose';

const mentorReviewSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MentorProfile',
      required: true,
      index: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    studentName: {
      type: String,
      required: true
    },
    studentRole: {
      type: String,
      default: 'CA Intermediate / Finalist'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      required: true
    },
    placedAt: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const MentorReview = mongoose.model('MentorReview', mentorReviewSchema);
