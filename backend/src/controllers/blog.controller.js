import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

let IN_MEMORY_BLOGS = [
  {
    _id: 'blog-1',
    id: 'blog-1',
    title: 'Big 4 Trainee Inductions 2026: Complete Strategy for PwC, EY, KPMG & Deloitte',
    slug: 'big-4-trainee-inductions-2026-strategy',
    category: 'Big 4 & Inductions',
    author: {
      name: 'Saboor Ahmad CA',
      role: 'Founder & Lead Career Mentor',
      avatar: ''
    },
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
    summary: 'Everything you need to crack the written aptitude test, HR interview, and final Partner round in Pakistan Big 4 firms.',
    content: `Securing an articleship in a Big 4 firm is one of the most critical milestones in every CA and ACCA student's journey. With competition intensifying across Lahore, Karachi, and Islamabad, having a structured strategy is essential.

### 1. Understanding the Recruitment Timeline
Big 4 inductions typically run twice a year following ICAP result announcements:
- **Spring Induction Batch:** Results in March, test and interviews throughout April and May.
- **Autumn Induction Batch:** Results in September, test and interviews through October and November.

### 2. The Multi-Tier Selection Funnel
Firms filter thousands of applicants through a 4-tier process:
1. **ATS Resume Screening:** Ensure your CAF papers are clearly listed with first-attempt mentions and academic merit.
2. **Written Assessment:** Accounting fundamentals, IFRS standards (IAS 1, IAS 16, IAS 36, IFRS 15), Business English, and analytical math.
3. **Manager Technical Round:** Deep dive into conceptual accounting, audit assertions, and practical scenario questions.
4. **Partner Behavioral Round:** Culture fit, ethics, stress management, and long-term commitment.

### 3. Key Preparation Advice from Saboor Ahmad CA
Focus on strong communication skills and practical knowledge of audit procedures. Confidence, intellectual honesty, and thorough knowledge of the firm's client portfolio will set you apart.`,
    tags: ['Big 4', 'PwC', 'EY', 'KPMG', 'Deloitte', 'Articleship', 'Induction'],
    readTime: '6 min read',
    isFeatured: true,
    status: 'published',
    views: 1420,
    createdAt: new Date('2026-08-15')
  },
  {
    _id: 'blog-2',
    id: 'blog-2',
    title: 'How to Clear CFAP in First Attempt: Proven Routine & Strategy',
    slug: 'how-to-clear-cfap-in-first-attempt',
    category: 'CA Guidance',
    author: {
      name: 'Saboor Ahmad CA',
      role: 'Founder & Lead Career Mentor',
      avatar: ''
    },
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80',
    summary: 'A step-by-step masterclass routine for managing busy audit season hours while preparing for CFAP & MSA exams.',
    content: `Balancing full-time firm engagements with grueling CFAP study hours is the defining challenge for aspiring Chartered Accountants. Here is how successful candidates optimize their time:

### 1. The 3-Phase Study Calendar
- **Phase 1 (Months 1-3): Conceptual Clarity:** Cover syllabus modules through video lectures and concept summaries.
- **Phase 2 (Month 4): Intensive Practice:** Solve past papers from the last 10 attempts under timed conditions.
- **Phase 3 (Final Month): Mock Exams & Weak Area Re-drills:** Take full 3-hour mocks to master time allocation.

### 2. Time Management During Busy Season
- Study 2 focused hours early in the morning before reporting to the audit client.
- Utilize travel and commute time for audio lectures or flashcards.
- Dedicate full 8-10 hour study blocks on Sundays.`,
    tags: ['CFAP', 'ICAP', 'Study Plan', 'Exams', 'Audit'],
    readTime: '5 min read',
    isFeatured: false,
    status: 'published',
    views: 980,
    createdAt: new Date('2026-08-22')
  },
  {
    _id: 'blog-3',
    id: 'blog-3',
    title: 'ACCA vs CA in Pakistan: Career Scope, Salaries & Global Mobility',
    slug: 'acca-vs-ca-pakistan-career-scope',
    category: 'ACCA Careers',
    author: {
      name: 'Usman Saleem',
      role: 'Senior Audit Mentor & ACCA Member',
      avatar: ''
    },
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1200&auto=format&fit=crop&q=80',
    summary: 'An unbiased comparison of market demand, compensation brackets, overseas opportunities, and study pathways.',
    content: `Students frequently ask whether they should pursue CA Pakistan (ICAP) or ACCA (UK). Both qualifications hold immense market value, but your choice should align with your ultimate career destination.

### 1. Market Recognition in Pakistan
- **CA Pakistan:** Holds statutory audit signing authority in Pakistan and remains the premier credential for partnership roles in domestic audit practices.
- **ACCA:** Widely recognized in multinational corporations (MNCs), shared services centers, IT fintech firms, and advisory divisions.

### 2. Global Mobility & Relocation
ACCA offers streamlined international equivalency across 180+ countries, particularly the Middle East (UAE, Saudi Arabia), the UK, and Europe. CA Pakistan qualified professionals also enjoy immense respect in GCC countries and Big 4 firms globally.`,
    tags: ['ACCA', 'CA', 'Career Comparison', 'Salary', 'Global Mobility'],
    readTime: '7 min read',
    isFeatured: false,
    status: 'published',
    views: 1850,
    createdAt: new Date('2026-08-28')
  },
  {
    _id: 'blog-4',
    id: 'blog-4',
    title: 'Top 10 ATS Resume Mistakes CA/ACCA Trainees Make',
    slug: 'top-10-ats-resume-mistakes-trainees-make',
    category: 'Study Tips',
    author: {
      name: 'Saboor Ahmad CA',
      role: 'Founder & Lead Career Mentor',
      avatar: ''
    },
    coverImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&auto=format&fit=crop&q=80',
    summary: 'Avoid the automatic rejection pile by understanding how modern HR tracking systems parse your CV.',
    content: `Over 70% of resumes sent to leading accounting and advisory firms are filtered out before reaching a human recruiter. Here are the top mistakes you must fix immediately:

1. **Using multi-column graphic templates:** ATS parsers scramble complex two-column layouts.
2. **Missing core keywords:** Ensure terms like IFRS, ISA, Variance Analysis, Tax Compliance, and Advanced Excel are naturally integrated.
3. **Listing job duties instead of quantifiable achievements:** Replace 'Worked on audit' with 'Led field audit for PKR 2.5B manufacturing client'.
4. **Incorrect contact details and missing LinkedIn link:** Keep your professional profile links updated and accessible.`,
    tags: ['CV', 'Resume', 'ATS', 'Interview Prep', 'Job Hunting'],
    readTime: '4 min read',
    isFeatured: false,
    status: 'published',
    views: 1120,
    createdAt: new Date('2026-09-01')
  }
];

