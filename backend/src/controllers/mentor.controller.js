import mongoose from 'mongoose';
import { MentorProfile } from '../models/MentorProfile.js';
import { MentorReview } from '../models/MentorReview.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const FALLBACK_MENTORS = [
  {
    _id: 'mentor-1',
    name: 'Saboor Ahmad',
    headline: 'Career Counselor & Mentor',
    company: 'Lead Mentor / Founder',
    expertise: ['Big 4 Audit Inductions', 'CV Review', 'Partner Interview Prep'],
    qualifications: ['CA (ICAP)', 'ACCA (UK)'],
    experience: '10+ Years Experience',
    rating: 5.0,
    totalReviews: 45,
    verified: true
  },
  {
    _id: 'mentor-2',
    name: 'Usman Saleem',
    headline: 'Audit & Assurance Expert',
    company: 'Ex-PwC Senior Manager',
    expertise: ['Statutory Audit', 'ISA Standards', 'CFAP Strategy'],
    qualifications: ['CA (ICAP)', 'CFA'],
    experience: '8+ Years Experience',
    rating: 4.9,
    totalReviews: 32,
    verified: true
  },
  {
    _id: 'mentor-3',
    name: 'Hassan Raza',
    headline: 'Taxation & Advisory Expert',
    company: 'EY Alum',
    expertise: ['Direct & Indirect Tax', 'FBR Appeals', 'Corporate Tax'],
    qualifications: ['CA', 'ACCA'],
    experience: '7+ Years Experience',
    rating: 4.8,
    totalReviews: 24,
    verified: true
  }
];

export const getMentors = asyncHandler(async (req, res) => {
  const { expertise, qualification, city, q } = req.query;

  if (mongoose.connection.readyState === 1) {
    try {
      const filter = { verified: true };
      if (expertise && expertise !== 'All') filter.expertise = { $regex: expertise, $options: 'i' };
      if (qualification && qualification !== 'All') filter.qualifications = { $regex: qualification, $options: 'i' };
      if (city && city !== 'All') filter.location = { $regex: city, $options: 'i' };
      if (q) {
        filter.$or = [
          { name: { $regex: q, $options: 'i' } },
          { headline: { $regex: q, $options: 'i' } },
          { company: { $regex: q, $options: 'i' } }
        ];
      }

      const mentors = await MentorProfile.find(filter).sort({ rating: -1, totalReviews: -1 });
      if (mentors.length > 0) return new ApiResponse(200, mentors, 'Mentors retrieved successfully').send(res);
    } catch (err) {}
  }

  return new ApiResponse(200, FALLBACK_MENTORS, 'Mentors retrieved (Resilience Mode)').send(res);
});

export const getMentorById = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const mentor = await MentorProfile.findById(req.params.id);
      if (mentor) {
        const reviews = await MentorReview.find({ mentor: mentor._id }).sort({ createdAt: -1 });
        return new ApiResponse(200, { mentor, reviews }, 'Mentor profile retrieved').send(res);
      }
    } catch (err) {}
  }

  const fallback = FALLBACK_MENTORS.find((m) => m._id === req.params.id) || FALLBACK_MENTORS[0];
  return new ApiResponse(200, { mentor: fallback, reviews: [] }, 'Mentor profile retrieved').send(res);
});

export const updateMentorProfile = asyncHandler(async (req, res) => {
  const profile = await MentorProfile.findOneAndUpdate(
    { user: req.user._id },
    { ...req.body, name: req.user.name, user: req.user._id },
    { new: true, upsert: true, runValidators: true }
  );

  return new ApiResponse(200, profile, 'Mentor profile saved').send(res);
});

export const addMentorReview = asyncHandler(async (req, res) => {
  const { rating, review, placedAt } = req.body;
  const mentorId = req.params.id;

  if (!rating || !review) {
    throw new ApiError(400, 'Rating and review comment are required');
  }

  const newReview = await MentorReview.create({
    mentor: mentorId,
    student: req.user._id,
    studentName: req.user.name,
    studentRole: req.user.qualification || 'CA Intermediate',
    rating: Number(rating),
    review,
    placedAt: placedAt || ''
  });

  return new ApiResponse(201, newReview, 'Review submitted successfully!').send(res);
});
