

export const pwcLogo = (
  <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="12" fill="#FAF5FF" />
    <path d="M30 45h12v12H30V45z" fill="#D24626" />
    <path d="M42 45h12v12H42V45z" fill="#EB8C00" />
    <path d="M42 57h12v12H42V57z" fill="#F3BE12" />
    <path d="M54 33h12v12H54V33z" fill="#40281E" />
    <path d="M54 45h12v12H54V45z" fill="#D24626" />
    <text x="30" y="82" fill="#1C1C1C" fontSize="16" fontWeight="bold" fontFamily="sans-serif">pwc</text>
  </svg>
);

export const eyLogo = (
  <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="12" fill="#FFFDE7" />
    <path d="M25 60 L60 60 L75 30 L40 30 Z" fill="#FFE000" />
    <text x="28" y="52" fill="#111827" fontSize="22" fontWeight="bold" fontFamily="sans-serif">EY</text>
  </svg>
);

export const kpmgLogo = (
  <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="12" fill="#EEF2FF" />
    <path d="M25 22h8v10h-8V22zm16 0h8v10h-8V22zm16 0h8v10h-8V22z" fill="#0A5EA7" />
    <text x="18" y="66" fill="#0A5EA7" fontSize="22" fontWeight="900" letterSpacing="-1" fontFamily="sans-serif">KPMG</text>
  </svg>
);

export const bdoLogo = (
  <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="12" fill="#EFF6FF" />
    <path d="M15 25 H85 V30 H15 Z" fill="#D24626" />
    <text x="22" y="65" fill="#0A5EA7" fontSize="24" fontWeight="800" fontFamily="sans-serif">BDO</text>
  </svg>
);