export const getBlogs = asyncHandler(async (req, res) => {
  const { category, q, status } = req.query;

  if (mongoose.connection.readyState === 1) {
    try {
      const filter = {};
      if (category && category !== 'All') filter.category = category;
      // If not admin, only show published blogs
      if (req.user?.role !== 'admin') {
        filter.status = 'published';
      } else if (status && status !== 'All') {
        filter.status = status;
      }

      if (q) {
        filter.$or = [
          { title: { $regex: q, $options: 'i' } },
          { summary: { $regex: q, $options: 'i' } },
          { content: { $regex: q, $options: 'i' } },
          { tags: { $in: [new RegExp(q, 'i')] } }
        ];
      }

      const blogs = await Blog.find(filter).sort({ isFeatured: -1, createdAt: -1 });
      if (blogs && blogs.length > 0) {
        return res.status(200).json(new ApiResponse(200, blogs, 'Blogs fetched successfully'));
      }
    } catch (err) {
      console.warn('[BlogController] DB Query error, using in-memory fallback:', err.message);
    }
  }

  // In-memory fallback
  let filtered = [...IN_MEMORY_BLOGS];
  if (req.user?.role !== 'admin') {
    filtered = filtered.filter(b => b.status === 'published');
  } else if (status && status !== 'All') {
    filtered = filtered.filter(b => b.status === status);
  }

  if (category && category !== 'All') {
    filtered = filtered.filter(b => b.category === category);
  }

  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter(b =>
      b.title.toLowerCase().includes(query) ||
      b.summary.toLowerCase().includes(query) ||
      b.content.toLowerCase().includes(query) ||
      (b.tags && b.tags.some(t => t.toLowerCase().includes(query)))
    );
  }

  filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  return res.status(200).json(new ApiResponse(200, filtered, 'Blogs fetched successfully'));
});

