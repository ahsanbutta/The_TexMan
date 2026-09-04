import { api } from './api';

const STORAGE_KEY = 'thetaxman_blogs_cache_v3';

export const INITIAL_BLOGS = [
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
    content: `Securing an articleship in a Big 4 firm is one of the most critical milestones in every CA and ACCA student's professional career. With thousands of high-achieving applicants competing across Lahore, Karachi, and Islamabad, relying solely on exam scores is no longer enough. You need an end-to-end tactical blueprint.

## 1. Understanding the Recruitment Timeline & Cycles
Big 4 inductions in Pakistan typically take place twice every year following [ICAP Examination Results](https://icap.org.pk):

- **Spring Induction Batch:** Results announced in March; application portals open immediately, with written tests scheduled through April and Partner interviews running across May.
- **Autumn Induction Batch:** Results in September; screening and technical interviews run through October and November.

> **Expert Mentor Tip:** Always monitor firm career portals 2 to 3 weeks before results are declared. Top tier firms like [PwC Pakistan](https://www.pwc.com.pk) and [KPMG Pakistan](https://home.kpmg/pk) often open pre-registration windows early.

## 2. The 4-Stage Selection Funnel

### Stage 1: ATS Resume & Academic Screening
Firms utilize automated applicant tracking filters before a recruiter ever looks at your CV. Make sure your CV clearly highlights:
- All passed CAF / ACCA Applied Skills papers with first-attempt distinctions.
- Matriculation / O-Level & Inter / A-Level percentages (most firms require 70%+ aggregate).
- Professional presentation using ATS-friendly templates (check out our [Career Mentorship Tools](/career-tools)).

### Stage 2: Written Aptitude & Technical Assessment
The written exam assesses speed, analytical rigor, and basic business awareness:
- **IFRS Core Standards:** Focus heavily on IAS 1 (Presentation), IAS 16 (Property, Plant & Equipment), IAS 36 (Impairment), and IFRS 15 (Revenue).
- **Analytical & Numerical Reasoning:** Speed-math, ratios, percentage changes, and logical deductions under 60-second time limits.
- **Business English Writing:** Formal email drafting, explaining an accounting treatment to a non-accountant client.

### Stage 3: Manager Technical Interview Round
Managers want to see how you think under pressure:
- Do you understand audit assertions (Completeness, Existence, Accuracy, Cut-off)?
- How would you test inventory valuation at year-end?
- Discussing real-world ethics dilemmas under the ICAP Code of Ethics.

### Stage 4: Partner Behavioral & Vision Round
Partners don't quiz you on journal entries; they assess culture fit, long-term commitment, and resilience during grueling busy seasons.

## 3. Official Links & Recommended Resources
- [ICAP Official Website](https://icap.org.pk) - Trainee induction guidelines & firm quotas
- [PwC Pakistan Trainee Careers](https://www.pwc.com.pk) - Articleship portal & application guidelines
- [KPMG Pakistan Careers](https://home.kpmg/pk) - Audit & tax advisory recruitment
- [EY Ford Rhodes Portal](https://www.ey.com) - Assurance induction updates
- [The TaxMan's Capital Mentorship](/career-tools) - 1-on-1 mock interview preparation`,
    tags: ['Big 4', 'PwC', 'EY', 'KPMG', 'Deloitte', 'Articleship', 'Induction'],
    readTime: '6 min read',
    isFeatured: true,
    status: 'published',
    views: 1420,
    createdAt: '2026-08-15'
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
    content: `Balancing grueling 12-hour audit engagements during busy season with demanding CFAP study hours is the defining challenge of an articleship trainee. Here is the exact time-management blueprint used by first-attempt rankers.

## 1. The 3-Phase Study Plan

### Phase 1 (Months 1-3) - Conceptual Foundations
- Complete all syllabus video lectures or classroom modules early.
- Maintain concise, handwritten concept maps summarizing tricky standards like IFRS 9 (Financial Instruments) and IFRS 16 (Leases).
- Review official ICAP study text illustrative examples thoroughly.

### Phase 2 (Month 4) - Past Paper Drilling
- Solve past papers from the last 10 ICAP attempts under strictly timed exam conditions.
- Compare your solutions directly against the examiner's comments and suggested answers on the [ICAP Examination Portal](https://icap.org.pk).
- Identify recurring questions and common examiner pitfalls.

### Phase 3 (Final Month) - Full Mock Rehearsals
- Sit for 3-hour mock exams on weekends to build mental endurance and handwriting speed.
- Practice question selection: always start with questions you are 80%+ confident about to bank early marks.

> **Crucial Rule:** Never sacrifice sleep the night before an ICAP examination. Exhaustion accounts for more failures than lack of preparation.

## 2. Protecting Study Hours During Busy Season
- **The 5:00 AM Routine:** Lock in 2 solid, undistracted study hours every morning before heading to the client site.
- **Commute Productivity:** Listen to standards summaries or review audio notes while traveling.
- **Weekend Immersion:** Treat Saturdays and Sundays as full-day revision workshops.

## 3. Essential Study Links & Materials
- [ICAP Student Examination Resources](https://icap.org.pk) - Past papers, examiners' comments & syllabus
- [The TaxMan's Capital Mentorship](/career-tools) - Guidance sessions with first-attempt CA rankers`,
    tags: ['CFAP', 'ICAP', 'Study Routine', 'Exam Strategy', 'Audit Season'],
    readTime: '5 min read',
    isFeatured: false,
    status: 'published',
    views: 980,
    createdAt: '2026-08-22'
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
    summary: 'An unbiased comparison of domestic market demand, compensation brackets, overseas opportunities, and study pathways.',
    content: `Students standing at the crossroads of CA Pakistan (ICAP) and ACCA (UK) often ask which qualification offers better career returns and long-term prestige. The answer depends heavily on your geographic and sector aspirations.

## 1. Statutory Audit vs Global Corporate Scope

### CA Pakistan (ICAP)
- **Statutory Audit Monopoly:** Holds exclusive audit signing rights under the Companies Act 2017.
- **Domestic Prestige:** Highest executive market recognition among Pakistan's top 100 public listed companies and domestic financial institutions.
- **Learn more:** [Institute of Chartered Accountants of Pakistan](https://icap.org.pk)

### ACCA (UK)
- **Global Portability:** Recognized across 180+ countries with established mutual recognition pathways.
- **MNC & Fintech Dominance:** Preferred by multinational corporations, shared services centers, and tech companies across the Middle East and Europe.
- **Learn more:** [ACCA Global Official Portal](https://www.accaglobal.com)

> **Key Takeaway:** If your primary goal is partner track in a Pakistani audit firm, choose CA. If you plan to relocate to the UAE, UK, or Canada within 2-3 years, ACCA offers immense mobility.

## 2. Salary Comparison & Career Progression
Both qualifications reward competence, communication prowess, and technical mastery. Qualified professionals typically command competitive packages within 3 to 5 years post-qualification across industry and practice sectors.`,
    tags: ['ACCA', 'CA', 'Comparison', 'Salaries', 'Global Relocation'],
    readTime: '7 min read',
    isFeatured: false,
    status: 'published',
    views: 1850,
    createdAt: '2026-08-28'
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
    summary: 'Avoid the automatic rejection pile by understanding how modern HR applicant tracking systems parse your CV.',
    content: `Over 70% of trainee resumes submitted to leading corporate and Big 4 audit employers fail automated ATS screening before ever reaching human recruiters. Avoid these fatal pitfalls:

## Critical Resume Guidelines
1. **Never use fancy multi-column graphics:** Automated parsers read left-to-right, top-to-bottom and scramble complex table columns.
2. **Include precise accounting keywords:** Ensure IFRS, ISA, Audit Assertions, Reconciliation, and Withholding Tax appear naturally in your competencies.
3. **Quantify achievements:** Replace 'Responsible for bank reconciliation' with 'Reconciled 15 bank accounts monthly with zero unresolved variances'.
4. **Link your verified credentials:** Include clean hyperlinks to your LinkedIn profile and certifications.

> **Need a verified format?** Check out our dedicated [Resume Review Tools](/career-tools) designed specifically for accountancy trainees.`,
    tags: ['CV Tips', 'ATS Resume', 'Job Application', 'HR Screening'],
    readTime: '4 min read',
    isFeatured: false,
    status: 'published',
    views: 1120,
    createdAt: '2026-09-01'
  },
  {
    _id: 'blog-5',
    id: 'blog-5',
    title: 'Corporate Finance vs Audit: Which Track Should You Choose?',
    slug: 'corporate-finance-vs-audit-career-track',
    category: 'Industry Insights',
    author: {
      name: 'Saboor Ahmad CA',
      role: 'Founder & Lead Career Mentor',
      avatar: ''
    },
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&auto=format&fit=crop&q=80',
    summary: 'Evaluate the daily work, compensation trajectory, and exit opportunities of Financial Advisory vs Assurance practices.',
    content: `Many trainees wonder whether they should specialize in Statutory Audit or pivot towards Corporate Finance / Financial Advisory during their training contracts.

## 1. Statutory Audit Track
- **Core Focus:** Assessing internal controls, verifying compliance with IFRS and ISAs, and issuing independent audit opinions.
- **Strengths:** Unmatched foundation in accounting fundamentals and regulatory compliance across diverse industries.
- **Typical Exit Roles:** Financial Controller, Chief Accountant, Internal Audit Director, Chief Financial Officer.

## 2. Corporate Finance & Advisory Track
- **Core Focus:** Mergers & acquisitions (M&A), financial modeling, valuation (DCF, comparable multiples), debt restructuring, and due diligence.
- **Strengths:** High exposure to deal-making, strategic finance, and executive board discussions.
- **Typical Exit Roles:** Investment Banking, Private Equity, Venture Capital, Corporate Development.

> **Advice:** If you enjoy valuation and transactions, gain audit experience first for 18-24 months, then seek secondment into Deals / Financial Advisory.`,
    tags: ['Corporate Finance', 'Audit', 'M&A', 'Career Track', 'Valuation'],
    readTime: '6 min read',
    isFeatured: false,
    status: 'published',
    views: 1340,
    createdAt: '2026-09-02'
  },
  {
    _id: 'blog-6',
    id: 'blog-6',
    title: 'Navigating Pakistan Tax Laws 2026: What Trainees Must Master',
    slug: 'navigating-pakistan-tax-laws-2026',
    category: 'Tax & Audit',
    author: {
      name: 'Saboor Ahmad CA',
      role: 'Founder & Lead Career Mentor',
      avatar: ''
    },
    coverImage: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1200&auto=format&fit=crop&q=80',
    summary: 'A practitioner overview of the latest amendments to the Income Tax Ordinance 2001 and Sales Tax Act.',
    content: `With frequent digital compliance reforms, e-invoicing mandates, and changing withholding tax regimes introduced by the Federal Board of Revenue, tax advisory is one of the fastest growing specialization tracks in Pakistan.

## Core Tax Competencies for 2026
1. **Withholding Tax Optimization:** Understanding Active Taxpayer List (ATL) rules, non-filer penal withholding rates, and exemptions under Section 153.
2. **Digital Sales Tax & E-Invoicing:** Navigating digital integration rules on the [FBR Official Portal](https://fbr.gov.pk).
3. **Appellate Drafting:** Preparing grounds of appeal for Commissioner Inland Revenue (Appeals) and the Appellate Tribunal Inland Revenue (ATIR).

> **Important Resource:** Visit the [FBR Official Portal](https://fbr.gov.pk) regularly for the latest statutory regulatory orders (SROs) and circulars.`,
    tags: ['Taxation', 'FBR', 'Income Tax', 'Sales Tax', 'Tax Advisory'],
    readTime: '5 min read',
    isFeatured: false,
    status: 'published',
    views: 790,
    createdAt: '2026-09-03'
  }
];

