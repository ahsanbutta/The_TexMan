export const SEED_ADMIN = {
  name: 'Saboor Ahmad',
  email: 'admin@taxmancapital.com',
  username: 'admin',
  password: 'AdminPassword123!',
  role: 'admin',
  qualification: 'Qualified',
  level: 'Qualified',
  phone: '+92 300 1234567',
  city: 'Lahore',
  institute: 'ICAP / ACCA Global',
  bio: 'Lead Career Mentor, Big 4 Placement Consultant, and Founder of The TaxMan\'s Capital.'
};

export const SEED_STUDENT = {
  name: 'Muhammad Ahmed',
  email: 'student@taxmancapital.com',
  username: 'student_ahmed',
  password: 'StudentPassword123!',
  role: 'student',
  qualification: 'CAF',
  level: 'CAF',
  phone: '+92 300 9876543',
  city: 'Lahore',
  institution: 'PAC / SKANS',
  papersCleared: 6,
  bio: 'CA Intermediate aspirant preparing for Big 4 audit articleship inductions.'
};

export const SEED_MENTOR = {
  name: 'Usman Saleem',
  email: 'mentor@taxmancapital.com',
  username: 'mentor_usman',
  password: 'MentorPassword123!',
  role: 'mentor',
  qualification: 'Qualified',
  level: 'Qualified',
  phone: '+92 321 5554321',
  city: 'Islamabad',
  institute: 'PwC Alum',
  bio: 'Senior Audit Manager with 8+ years experience guiding CA & ACCA candidates.'
};

export const SEED_JOBS = [
  {
    title: 'Audit Trainee (Articleship)',
    company: 'A.F. Ferguson & Co. (PwC Pakistan)',
    companyLogo: '',
    description: 'A.F. Ferguson & Co. (a member firm of the PwC network) invites applications from energetic, highly motivated CA CAF qualified candidates and ACCA affiliates for its Fall training induction batch in Assurance & Business Advisory Services.\n\nTrainees will gain comprehensive exposure to statutory financial audits, internal control reviews, IFRS compliance, and client risk assessments across leading multinational corporations and financial institutions in Pakistan.',
    requirements: [
      'CA CAF Qualified (preferably in first 2 attempts) or ACCA Affiliate',
      'Strong conceptual clarity in IFRS and International Standards on Auditing (ISAs)',
      'Proficiency in Microsoft Excel, data analytics, and verbal communication',
      'High standard of professional ethics, integrity, and time management'
    ],
    responsibilities: [
      'Execute substantive testing and tests of controls under ISA 330',
      'Perform analytical reviews on balance sheet and profit and loss line items',
      'Assist in drafting audit findings, management letters, and client memos'
    ],
    location: 'Lahore, Karachi, Islamabad',
    city: 'Lahore',
    jobType: 'Articleship',
    category: 'Audit',
    salary: 'ICAP Standard Stipend (Rs. 29,700/mo)',
    stipend: 'Rs. 29,700 / month',
    qualification: 'CA CAF Qualified',
    level: 'CAF',
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    isOverseas: false,
    featured: true
  },
  {
    title: 'Tax Associate / Trainee',
    company: 'EY Ford Rhodes',
    companyLogo: '',
    description: 'EY Pakistan is hiring Trainees & Associates for its Direct & Indirect Tax Compliance and Advisory Practice. Candidates will work alongside leading tax partners on corporate income tax returns, withholding tax audits, sales tax provincial filings, and tax litigation before the Appellate Tribunal.',
    requirements: [
      'CA CAF Qualified or ACCA Affiliate / Finalist',
      'Strong grasp of Income Tax Ordinance 2001 and Sales Tax Act 1990',
      'Analytical aptitude and high attention to detail'
    ],
    responsibilities: [
      'Prepare tax computation workpapers and e-filings on FBR IRIS portal',
      'Draft responses to statutory notices issued under Section 122/177',
      'Conduct research on recent Finance Act amendments and tax treaty provisions'
    ],
    location: 'Karachi, Lahore, Islamabad',
    city: 'Karachi',
    jobType: 'Articleship',
    category: 'Tax',
    salary: 'Rs. 29,700 / month',
    stipend: 'Rs. 29,700 / month',
    qualification: 'CA Inter / ACCA',
    level: 'CAF',
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    isOverseas: false,
    featured: true
  },
  {
    title: 'Audit Senior (Overseas Placement)',
    company: 'PwC Middle East',
    companyLogo: '',
    description: 'PwC Middle East is seeking high-performing Qualified Chartered Accountants and ACCA Members with 2-4 years of post-qualification or articleship experience for its Dubai and Riyadh assurance practices. Package includes tax-free salary, relocation allowance, visa sponsorship, and private medical insurance.',
    requirements: [
      'Qualified CA (ICAP/ICAEW) or ACCA Member',
      '3+ years external audit experience with a Big 4 or major accounting firm',
      'Demonstrated leadership in managing engagement field teams'
    ],
    responsibilities: [
      'Lead statutory audits for tier-1 regional banks, real estate, and energy clients',
      'Review working paper files and supervise junior associates',
      'Coordinate directly with Partner and client C-suite executives'
    ],
    location: 'Dubai, UAE / Riyadh, KSA',
    city: 'Dubai, UAE',
    jobType: 'Full Time',
    category: 'Audit',
    salary: 'AED 16,000 - 22,000 / month (Tax Free)',
    qualification: 'Qualified (CAF / CFAP)',
    level: 'Qualified',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    isOverseas: true,
    featured: true
  },
  {
    title: 'Financial Advisory & Valuation Trainee',
    company: 'Deloitte Pakistan (Yousuf Adil)',
    companyLogo: '',
    description: 'Deloitte Corporate Finance Advisory practice invites applications for its M&A, Financial Due Diligence, and Business Valuation team.',
    requirements: [
      'CA CAF Qualified or CFA Level 1 / ACCA Member',
      'Proficiency in DCF, WACC, and financial modeling in Excel'
    ],
    location: 'Islamabad, Lahore',
    city: 'Islamabad',
    jobType: 'Full Time',
    category: 'Advisory',
    salary: 'Rs. 50,000 - 75,000 / month',
    qualification: 'CA Inter / ACCA',
    level: 'CFAP',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isOverseas: false,
    featured: false
  }
];