export const getBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      const blog = mongoose.Types.ObjectId.isValid(id)
        ? await Blog.findById(id)
        : await Blog.findOne({ slug: id });

      if (blog) {
        blog.views = (blog.views || 0) + 1;
        await blog.save().catch(() => {});
        return res.status(200).json(new ApiResponse(200, blog, 'Blog found'));
      }
    } catch (err) {
      console.warn('[BlogController] DB single fetch error:', err.message);
    }
  }

  const found = IN_MEMORY_BLOGS.find(b => b._id === id || b.id === id || b.slug === id);
  if (!found) {
    throw new ApiError(404, 'Blog article not found');
  }

  found.views = (found.views || 0) + 1;
  return res.status(200).json(new ApiResponse(200, found, 'Blog found'));
});

export const createBlog = asyncHandler(async (req, res) => {
  const { title, summary, content, category, coverImage, tags, readTime, isFeatured, status, author } = req.body;

  if (!title || !summary || !content) {
    throw new ApiError(400, 'Title, summary, and content are required');
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

  const newBlogData = {
    title,
    slug,
    summary,
    content,
    category: category || 'General',
    coverImage: coverImage || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&auto=format&fit=crop&q=80',
    tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : []),
    readTime: readTime || '4 min read',
    isFeatured: Boolean(isFeatured),
    status: status || 'published',
    views: 0,
    author: {
      name: author?.name || req.user?.full_name || 'Saboor Ahmad CA',
      role: author?.role || 'Founder & Lead Career Mentor',
      avatar: author?.avatar || ''
    },
    postedBy: req.user?._id
  };

  if (mongoose.connection.readyState === 1) {
    try {
      const created = await Blog.create(newBlogData);
      return res.status(201).json(new ApiResponse(201, created, 'Blog post created successfully'));
    } catch (err) {
      console.warn('[BlogController] DB Create error, falling back to memory:', err.message);
    }
  }

  const fallbackCreated = {
    ...newBlogData,
    _id: `blog-${Date.now()}`,
    id: `blog-${Date.now()}`,
    createdAt: new Date()
  };
  IN_MEMORY_BLOGS.unshift(fallbackCreated);

  return res.status(201).json(new ApiResponse(201, fallbackCreated, 'Blog post created successfully'));
});

export const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (updates.tags && typeof updates.tags === 'string') {
    updates.tags = updates.tags.split(',').map(t => t.trim()).filter(Boolean);
  }

  if (mongoose.connection.readyState === 1) {
    try {
      const updated = await Blog.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
      if (updated) {
        return res.status(200).json(new ApiResponse(200, updated, 'Blog updated successfully'));
      }
    } catch (err) {
      console.warn('[BlogController] DB Update error:', err.message);
    }
  }

  const idx = IN_MEMORY_BLOGS.findIndex(b => b._id === id || b.id === id);
  if (idx === -1) {
    throw new ApiError(404, 'Blog not found to update');
  }

  IN_MEMORY_BLOGS[idx] = { ...IN_MEMORY_BLOGS[idx], ...updates, updatedAt: new Date() };
  return res.status(200).json(new ApiResponse(200, IN_MEMORY_BLOGS[idx], 'Blog updated successfully'));
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      const deleted = await Blog.findByIdAndDelete(id);
      if (deleted) {
        return res.status(200).json(new ApiResponse(200, null, 'Blog deleted successfully'));
      }
    } catch (err) {
      console.warn('[BlogController] DB Delete error:', err.message);
    }
  }

  const idx = IN_MEMORY_BLOGS.findIndex(b => b._id === id || b.id === id);
  if (idx === -1) {
    throw new ApiError(404, 'Blog not found to delete');
  }

  IN_MEMORY_BLOGS.splice(idx, 1);
  return res.status(200).json(new ApiResponse(200, null, 'Blog deleted successfully'));
});
