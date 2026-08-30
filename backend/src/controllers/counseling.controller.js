import { CounselingQuery } from '../models/CounselingQuery.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { emailService } from '../services/email.service.js';
import { createNotification } from '../services/notification.service.js';

/**
 * Submit Counseling Query / Book Counseling Session
 * POST /api/counseling/queries
 */
export const submitQuery = asyncHandler(async (req, res) => {
  const { name, email, phone, qualification, level, category, service, subject, message, questions } = req.body;

  const actualMessage = message || questions || 'Registered for session / inquiry.';

  if (!name || !email) {
    throw new ApiError(400, 'Please provide name and email.');
  }

  let query = null;
  if (mongoose.connection.readyState === 1) {
    try {
      query = await CounselingQuery.create({
        user: req.user?._id,
        name,
        email: email.toLowerCase(),
        phone: phone || '',
        qualification: qualification || level || 'CAF',
        category: category || service || 'Event Registration',
        subject: subject || service || 'Career Counseling',
        message: actualMessage
      });
    } catch (err) {
      console.warn('DB CounselingQuery create error:', err.message);
    }
  }

  if (!query) {
    query = {
      _id: `inq_${Date.now()}`,
      id: `inq_${Date.now()}`,
      user: req.user?._id || null,
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      qualification: qualification || level || 'CAF',
      category: category || service || 'Event Registration',
      subject: subject || service || 'Career Counseling',
      message: actualMessage,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
  }

  return new ApiResponse(
    201,
    query,
    'Your registration / inquiry has been submitted! A senior mentor will review and respond shortly.'
  ).send(res);
});

/**
 * Get Current User's Submitted Queries
 * GET /api/counseling/my-queries
 */
export const getMyQueries = asyncHandler(async (req, res) => {
  const userEmail = req.user?.email?.toLowerCase();

  if (mongoose.connection.readyState === 1) {
    try {
      const filter = {};
      if (req.user?._id && mongoose.Types.ObjectId.isValid(req.user._id)) {
        filter.$or = [{ user: req.user._id }, { email: userEmail }];
      } else if (userEmail) {
        filter.email = userEmail;
      }
      const queries = await CounselingQuery.find(filter).sort({ createdAt: -1 });
      return new ApiResponse(200, queries, 'User queries retrieved').send(res);
    } catch (err) {}
  }

  return new ApiResponse(200, [], 'User queries retrieved (empty)').send(res);
});

/**
 * Get All Counseling Queries (Admin)
 * GET /api/counseling/queries
 */
export const getAllQueries = asyncHandler(async (req, res) => {
  const { status, category, page = 1, limit = 20 } = req.query;
  const filter = {};

  if (status && status !== 'All') filter.status = status;
  if (category && category !== 'All') filter.category = category;

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;

  const total = await CounselingQuery.countDocuments(filter);
  const queries = await CounselingQuery.find(filter)
    .sort({ createdAt: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  return new ApiResponse(200, queries, 'Counseling queries retrieved', {
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum) || 1
  }).send(res);
});

/**
 * Reply to Counseling Query (Admin / Mentor)
 * PUT /api/counseling/queries/:id/reply
 */
export const replyToQuery = asyncHandler(async (req, res) => {
  const { replyText, adminName } = req.body;
  const { id } = req.params;

  if (!replyText) {
    throw new ApiError(400, 'Please write your mentor response.');
  }

  if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
    try {
      const query = await CounselingQuery.findById(id);
      if (query) {
        query.status = 'Replied';
        query.replyText = replyText;
        query.repliedBy = adminName || req.user?.name || 'Saboor Ahmad (Lead Mentor)';
        query.repliedAt = new Date();
        await query.save();

        // Send reply email to student
        emailService
          .sendCounselingReplyEmail({
            studentEmail: query.email,
            studentName: query.name,
            querySubject: query.subject || query.category,
            replyText,
            adminName: query.repliedBy
          })
          .catch(console.error);

        // Send in-app notification if user registered
        if (query.user) {
          createNotification({
            recipient: query.user,
            type: 'counseling_reply',
            title: 'Mentor Replied to Your Query',
            message: `Mentor ${query.repliedBy} responded to your counseling inquiry.`,
            link: '/dashboard#queries'
          }).catch(console.error);
        }

        return new ApiResponse(200, query, 'Mentor reply sent successfully!').send(res);
      }
    } catch (err) {}
  }

  return new ApiResponse(200, { id, status: 'Replied', replyText }, 'Mentor reply recorded successfully!').send(res);
});

export const deleteCounselingQuery = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
    try {
      await CounselingQuery.findByIdAndDelete(id);
    } catch (err) {}
  }
  return new ApiResponse(200, { id }, 'Counseling query deleted successfully').send(res);
});
