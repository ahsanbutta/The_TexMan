import { Resume } from '../models/Resume.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Get All CVs for current user
 * GET /api/cv
 */
export const getResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 });
  return new ApiResponse(200, resumes, 'User resumes retrieved').send(res);
});

/**
 * Get Single CV by ID
 * GET /api/cv/:id
 */
export const getResumeById = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    throw new ApiError(404, 'Resume not found');
  }
  return new ApiResponse(200, resume, 'Resume retrieved').send(res);
});

/**
 * Create or Save CV
 * POST /api/cv
 */
export const createResume = asyncHandler(async (req, res) => {
  const { title, personalInformation, qualification, attempts, education, papersCleared, experience, skills, certifications, languages, template } = req.body;

  const resume = await Resume.create({
    user: req.user._id,
    title: title || 'CA Trainee Resume',
    personalInformation: personalInformation || {
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone || ''
    },
    qualification: qualification || req.user.qualification || 'CAF',
    attempts: attempts || 'First Attempt Passed',
    education: education || [],
    papersCleared: papersCleared || [],
    experience: experience || [],
    skills: skills || ['Financial Reporting', 'IFRS', 'MS Excel', 'Audit Standards'],
    certifications: certifications || [],
    languages: languages || ['English', 'Urdu'],
    template: template || 'Big4_Classic'
  });

  return new ApiResponse(201, resume, 'CV saved successfully').send(res);
});

/**
 * Update CV
 * PUT /api/cv/:id
 */
export const updateResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!resume) {
    throw new ApiError(404, 'Resume not found or unauthorized');
  }

  return new ApiResponse(200, resume, 'CV updated successfully').send(res);
});

/**
 * Delete CV
 * DELETE /api/cv/:id
 */
export const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    throw new ApiError(404, 'Resume not found');
  }
  return new ApiResponse(200, null, 'Resume deleted').send(res);
});
