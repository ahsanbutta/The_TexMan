import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    images: {
      type: [String],
      default: []
    },
    category: {
      type: String,
      enum: ['Discussion', 'Study Group', 'Induction Alert', 'Exam Strategy', 'Question', 'General'],
      default: 'Discussion',
      index: true
    },
    tags: {
      type: [String],
      default: []
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    likesCount: {
      type: Number,
      default: 0
    },
    commentsCount: {
      type: Number,
      default: 0
    },
    isPinned: {
      type: Boolean,
      default: false
    },
    isModerated: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const Post = mongoose.model('Post', postSchema);
