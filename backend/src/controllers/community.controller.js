import mongoose from 'mongoose';
import { CommunityGroup } from '../models/CommunityGroup.js';
import { Post } from '../models/Post.js';
import { Comment } from '../models/Comment.js';
import { Report } from '../models/Report.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { SEED_COMMUNITY_GROUPS } from '../utils/seedData.js';

export const getCommunityGroups = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const groups = await CommunityGroup.find({ isActive: true }).sort({ categoryKey: 1 });
      if (groups.length > 0) return new ApiResponse(200, groups, 'Community groups retrieved').send(res);
    } catch (err) {}
  }
  return new ApiResponse(200, SEED_COMMUNITY_GROUPS, 'Community groups retrieved (Resilience Mode)').send(res);
});

export const createCommunityGroup = asyncHandler(async (req, res) => {
  const group = await CommunityGroup.create(req.body);
  return new ApiResponse(201, group, 'Community group created').send(res);
});

export const getPosts = asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 15 } = req.query;
  const filter = { isModerated: false };
  if (category && category !== 'All') filter.category = category;

  if (mongoose.connection.readyState === 1) {
    try {
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 15;
      const total = await Post.countDocuments(filter);
      const posts = await Post.find(filter)
        .sort({ isPinned: -1, createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate('author', 'name role profileImage qualification');

      return new ApiResponse(200, posts, 'Community posts retrieved', {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1
      }).send(res);
    } catch (err) {}
  }

  return new ApiResponse(200, [], 'No posts found (Empty Feed)', { total: 0, page: 1, limit: 15, totalPages: 1 }).send(res);
});

export const createPost = asyncHandler(async (req, res) => {
  const { title, content, category, tags, images } = req.body;
  if (!content) throw new ApiError(400, 'Post content is required.');

  const post = await Post.create({
    author: req.user._id,
    title: title || '',
    content,
    category: category || 'Discussion',
    tags: Array.isArray(tags) ? tags : [],
    images: Array.isArray(images) ? images : []
  });

  const populated = await Post.findById(post._id).populate('author', 'name role profileImage');
  return new ApiResponse(201, populated, 'Post published successfully!').send(res);
});

export const toggleLikePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new ApiError(404, 'Post not found');

  const userId = req.user._id;
  const isLiked = post.likes.some((id) => id.toString() === userId.toString());

  if (isLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    post.likesCount = Math.max(0, post.likesCount - 1);
  } else {
    post.likes.push(userId);
    post.likesCount += 1;
  }

  await post.save();
  return new ApiResponse(200, { isLiked: !isLiked, likesCount: post.likesCount }, 'Like toggled').send(res);
});

export const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) throw new ApiError(400, 'Comment text is required');

  const post = await Post.findById(req.params.id);
  if (!post) throw new ApiError(404, 'Post not found');

  const comment = await Comment.create({
    author: req.user._id,
    post: req.params.id,
    content
  });

  await Post.findByIdAndUpdate(req.params.id, { $inc: { commentsCount: 1 } });
  const populated = await Comment.findById(comment._id).populate('author', 'name role profileImage');

  return new ApiResponse(201, populated, 'Comment added').send(res);
});

export const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.id })
    .sort({ createdAt: 1 })
    .populate('author', 'name role profileImage');

  return new ApiResponse(200, comments, 'Comments retrieved').send(res);
});

export const createReport = asyncHandler(async (req, res) => {
  const { targetType, targetId, reason } = req.body;
  if (!targetType || !targetId || !reason) throw new ApiError(400, 'targetType, targetId, and reason are required.');

  const report = await Report.create({
    reportedBy: req.user._id,
    targetType,
    targetId,
    reason
  });

  return new ApiResponse(201, report, 'Report received. Our moderation team will review this shortly.').send(res);
});