const getStoredBlogs = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (err) {
    console.warn('[BlogService] LocalStorage read failed:', err);
  }
  return INITIAL_BLOGS;
};

const saveStoredBlogs = (blogs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
  } catch (err) {
    console.warn('[BlogService] LocalStorage write failed:', err);
  }
};

export const fetchBlogs = async (params = {}) => {
  try {
    const res = await api.get('/blogs', { params });
    const blogs = res?.data || res;
    if (Array.isArray(blogs) && blogs.length > 0) {
      saveStoredBlogs(blogs);
      return blogs;
    }
  } catch (err) {
    console.warn('[BlogService] API fetch fallback to local cache:', err.message);
  }

  let local = getStoredBlogs();
  if (params.category && params.category !== 'All') {
    local = local.filter(b => b.category === params.category);
  }
  if (params.q) {
    const query = params.q.toLowerCase();
    local = local.filter(b =>
      b.title.toLowerCase().includes(query) ||
      b.summary.toLowerCase().includes(query) ||
      b.content.toLowerCase().includes(query) ||
      (b.tags && b.tags.some(t => t.toLowerCase().includes(query)))
    );
  }
  return local;
};

export const fetchBlogById = async (id) => {
  try {
    const res = await api.get(`/blogs/${id}`);
    const blog = res?.data || res;
    if (blog && (blog.title || blog._id)) return blog;
  } catch (err) {
    console.warn('[BlogService] Single fetch fallback:', err.message);
  }

  const local = getStoredBlogs();
  const found = local.find(b => b._id === id || b.id === id || b.slug === id);
  if (found) {
    found.views = (found.views || 0) + 1;
    saveStoredBlogs(local);
    return found;
  }
  throw new Error('Blog not found');
};

