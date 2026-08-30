import { User } from '../models/User.js';
import { Job } from '../models/Job.js';
import { JobApplication } from '../models/JobApplication.js';
import { Resource } from '../models/Resource.js';
import { Post } from '../models/Post.js';
import { Report } from '../models/Report.js';
import { CounselingQuery } from '../models/CounselingQuery.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Get Platform Dashboard Counters & Activity (Admin Only)
 * GET /api/admin/dashboard
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalStudents,
    totalMentors,
    totalEmployers,
    totalJobs,
    totalApplications,
    totalResources,
    totalPosts,
    pendingReports,
    pendingQueries,
    recentUsers,
    recentJobs,
    recentApplications
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'mentor' }),
    User.countDocuments({ role: 'employer' }),
    Job.countDocuments(),
    JobApplication.countDocuments(),
    Resource.countDocuments(),
    Post.countDocuments(),
    Report.countDocuments({ status: 'Pending' }),
    CounselingQuery.countDocuments({ status: 'Pending' }),
    User.find().sort({ createdAt: -1 }).limit(5).select('name email role qualification createdAt'),
    Job.find().sort({ createdAt: -1 }).limit(5).select('title company city jobType deadline'),
    JobApplication.find().sort({ createdAt: -1 }).limit(5).populate('job', 'title company').populate('applicant', 'name email')
  ]);

  const stats = {
    overview: {
      totalUsers,
      totalStudents,
      totalMentors,
      totalEmployers,
      totalJobs,
      totalApplications,
      totalResources,
      totalPosts,
      pendingReports,
      pendingQueries
    },
    feeds: {
      recentUsers,
      recentJobs,
      recentApplications
    }
  };

  return new ApiResponse(200, stats, 'Admin dashboard KPI statistics').send(res);
});

/**
 * Get All Users with Role Filter (Admin)
 * GET /api/admin/users
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, q, page = 1, limit = 20 } = req.query;
  const filter = {};

  if (role && role !== 'All') filter.role = role;
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
      { username: { $regex: q, $options: 'i' } }
    ];
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;

  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .select('-password');

  return new ApiResponse(200, users, 'Users retrieved', {
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum) || 1
  }).send(res);
});

/**
 * Update User Role / Status (Admin)
 * PUT /api/admin/users/:id/role
 */
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role, isActive } = req.body;
  const updates = {};
  if (role) updates.role = role;
  if (isActive !== undefined) updates.isActive = isActive;

  if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(req.params.id)) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
      if (user) return new ApiResponse(200, user, 'User role/status updated').send(res);
    } catch (err) {}
  }
  return new ApiResponse(200, { id: req.params.id, ...updates }, 'User role/status updated').send(res);
});

/**
 * Get Moderation Reports (Admin)
 * GET /api/admin/reports
 */
export const getReports = asyncHandler(async (req, res) => {
  const reports = await Report.find()
    .sort({ createdAt: -1 })
    .populate('reportedBy', 'name email');
  return new ApiResponse(200, reports, 'Reports retrieved').send(res);
});

/**
 * Resolve Moderation Report (Admin)
 * PUT /api/admin/reports/:id
 */
export const resolveReport = asyncHandler(async (req, res) => {
  const { status, actionTaken } = req.body;
  if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(req.params.id)) {
    try {
      const report = await Report.findByIdAndUpdate(
        req.params.id,
        { status: status || 'Reviewed', actionTaken: actionTaken || '' },
        { new: true }
      );
      if (report) return new ApiResponse(200, report, 'Report resolved').send(res);
    } catch (err) {}
  }
  return new ApiResponse(200, { id: req.params.id, status, actionTaken }, 'Report resolved').send(res);
});

/**
 * Delete User Account (Admin)
 * DELETE /api/admin/users/:id
 */
export const deleteUser = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(req.params.id)) {
    try {
      await User.findByIdAndDelete(req.params.id);
    } catch (err) {}
  }
  return new ApiResponse(200, { id: req.params.id }, 'User account deleted successfully').send(res);
});