export const SEED_RESOURCES = [
  {
    title: 'Professional Big 4 CV Template (CA/ACCA Student)',
    description: 'Recruiter-approved, ATS-friendly curriculum vitae template specially formatted for CA CAF & ACCA firm induction applications.',
    category: 'Training/Induction',
    qualification: 'Both',
    resourceType: 'DOCX',
    tag: 'CV Template',
    downloads: 485,
    fileUrl: 'https://res.cloudinary.com/taxmancapital/sample_cv_template.docx',
    featured: true,
    isFeatured: true
  },
  {
    title: 'Top 50 Big 4 Audit Interview Questions & Technical Answers',
    description: 'Comprehensive handbook compiling actual technical and partner-round questions asked at PwC, EY, KPMG, and Deloitte in Pakistan.',
    category: 'Training/Induction',
    qualification: 'Both',
    resourceType: 'PDF',
    tag: 'Interview Prep',
    downloads: 620,
    fileUrl: 'https://res.cloudinary.com/taxmancapital/audit_interview_questions.pdf',
    featured: true,
    isFeatured: true
  },
  {
    title: 'CAF-5 Audit & Assurance (AAA) Quick Revision Notes',
    description: 'Standard-by-standard revision summary covering ISA 200 through ISA 700 with key assertion tables and exam checklists.',
    category: 'CAF',
    qualification: 'CA',
    resourceType: 'PDF',
    tag: 'Study Notes',
    downloads: 780,
    fileUrl: 'https://res.cloudinary.com/taxmancapital/caf5_audit_notes.pdf',
    featured: true,
    isFeatured: true
  },
  {
    title: 'Pakistan Income Tax Law Cheat Sheet (Finance Act 2024)',
    description: 'Consolidated summary of corporate and individual tax slabs, minimum tax rules under Section 113, and major tax credits.',
    category: 'CAF',
    qualification: 'Both',
    resourceType: 'PDF',
    tag: 'Tax Law',
    downloads: 910,
    fileUrl: 'https://res.cloudinary.com/taxmancapital/tax_cheat_sheet.pdf',
    featured: false,
    isFeatured: false
  }
];

export const SEED_COMMUNITY_GROUPS = [
  {
    title: 'PRC Entry-Level CA Discussion Group',
    categoryKey: 'prc',
    badge: 'PRC Group',
    description: 'Dedicated study group for CA Foundation & PRC students with daily quiz questions and study tips.',
    membersCountText: '2,400+ Active Members',
    whatsappLink: 'https://chat.whatsapp.com/sample_prc_group'
  },
  {
    title: 'CAF Intermediate Official Study Hub',
    categoryKey: 'caf',
    badge: 'CAF Group',
    description: 'Moderated peer-to-peer discussions for CAF 1 through CAF 8 subjects, past paper solutions, and teacher recommendations.',
    membersCountText: '4,800+ Active Members',
    whatsappLink: 'https://chat.whatsapp.com/sample_caf_group'
  },
  {
    title: 'Big 4 Induction & Articleship Alerts Network',
    categoryKey: 'cfap',
    badge: 'Inductions Alert',
    description: 'Real-time announcements on firm induction tests, interview dates, shortlist rosters, and registration registries.',
    membersCountText: '6,200+ Active Members',
    whatsappLink: 'https://chat.whatsapp.com/sample_induction_group'
  },
  {
    title: 'ACCA Pakistan & Global Support Community',
    categoryKey: 'acca',
    badge: 'ACCA Group',
    description: 'Practical Experience Requirement (PER) guidance, approved employer vacancies, and global exam session tips.',
    membersCountText: '3,250+ Active Members',
    whatsappLink: 'https://chat.whatsapp.com/sample_acca_group'
  }
];