export const INITIAL_JOBS = [
  // --- 1. CAF / CA Inter: Articleship ---
  {
    id: 1,
    company: 'PwC Pakistan (A.F. Ferguson & Co.)',
    companyKey: 'pwc',
    title: 'CA Articleship Training Induction',
    location: 'Lahore',
    country: 'Pakistan',
    level: 'CAF / CA Inter',
    badge: 'CAF / CA Inter',
    jobType: 'Articleship',
    workMode: 'On-site',
    deadline: '31 May 2026',
    deadlineDate: new Date('2026-05-31'),
    dateAdded: new Date('2026-06-08'),
    isNew: true,
    logoBg: 'bg-amber-500/10',
    description: 'PwC Pakistan offers formal 3.5 years articleship training contracts for CA CAF qualified students under ICAP training regulations. Trainees receive extensive on-the-job training in Assurance, Risk Advisory, and Corporate Taxation.',
    requirements: [
      'CAF Qualified from ICAP (all 8 papers cleared)',
      'Strong conceptual foundation in IFRS and auditing fundamentals',
      'Solid analytical, interpersonal, and communication skills',
      'Availability for client travel across Pakistan'
    ],
    logoSvg: pwcLogo
  },
  // --- 2. CAF / CA Inter: Internship ---
  {
    id: 2,
    company: 'Deloitte Pakistan',
    companyKey: 'deloitte',
    title: 'Audit & Assurance Summer Internship',
    location: 'Karachi',
    country: 'Pakistan',
    level: 'CAF / CA Inter',
    badge: 'CAF / CA Inter',
    jobType: 'Internship',
    workMode: 'On-site',
    deadline: '28 May 2026',
    deadlineDate: new Date('2026-05-28'),
    dateAdded: new Date('2026-06-07'),
    isNew: true,
    logoBg: 'bg-black/5',
    description: 'Join Deloitte Pakistan as a Summer Audit Intern. Ideal for CAF / CA Inter students seeking practical audit exposure before formal articleship registration. Work alongside audit managers on real statutory audits.',
    requirements: [
      'Currently studying CA Inter (at least Group 1 passed) or CAF student',
      'Basic knowledge of International Financial Reporting Standards (IFRS)',
      'Exceptional critical thinking and problem-solving abilities',
      'Strong written and verbal English skills'
    ],
    logoSvg: (
      <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="12" fill="#F8FAFC" />
        <text x="12" y="55" fill="#111827" fontSize="18" fontWeight="900" fontFamily="sans-serif">Deloitte</text>
        <circle cx="82" cy="51" r="4" fill="#00C853" />
      </svg>
    )
  },
  // --- 3. ACCA Finalist: Internship ---
  {
    id: 3,
    company: 'EY Pakistan',
    companyKey: 'ey',
    title: 'ACCA Finalist Assurance Internship',
    location: 'Islamabad',
    country: 'Pakistan',
    level: 'ACCA Finalist',
    badge: 'ACCA Finalist',
    jobType: 'Internship',
    workMode: 'On-site',
    deadline: '25 May 2026',
    deadlineDate: new Date('2026-05-25'),
    dateAdded: new Date('2026-06-06'),
    isNew: true,
    logoBg: 'bg-yellow-500/10',
    description: 'EY Assurance services is offering a dedicated 8-week internship specifically tailored for ACCA Finalists. Interns will perform controls walkthroughs, substantive testing, and analytical procedures on multinational engagements.',
    requirements: [
      'ACCA Finalist (passed Applied Skills, attempting Strategic Professional exams)',
      'Solid command over IFRS standards (SBR/AAA knowledge preferred)',
      'Attentive to detail and highly organized',
      'Ability to thrive in fast-paced corporate audit teams'
    ],
    logoSvg: eyLogo
  },
  // --- 4. CAF / CA Inter: Articleship ---
  {
    id: 4,
    company: 'BDO Pakistan',
    companyKey: 'bdo',
    title: 'Audit & Assurance - CA Articleship',
    location: 'Lahore',
    country: 'Pakistan',
    level: 'CAF / CA Inter',
    badge: 'CAF / CA Inter',
    jobType: 'Articleship',
    workMode: 'On-site',
    deadline: '30 May 2026',
    deadlineDate: new Date('2026-05-30'),
    dateAdded: new Date('2026-06-05'),
    isNew: false,
    logoBg: 'bg-blue-500/10',
    description: 'BDO Pakistan is offering articleship contracts for CA students under ICAP guidelines. This program is designed to develop complete professionals with cross-functional expertise in audit, tax, and risk advisory.',
    requirements: [
      'CAF Qualified candidates eligible for immediate ICAP training registry',
      'Proficient in standard accounting tools and MS Excel',
      'Ethical mindset and dedication to professional standards',
      'Excellent collaborative skills'
    ],
    logoSvg: bdoLogo
  },
  // --- 5. ACCA Affiliate: Induction / Trainee ---
  {
    id: 5,
    company: 'KPMG Pakistan',
    companyKey: 'kpmg',
    title: 'ACCA Affiliate Trainee Induction',
    location: 'Karachi',
    country: 'Pakistan',
    level: 'ACCA Affiliate',
    badge: 'ACCA Affiliate',
    jobType: 'Articleship',
    workMode: 'On-site',
    deadline: '27 May 2026',
    deadlineDate: new Date('2026-05-27'),
    dateAdded: new Date('2026-06-04'),
    isNew: true,
    logoBg: 'bg-blue-900/10',
    description: 'KPMG Pakistan provides an immersive 3-year trainee program specifically for ACCA Affiliates. Work towards completing your 36 months of Practical Experience Requirement (PER) while handling statutory corporate audits.',
    requirements: [
      'ACCA Affiliate (all 13 exams cleared)',
      'Sound understanding of ISAs, IFRS, and corporate tax provisions',
      'Highly analytical with sharp critical reasoning',
      'Ambition to pursue ACCA Membership upon completion of PER'
    ],
    logoSvg: kpmgLogo
  },
  // --- 6. CAF / CA Inter: Articleship ---
  {
    id: 6,
    company: 'Grant Thornton Pakistan',
    companyKey: 'grant_thornton',
    title: 'CA Articleship - Tax & Corporate Advisory',
    location: 'Lahore',
    country: 'Pakistan',
    level: 'CAF / CA Inter',
    badge: 'CAF / CA Inter',
    jobType: 'Articleship',
    workMode: 'On-site',
    deadline: '02 June 2026',
    deadlineDate: new Date('2026-06-02'),
    dateAdded: new Date('2026-06-03'),
    isNew: false,
    logoBg: 'bg-purple-900/10',
    description: 'Grant Thornton Pakistan invites CAF qualified candidates to apply for Articleship vacancies in its Corporate Tax and Business Advisory division.',
    requirements: [
      'CAF Qualified from ICAP',
      'Sound conceptual clarity in corporate tax calculations and double-entry',
      'Strong reporting and written English skills',
      'Motivated to specialize in taxation advisory'
    ],
    logoSvg: (
      <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="12" fill="#FAF5FF" />
        <circle cx="50" cy="50" r="30" fill="#E8D5C4" opacity="0.3" />
        <path d="M40 35 H60 V40 H40 Z" fill="#5F249F" />
        <text x="24" y="72" fill="#5F249F" fontSize="32" fontWeight="900" fontFamily="sans-serif">G</text>
        <text x="50" y="72" fill="#5F249F" fontSize="32" fontWeight="900" fontFamily="sans-serif">T</text>
      </svg>
    )
  },
  // --- 7. CA Finalist: Job (Articles Completed) ---
  {
    id: 7,
    company: 'A.F. Ferguson & Co.',
    companyKey: 'affco',
    title: 'Senior Associate - Assurance (Articles Completed)',
    location: 'Karachi',
    country: 'Pakistan',
    level: 'CA Finalist',
    badge: 'CA Finalist',
    jobType: 'Full Time',
    workMode: 'On-site',
    deadline: '15 June 2026',
    deadlineDate: new Date('2026-06-15'),
    dateAdded: new Date('2026-06-02'),
    isNew: true,
    logoBg: 'bg-orange-500/10',
    description: 'A.F. Ferguson & Co. is seeking CA Finalists who have completed their mandatory 3.5 years of articleship and are currently preparing for CFAP/MSA examinations. You will lead fieldwork audit teams and supervise junior trainees on tier-1 clients.',
    requirements: [
      'CA Finalist (completed articleship / training contract from a QCR-rated firm)',
      'Experience leading statutory audit engagements and drafting audit reports',
      'Comprehensive understanding of IFRS 9, 15, 16, and ISAs',
      'Strong team management and client communication skills'
    ],
    logoSvg: (
      <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="12" fill="#FFF8F2" />
        <text x="20" y="55" fill="#D24626" fontSize="24" fontWeight="bold" fontFamily="sans-serif">AFF</text>
        <text x="20" y="78" fill="#1C1C1C" fontSize="12" fontWeight="bold" fontFamily="sans-serif">Ferguson</text>
      </svg>
    )
  },
  // --- 8. ACCA Finalist: Full Time / Hybrid Job ---
  {
    id: 8,
    company: 'Crowe Pakistan',
    companyKey: 'crowe',
    title: 'Corporate Taxation Associate',
    location: 'Islamabad',
    country: 'Pakistan',
    level: 'ACCA Finalist',
    badge: 'ACCA Finalist',
    jobType: 'Full Time',
    workMode: 'Hybrid',
    deadline: '10 June 2026',
    deadlineDate: new Date('2026-06-10'),
    dateAdded: new Date('2026-06-01'),
    isNew: false,
    logoBg: 'bg-sky-500/10',
    description: 'Crowe Pakistan is seeking an ACCA Finalist for its Islamabad tax division on a hybrid schedule. Prepare corporate income and sales tax returns, handle withholding statements, and assist clients during tax authority scrutiny.',
    requirements: [
      'ACCA Finalist / Part-Qualified with 1+ year practical tax exposure',
      'Familiarity with FBR IRIS portal and PRA/SRB return portals',
      'Detail-oriented and proficient in MS Excel modeling',
      'Self-driven with hybrid working discipline'
    ],
    logoSvg: (
      <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="12" fill="#F0F9FF" />
        <path d="M30 35 L70 35 L50 65 Z" fill="#005B94" />
        <text x="22" y="82" fill="#005B94" fontSize="16" fontWeight="bold" fontFamily="sans-serif">CROWE</text>
      </svg>
    )
  },
  // --- 9. PRC: Entry Guidance & Trainee Foundation ---
  {
    id: 9,
    company: 'EY Pakistan',
    companyKey: 'ey',
    title: 'PRC Trainee Foundation & Induction Mentorship',
    location: 'Multan',
    country: 'Pakistan',
    level: 'PRC',
    badge: 'PRC',
    jobType: 'Internship',
    workMode: 'On-site',
    deadline: '22 May 2026',
    deadlineDate: new Date('2026-05-22'),
    dateAdded: new Date('2026-05-20'),
    isNew: false,
    logoBg: 'bg-yellow-500/10',
    description: 'Orientation and foundational trainee internship for PRC passed students stepping into the CA journey. Learn fundamental double-entry bookkeeping, modern ERP tools, and prepare for CAF academic success.',
    requirements: [
      'PRC Qualified candidates registered with ICAP',
      'Dedication, curiosity, and eagerness to build a CA career',
      'Good teamwork aptitude and time discipline',
      'Basic accounting knowledge'
    ],
    logoSvg: eyLogo
  },
  // --- 10. CA Qualified: Manager / Senior Job ---
  {
    id: 10,
    company: 'KPMG Pakistan',
    companyKey: 'kpmg',
    title: 'Audit Manager - Financial Services',
    location: 'Karachi',
    country: 'Pakistan',
    level: 'CA Qualified',
    badge: 'CA Qualified',
    jobType: 'Full Time',
    workMode: 'On-site',
    deadline: '18 June 2026',
    deadlineDate: new Date('2026-06-18'),
    dateAdded: new Date('2026-05-18'),
    isNew: false,
    logoBg: 'bg-blue-900/10',
    description: 'KPMG Pakistan is hiring an Audit Manager for its Financial Services Group in Karachi. Oversee banking and insurance statutory audits, manage engagement profitability, and serve as primary liaison with client CFOs.',
    requirements: [
      'Qualified Chartered Accountant (FCA or ACA member of ICAP)',
      '3+ years of post-qualification experience in external audit',
      'In-depth knowledge of IFRS 9, Basel III, and SBP regulatory frameworks',
      'Proven client handling, leadership, and audit file sign-off skills'
    ],
    logoSvg: kpmgLogo
  },
  // --- 11. ACCA Affiliate: Virtual / Remote Contract Job ---
  {
    id: 11,
    company: 'Focus Accounting Tech (UK Client)',
    companyKey: 'pwc',
    title: 'Virtual US/UK Outsourced Tax & Accounts Associate',
    location: 'Islamabad',
    country: 'Pakistan',
    level: 'ACCA Affiliate',
    badge: 'ACCA Affiliate',
    jobType: 'Contract',
    workMode: 'Virtual / Remote',
    deadline: '05 June 2026',
    deadlineDate: new Date('2026-06-05'),
    dateAdded: new Date('2026-05-15'),
    isNew: false,
    logoBg: 'bg-amber-500/10',
    description: '100% remote virtual position servicing UK accounting firms. Manage cloud bookkeeping in Xero/QuickBooks, prepare UK VAT returns, and assist with corporation tax computations under UK GAAP / FRS 102.',
    requirements: [
      'ACCA Affiliate or Finalist',
      'Proficient in Xero, Dext, or QuickBooks Online',
      'Excellent written English and virtual communication discipline',
      'Stable high-speed internet connection for remote desktop access'
    ],
    logoSvg: pwcLogo
  },
  // --- 12. CA Finalist: Domestic Corporate Job ---
  {
    id: 12,
    company: 'BDO Pakistan',
    companyKey: 'bdo',
    title: 'Financial Analyst - Corporate Finance (CA Finalist)',
    location: 'Lahore',
    country: 'Pakistan',
    level: 'CA Finalist',
    badge: 'CA Finalist',
    jobType: 'Full Time',
    workMode: 'On-site',
    deadline: '20 June 2026',
    deadlineDate: new Date('2026-06-20'),
    dateAdded: new Date('2026-05-10'),
    isNew: false,
    logoBg: 'bg-blue-500/10',
    description: 'BDO Lahore Advisory practice is looking for a CA Finalist with completed articleship. This role involves building 3-statement financial models, preparing valuation decks, and conducting due diligence for M&A transactions.',
    requirements: [
      'CA Finalist (Articleship completed from a reputable chartered accountancy firm)',
      'Demonstrated expertise in DCF valuation and financial modeling',
      'Sharp commercial acumen and report drafting capability',
      'Immediate availability'
    ],
    logoSvg: bdoLogo
  },
  // --- 13. OVERSEAS: UAE - CA Qualified ---
  {
    id: 13,
    company: 'PwC Middle East',
    companyKey: 'pwc',
    title: 'Senior Auditor - Assurance (CA Qualified)',
    location: 'Dubai, UAE',
    country: 'United Arab Emirates',
    level: 'CA Qualified',
    badge: 'CA Qualified',
    jobType: 'Full Time',
    workMode: 'On-site',
    deadline: '28 June 2026',
    deadlineDate: new Date('2026-06-28'),
    dateAdded: new Date('2026-06-12'),
    isNew: true,
    isOverseas: true,
    logoBg: 'bg-amber-500/10',
    description: 'PwC Middle East is actively hiring Qualified Chartered Accountants (ICAP / ACCA) for its Dubai and Abu Dhabi assurance offices. Lead international audit field teams, review IFRS working papers, and collaborate across GCC markets. Full UAE visa sponsorship and relocation allowance provided.',
    requirements: [
      'Qualified Chartered Accountant (ICAP ACA) or ACCA Member',
      '2+ years of post-qualification external audit experience in Big 4',
      'Exemplary command of IFRS, ISA, and data analytics tools',
      'Willingness to relocate to Dubai, UAE'
    ],
    logoSvg: pwcLogo
  },
  // --- 14. OVERSEAS: Saudi Arabia - CA Finalist (Articles Completed) ---
  {
    id: 14,
    company: 'KPMG Saudi Arabia (Gulf Practice)',
    companyKey: 'kpmg',
    title: 'Audit Senior (CA Finalist Hire - Articles Completed)',
    location: 'Riyadh, KSA',
    country: 'Saudi Arabia',
    level: 'CA Finalist',
    badge: 'CA Finalist',
    jobType: 'Full Time',
    workMode: 'On-site',
    deadline: '30 June 2026',
    deadlineDate: new Date('2026-06-30'),
    dateAdded: new Date('2026-06-10'),
    isNew: true,
    isOverseas: true,
    logoBg: 'bg-blue-900/10',
    description: 'KPMG Saudi Arabia has an open hiring pipeline specifically for CA Finalists who have completed their 3.5 years of articleship in Pakistan. Position offers tax-free Gulf compensation, Saudi work visa, and rapid career progression in Riyadh.',
    requirements: [
      'CA Finalist (Articleship fully completed from Big 4 / top-10 CA firm in Pakistan)',
      'Demonstrated audit senior experience leading engagement teams',
      'High technical clarity in IFRS revenue recognition and leasing',
      'Available for prompt overseas deployment to Riyadh'
    ],
    logoSvg: kpmgLogo
  },
  // --- 15. OVERSEAS: United Kingdom - CA Qualified ---
  {
    id: 15,
    company: 'KPMG UK',
    companyKey: 'kpmg',
    title: 'Audit Assistant Manager - UK Skilled Worker Visa',
    location: 'London, UK',
    country: 'United Kingdom',
    level: 'CA Qualified',
    badge: 'CA Qualified',
    jobType: 'Full Time',
    workMode: 'On-site',
    deadline: '15 July 2026',
    deadlineDate: new Date('2026-07-15'),
    dateAdded: new Date('2026-06-08'),
    isNew: false,
    isOverseas: true,
    logoBg: 'bg-blue-900/10',
    description: 'KPMG UK is hiring Qualified Chartered Accountants for its central London commercial audit practice. Sponsor of UK Skilled Worker Visa with complete relocation package, health cover, and British pension scheme.',
    requirements: [
      'Qualified Chartered Accountant (ICAP ACA) or ACCA Member',
      'Minimum 3.5 years total audit experience (including Big 4 senior level)',
      'Expertise in complex IFRS group reporting and Sarbanes-Oxley (SOX) testing',
      'Eligible for UK Home Office visa sponsorship'
    ],
    logoSvg: kpmgLogo
  },
  // --- 16. OVERSEAS: Qatar - CA Qualified ---
  {
    id: 16,
    company: 'EY Qatar',
    companyKey: 'ey',
    title: 'Senior Financial Consultant - Advisory (CA Qualified)',
    location: 'Doha, Qatar',
    country: 'Qatar',
    level: 'CA Qualified',
    badge: 'CA Qualified',
    jobType: 'Full Time',
    workMode: 'On-site',
    deadline: '12 July 2026',
    deadlineDate: new Date('2026-07-12'),
    dateAdded: new Date('2026-06-07'),
    isNew: true,
    isOverseas: true,
    logoBg: 'bg-yellow-500/10',
    description: 'EY Doha practice invites Qualified Chartered Accountants to join its Strategy and Transactions consulting team in Qatar. Work on large infrastructure, sovereign wealth, and public sector advisory projects.',
    requirements: [
      'Qualified CA (ICAP) or ACCA Member',
      '2+ years experience in corporate valuation, transaction advisory, or audit',
      'Advanced financial modeling and presentation capabilities',
      'Tax-free salary package with Qatar work permit'
    ],
    logoSvg: eyLogo
  },
  // --- 17. OVERSEAS: Oman - CA Finalist Hire ---
  {
    id: 17,
    company: 'BDO Middle East (Oman)',
    companyKey: 'bdo',
    title: 'External Audit Senior (CA Finalist Hire)',
    location: 'Muscat, Oman',
    country: 'Oman',
    level: 'CA Finalist',
    badge: 'CA Finalist',
    jobType: 'Full Time',
    workMode: 'On-site',
    deadline: '08 July 2026',
    deadlineDate: new Date('2026-07-08'),
    dateAdded: new Date('2026-06-06'),
    isNew: true,
    isOverseas: true,
    logoBg: 'bg-blue-500/10',
    description: 'BDO Oman is recruiting CA Finalists who have completed their articleship training from Pakistan. This position provides regional GCC client exposure, tax-free compensation, furnished accommodation allowance, and annual return flights.',
    requirements: [
      'CA Finalist (Articles completed from an ICAP training firm)',
      'Substantial experience in external audit of manufacturing or trading entities',
      'Solid working knowledge of IFRS and ISA standards',
      'Ready for immediate relocation to Muscat'
    ],
    logoSvg: bdoLogo
  },
  // --- 18. Virtual / Remote CA Qualified role ---
  {
    id: 18,
    company: 'Global Offshore CFO Advisory',
    companyKey: 'pwc',
    title: 'Virtual Financial Controller (Remote UK/US Practice)',
    location: 'Remote, Pakistan',
    country: 'Pakistan',
    level: 'CA Qualified',
    badge: 'CA Qualified',
    jobType: 'Full Time',
    workMode: 'Virtual / Remote',
    deadline: '24 June 2026',
    deadlineDate: new Date('2026-06-24'),
    dateAdded: new Date('2026-06-09'),
    isNew: true,
    isOverseas: false,
    logoBg: 'bg-amber-500/10',
    description: 'Work from home as a Virtual Financial Controller managing financial consolidation, monthly management accounts, and cash flow forecasting for UK and European SME clients.',
    requirements: [
      'Qualified CA or ACCA Member with 2+ years experience',
      'Comprehensive understanding of US GAAP or UK GAAP (FRS 102)',
      'Hands-on mastery of NetSuite, Xero, or QuickBooks',
      'Dedicated remote home office setup'
    ],
    logoSvg: pwcLogo
  }
];
