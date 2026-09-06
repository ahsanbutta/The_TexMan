import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Big 4 & Inductions', 'CA Guidance', 'ACCA Careers', 'Tax & Audit', 'Study Tips', 'Industry Insights', 'Career & Leadership', 'AI & Accounting', 'Technology & AI', 'General'],
      default: 'General'
    },
    author: {
      name: {
        type: String,
        default: 'Saboor Ahmad CA'
      },
      role: {
        type: String,
        default: 'Founder & Lead Career Mentor'
      },
      avatar: {
        type: String,
        default: ''
      }
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&auto=format&fit=crop&q=80'
    },
    summary: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    tags: {
      type: [String],
      default: []
    },
    readTime: {
      type: String,
      default: '4 min read'
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published'
    },
    views: {
      type: Number,
      default: 0
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

blogSchema.index({ title: 'text', summary: 'text', content: 'text', tags: 'text' });
blogSchema.index({ category: 1, status: 1, createdAt: -1 });

export const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