export const createBlog = async (blogData) => {
  try {
    const res = await api.post('/blogs', blogData);
    const created = res?.data || res;
    if (created && (created._id || created.id)) {
      const local = getStoredBlogs();
      local.unshift(created);
      saveStoredBlogs(local);
      return created;
    }
  } catch (err) {
    console.warn('[BlogService] API create fallback:', err.message);
  }

  const slug = (blogData.title || 'untitled')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

  const fallback = {
    ...blogData,
    _id: `blog-${Date.now()}`,
    id: `blog-${Date.now()}`,
    slug,
    views: 0,
    status: blogData.status || 'published',
    createdAt: new Date().toISOString().split('T')[0]
  };

  const local = getStoredBlogs();
  local.unshift(fallback);
  saveStoredBlogs(local);
  return fallback;
};

export const updateBlog = async (id, blogData) => {
  try {
    const res = await api.put(`/blogs/${id}`, blogData);
    const updated = res?.data || res;
    if (updated) {
      const local = getStoredBlogs();
      const idx = local.findIndex(b => b._id === id || b.id === id);
      if (idx !== -1) {
        local[idx] = { ...local[idx], ...updated };
        saveStoredBlogs(local);
      }
      return updated;
    }
  } catch (err) {
    console.warn('[BlogService] API update fallback:', err.message);
  }

  const local = getStoredBlogs();
  const idx = local.findIndex(b => b._id === id || b.id === id);
  if (idx !== -1) {
    local[idx] = { ...local[idx], ...blogData, updatedAt: new Date().toISOString().split('T')[0] };
    saveStoredBlogs(local);
    return local[idx];
  }
  throw new Error('Blog post not found to update');
};

export const deleteBlog = async (id) => {
  try {
    await api.delete(`/blogs/${id}`);
  } catch (err) {
    console.warn('[BlogService] API delete fallback:', err.message);
  }

  const local = getStoredBlogs();
  const filtered = local.filter(b => b._id !== id && b.id !== id);
  saveStoredBlogs(filtered);
  return { success: true };
};
