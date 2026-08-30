import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    tag: {
      type: String,
      default: 'General'
    },
    summary: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: 'General',
      index: true
    },
    eventDate: {
      type: String,
      default: ''
    },
    isPinned: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: 'Upcoming'
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

export const Announcement = mongoose.model('Announcement', announcementSchema);
