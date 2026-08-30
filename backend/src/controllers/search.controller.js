import mongoose from 'mongoose';
import { Job } from '../models/Job.js';
import { Resource } from '../models/Resource.js';
import { MentorProfile } from '../models/MentorProfile.js';
import { Post } from '../models/Post.js';
import { CommunityGroup } from '../models/CommunityGroup.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { SEED_JOBS, SEED_RESOURCES, SEED_COMMUNITY_GROUPS } from '../utils/seedData.js';

export const globalSearch = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === '') {
    return new ApiResponse(
      200,
      { jobs: [], resources: [], mentors: [], posts: [], communities: [] },
      'Please enter a search keyword'
    ).send(res);
  }

  const query = q.trim().toLowerCase();

  // If DB is connected
  if (mongoose.connection.readyState === 1) {
    try {
      const regex = { $regex: q.trim(), $options: 'i' };
      const [jobs, resources, mentors, posts, communities] = await Promise.all([
        Job.find({ $or: [{ title: regex }, { company: regex }, { city: regex }] })
          .limit(6)
          .select('title company city jobType level deadline isOverseas'),
        Resource.find({ $or: [{ title: regex }, { description: regex }, { subject: regex }] })
          .limit(6)
          .select('title category resourceType downloads fileUrl'),
        MentorProfile.find({ $or: [{ name: regex }, { headline: regex }, { company: regex }] })
          .limit(4)
          .select('name headline company expertise rating'),
        Post.find({ $or: [{ title: regex }, { content: regex }] })
          .limit(5)
          .populate('author', 'name profileImage'),
        CommunityGroup.find({ $or: [{ title: regex }, { description: regex }] })
          .limit(4)
          .select('title badge membersCountText whatsappLink')
      ]);

      return new ApiResponse(
        200,
        { jobs, resources, mentors, posts, communities },
        `Search results for "${q}"`
      ).send(res);
    } catch (err) {
      console.warn('DB search fallback to in-memory filter:', err.message);
    }
  }

  // Fallback in-memory search
  const jobs = SEED_JOBS.filter(
    (j) =>
      j.title.toLowerCase().includes(query) ||
      j.company.toLowerCase().includes(query) ||
      j.description.toLowerCase().includes(query)
  );

  const resources = SEED_RESOURCES.filter(
    (r) =>
      r.title.toLowerCase().includes(query) ||
      r.description.toLowerCase().includes(query) ||
      r.category.toLowerCase().includes(query)
  );

  const communities = SEED_COMMUNITY_GROUPS.filter(
    (c) =>
      c.title.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query)
  );

  return new ApiResponse(
    200,
    { jobs, resources, mentors: [], posts: [], communities },
    `Search results for "${q}" (Cached Mode)`
  ).send(res);
});
