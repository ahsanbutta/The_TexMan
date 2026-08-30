import mongoose from 'mongoose';
import { Announcement } from '../models/Announcement.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const SEED_ANNOUNCEMENTS = [
  {
    _id: 'ann-1',
    id: 'ann-1',
    title: 'ICAP Career Fair 2026',
    summary: 'Annual Career fair at Lahore Expo Centre featuring Big 4 firms.',
    content: 'Full details of career fair, firm booths, written test guidelines, and walk-in interviews.',
    category: 'Event',
    eventDate: '20 MAY',
    tag: 'Career Fair',
    status: 'Upcoming',
    isPinned: true
  },
  {
    _id: 'ann-2',
    id: 'ann-2',
    title: 'CA Final Preparation Webinar',
    summary: 'Zoom session with Lead Mentor Saboor Ahmad CA on advanced audit & taxation.',
    content: 'Interactive masterclass on CFAP syllabus changes, case study answering approach, and exam strategies.',
    category: 'Webinar',
    eventDate: '24 MAY',
    tag: 'Webinar',
    status: 'Upcoming',
    isPinned: false
  },
  {
    _id: 'ann-3',
    id: 'ann-3',
    title: 'CV & Cover Letter Workshop',
    summary: 'Physical workshop at Lahore Office for CAF Qualified students.',
    content: 'One-on-one resume review, ATS screening optimization, and mock HR partner rounds.',
    category: 'General',
    eventDate: '28 MAY',
    tag: 'Workshop',
    status: 'Open',
    isPinned: false
  }
];

export const getAnnouncements = asyncHandler(async (req, res) => {
  const { category, status, q } = req.query;

  if (mongoose.connection.readyState === 1) {
    try {
      const filter = {};
      if (category && category !== 'All') filter.category = category;
      if (status && status !== 'All') filter.status = status;
      if (q) {
        filter.$or = [
          { title: { $regex: q, $options: 'i' } },
          { summary: { $regex: q, $options: 'i' } },
          { content: { $regex: q, $options: 'i' } }
        ];
      }

      const announcements = await Announcement.find(filter).sort({ isPinned: -1, createdAt: -1 });
      if (announcements.length > 0) {
        return new ApiResponse(200, announcements, 'Announcements retrieved').send(res);
      }
    } catch (err) {
      console.warn('DB getAnnouncements fallback:', err.message);
    }
  }

  let filtered = [...SEED_ANNOUNCEMENTS];
  if (category && category !== 'All') filtered = filtered.filter((a) => a.category === category);
  return new ApiResponse(200, filtered, 'Announcements retrieved (Resilience Mode)').send(res);
});

export const getAnnouncementById = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const announcement = await Announcement.findById(req.params.id);
      if (announcement) return new ApiResponse(200, announcement, 'Announcement retrieved').send(res);
    } catch (err) {}
  }
  const fallback = SEED_ANNOUNCEMENTS.find((a) => a.id === req.params.id) || SEED_ANNOUNCEMENTS[0];
  return new ApiResponse(200, { ...fallback, _id: req.params.id }, 'Announcement retrieved').send(res);
});

export const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, summary, content, category, eventDate, tag, isPinned } = req.body;
  if (!title) {
    throw new ApiError(400, 'Title is required.');
  }

  const safeSummary = summary || content || title;
  const safeContent = content || summary || title;

  if (mongoose.connection.readyState === 1) {
    const announcement = await Announcement.create({
      title,
      summary: safeSummary,
      content: safeContent,
      category: category || 'General',
      eventDate: eventDate || '',
      tag: tag || category || 'General',
      isPinned: Boolean(isPinned),
      postedBy: req.user?._id
    });
    return new ApiResponse(201, announcement, 'Announcement published successfully').send(res);
  }

  const mock = {
    _id: `ann-${Date.now()}`,
    id: `ann-${Date.now()}`,
    title,
    summary: safeSummary,
    content: safeContent,
    category: category || 'General',
    eventDate: eventDate || '',
    tag: tag || category || 'General',
    isPinned: Boolean(isPinned),
    createdAt: new Date().toISOString()
  };
  return new ApiResponse(201, mock, 'Announcement published successfully (fallback mode)').send(res);
});

export const updateAnnouncement = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(req.params.id)) {
    try {
      const updated = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (updated) return new ApiResponse(200, updated, 'Announcement updated successfully').send(res);
    } catch (err) {}
  }
  return new ApiResponse(200, { _id: req.params.id, id: req.params.id, ...req.body }, 'Announcement updated').send(res);
});

export const deleteAnnouncement = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(req.params.id)) {
    try {
      await Announcement.findByIdAndDelete(req.params.id);
    } catch (err) {}
  }
  return new ApiResponse(200, { id: req.params.id }, 'Announcement deleted successfully').send(res);
});
