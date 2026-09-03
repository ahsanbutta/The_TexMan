import Template01_ClassicBlack from './templates/Template01_ClassicBlack';
import Template02_ModernNavy from './templates/Template02_ModernNavy';
import Template03_ATSMinimal from './templates/Template03_ATSMinimal';
import Template04_Big4Executive from './templates/Template04_Big4Executive';
import Template05_EmeraldFinance from './templates/Template05_EmeraldFinance';
import Template06_CleanSingleColumn from './templates/Template06_CleanSingleColumn';
import Template07_CorporateSidebar from './templates/Template07_CorporateSidebar';
import Template08_AuditSenior from './templates/Template08_AuditSenior';
import Template09_StudentGraduate from './templates/Template09_StudentGraduate';
import Template10_ElegantBurgundy from './templates/Template10_ElegantBurgundy';
import Template11_ModernTwoColumn from './templates/Template11_ModernTwoColumn';
import Template12_ATSFriendlyCorporate from './templates/Template12_ATSFriendlyCorporate';
import Template13_NordicMinimalist from './templates/Template13_NordicMinimalist';
import Template14_BankingCapital from './templates/Template14_BankingCapital';
import Template15_CharteredLead from './templates/Template15_CharteredLead';
import Template16_CompactOnePage from './templates/Template16_CompactOnePage';
import Template17_ExecutiveDirector from './templates/Template17_ExecutiveDirector';
import Template18_AcademicFellow from './templates/Template18_AcademicFellow';
import Template19_InternationalIFRS from './templates/Template19_InternationalIFRS';
import Template20_CreativeFinance from './templates/Template20_CreativeFinance';
import Template21_DeloitteStyleGreen from './templates/Template21_DeloitteStyleGreen';
import Template22_GoldPrestige from './templates/Template22_GoldPrestige';
import Template23_FinanceExecutive from './templates/Template23_FinanceExecutive';
import Template24_AuditProfessional from './templates/Template24_AuditProfessional';
import Template25_TaxSpecialist from './templates/Template25_TaxSpecialist';
import Template26_BigFourProfessional from './templates/Template26_BigFourProfessional';
import Template27_CAGraduate from './templates/Template27_CAGraduate';
import Template28_ACCAGraduate from './templates/Template28_ACCAGraduate';
import Template29_FinanceGraduate from './templates/Template29_FinanceGraduate';
import Template30_ModernExecutive from './templates/Template30_ModernExecutive';
import Template31_CorporateMinimal from './templates/Template31_CorporateMinimal';
import Template32_PremiumBlack from './templates/Template32_PremiumBlack';
import Template33_ProfessionalBlue from './templates/Template33_ProfessionalBlue';
import Template34_CleanGreenFinance from './templates/Template34_CleanGreenFinance';
import Template35_InternationalProfessional from './templates/Template35_InternationalProfessional';
import Template36_ConsultingStyle from './templates/Template36_ConsultingStyle';
import Template37_InvestmentBankingStyle from './templates/Template37_InvestmentBankingStyle';
import Template38_AccountingFirmStyle from './templates/Template38_AccountingFirmStyle';
import Template39_AuditAssurance from './templates/Template39_AuditAssurance';
import Template40_FinancialAnalyst from './templates/Template40_FinancialAnalyst';
import Template41_ManagementTrainee from './templates/Template41_ManagementTrainee';
import Template42_InternshipProfessional from './templates/Template42_InternshipProfessional';
import Template43_FreshGraduateMinimal from './templates/Template43_FreshGraduateMinimal';
import Template44_ExperiencedAccountant from './templates/Template44_ExperiencedAccountant';
import Template45_SeniorFinanceProfessional from './templates/Template45_SeniorFinanceProfessional';
import Template46_ExecutiveSidebar from './templates/Template46_ExecutiveSidebar';
import Template47_UltraMinimalATS from './templates/Template47_UltraMinimalATS';

/**
 * Filter Categories for the Canva-style Template Selector
 */
export const TEMPLATE_CATEGORIES = [
  'All',
  'Professional',
  'Modern',
  'Minimal',
  'Executive',
  'Student',
  'CA / ACCA',
  'Finance / Audit',
  'ATS Friendly',
  'Creative',
  'Academic'
];

/**
 * Central Template Registry: 47 Genuinely Distinct Professional CV Templates
 */
export const CV_TEMPLATES = [
  {
    id: 'classic-corporate',
    number: '01',
    name: 'Classic Corporate',
    category: 'Professional',
    secondaryCategories: ['Professional', 'ATS Friendly'],
    layoutType: 'Single Column Traditional',
    description: 'Traditional single-column layout with horizontal rule separators and conservative typography.',
    isATSFriendly: true,
    recommendedFor: ['Accounting Firms', 'Articleship', 'Corporate Submissions'],
    hasPhoto: false,
    component: Template01_ClassicBlack
  },
  {
    id: 'modern-two-column',
    number: '02',
    name: 'Modern Two Column',
    category: 'Modern',
    secondaryCategories: ['Modern', 'Professional'],
    layoutType: 'Two Column Split (40/60)',
    description: 'Distinct 40/60 two-column split with top navy header and dedicated contact/competency sidebar.',
    isATSFriendly: false,
    recommendedFor: ['Audit Trainee', 'Finance Specialist', 'Advisory'],
    hasPhoto: true,
    component: Template02_ModernNavy
  },
  {
    id: 'left-sidebar',
    number: '03',
    name: 'Left Sidebar',
    category: 'Modern',
    secondaryCategories: ['Modern', 'CA / ACCA'],
    layoutType: 'Left Sidebar (33/67)',
    description: 'Strong dark vertical sidebar with top circular portrait, contact details, and right-side main body.',
    isATSFriendly: false,
    recommendedFor: ['CA Student', 'ACCA Candidate', 'Articleship'],
    hasPhoto: true,
    component: Template03_ATSMinimal
  },
  {
    id: 'right-sidebar',
    number: '04',
    name: 'Right Sidebar',
    category: 'Professional',
    secondaryCategories: ['Professional', 'Finance / Audit'],
    layoutType: 'Right Sidebar (67/33)',
    description: 'Asymmetric inverted structure with wide left experience area and right credentials sidebar.',
    isATSFriendly: false,
    recommendedFor: ['Audit Senior', 'Accounting Professional'],
    hasPhoto: true,
    component: Template04_Big4Executive
  },
  {
    id: 'minimal-ats',
    number: '05',
    name: 'Minimal ATS',
    category: 'ATS Friendly',
    secondaryCategories: ['ATS Friendly', 'Minimal'],
    layoutType: 'Single Column Pure ATS',
    description: 'Pure 100% semantic single-column layout without sidebars, graphics, or icons for flawless ATS parsing.',
    isATSFriendly: true,
    recommendedFor: ['MNC Portals', 'Automated Screenings', 'Direct HR Submissions'],
    hasPhoto: false,
    component: Template05_EmeraldFinance
  },
  {
    id: 'modern-ats',
    number: '06',
    name: 'Modern ATS',
    category: 'ATS Friendly',
    secondaryCategories: ['ATS Friendly', 'Modern'],
    layoutType: 'Single Column Modern ATS',
    description: 'Single-column modern layout with large professional name and subtle section rule dividers.',
    isATSFriendly: true,
    recommendedFor: ['Big Four Applications', 'Corporate Accounting', 'MNCs'],
    hasPhoto: false,
    component: Template06_CleanSingleColumn
  },
  {
    id: 'executive',
    number: '07',
    name: 'Executive',
    category: 'Executive',
    secondaryCategories: ['Executive', 'Professional'],
    layoutType: 'Executive Editorial Serif',
    description: 'Executive-level CV with large serif typography, generous margins, and board leadership statement callout.',
    isATSFriendly: false,
    recommendedFor: ['Partner Track', 'Financial Controller', 'CFO'],
    hasPhoto: false,
    component: Template07_CorporateSidebar
  },
  {
    id: 'finance-executive',
    number: '08',
    name: 'Finance Executive',
    category: 'Finance / Audit',
    secondaryCategories: ['Finance / Audit', 'Executive'],
    layoutType: 'Financial KPI Block Layout',
    description: 'Financial operations presentation with structured KPI blocks and corporate finance credentials.',
    isATSFriendly: false,
    recommendedFor: ['Finance Manager', 'Financial Controller', 'Treasury Head'],
    hasPhoto: false,
    component: Template08_AuditSenior
  },
  {
    id: 'accounting-professional',
    number: '09',
    name: 'Accounting Professional',
    category: 'CA / ACCA',
    secondaryCategories: ['CA / ACCA', 'Professional'],
    layoutType: 'Credentials Pinned Header',
    description: 'Certification-focused layout with ICAP and ACCA credentials prominently pinned at the top.',
    isATSFriendly: false,
    recommendedFor: ['Chartered Accountant', 'ACCA Member', 'Audit Senior'],
    hasPhoto: false,
    component: Template09_StudentGraduate
  },
  {
    id: 'audit-professional',
    number: '10',
    name: 'Audit Professional',
    category: 'Finance / Audit',
    secondaryCategories: ['Finance / Audit', 'Professional'],
    layoutType: 'Audit Methodology Timeline',
    description: 'Audit & assurance layout highlighting ISA testing assertions and practical client engagement records.',
    isATSFriendly: false,
    recommendedFor: ['Statutory Auditor', 'Audit Senior', 'Assurance Trainee'],
    hasPhoto: false,
    component: Template10_ElegantBurgundy
  },
  {
    id: 'tax-professional',
    number: '11',
    name: 'Tax Professional',
    category: 'Finance / Audit',
    secondaryCategories: ['Finance / Audit', 'Professional'],
    layoutType: 'Tax Compliance & Legal Matrix',
    description: 'Specialized direct and indirect tax law layout with compliance badges and advisory structure.',
    isATSFriendly: false,
    recommendedFor: ['Tax Consultant', 'Corporate Tax Associate', 'Legal Advisor'],
    hasPhoto: false,
    component: Template11_ModernTwoColumn
  },
  {
    id: 'big-four-style',
    number: '12',
    name: 'Big Four Style',
    category: 'Professional',
    secondaryCategories: ['Professional', 'ATS Friendly', 'Finance / Audit'],
    layoutType: 'Corporate Dense Consulting',
    description: 'Clean consulting-inspired design with high information density, crisp dividers, and corporate headers.',
    isATSFriendly: true,
    recommendedFor: ['PwC / EY / KPMG / Deloitte Inductions', 'Advisory Roles'],
    hasPhoto: false,
    component: Template12_ATSFriendlyCorporate
  },
  {
    id: 'consulting',
    number: '13',
    name: 'Consulting',
    category: 'Professional',
    secondaryCategories: ['Professional', 'ATS Friendly'],
    layoutType: 'Impact-Driven Consulting Bullets',
    description: 'Management consulting format (McKinsey/BCG style) emphasizing quantitative impact and case leadership.',
    isATSFriendly: true,
    recommendedFor: ['Strategy Consultant', 'Management Consultant', 'Advisory Associate'],
    hasPhoto: false,
    component: Template13_NordicMinimalist
  },
  {
    id: 'financial-analyst',
    number: '14',
    name: 'Financial Analyst',
    category: 'Finance / Audit',
    secondaryCategories: ['Finance / Audit', 'Modern'],
    layoutType: 'Quantitative Skills Spotlight',
    description: 'Analytical visual hierarchy with prominent quantitative modeling skills and financial data sections.',
    isATSFriendly: false,
    recommendedFor: ['FP&A Analyst', 'Financial Modeler', 'Valuation Associate'],
    hasPhoto: false,
    component: Template14_BankingCapital
  },
  {
    id: 'investment-banking',
    number: '15',
    name: 'Investment Banking',
    category: 'Finance / Audit',
    secondaryCategories: ['Finance / Audit', 'ATS Friendly'],
    layoutType: 'Wall Street Dense Format',
    description: 'Dense Wall Street financial analyst format with tight margins and transaction/valuation emphasis.',
    isATSFriendly: true,
    recommendedFor: ['M&A Analyst', 'Investment Banker', 'Corporate Finance'],
    hasPhoto: false,
    component: Template15_CharteredLead
  },
  {
    id: 'graduate',
    number: '16',
    name: 'Graduate',
    category: 'Student',
    secondaryCategories: ['Student', 'Modern'],
    layoutType: 'Education First Layout',
    description: 'Fresh graduate focused layout: Education and academic honors appear first before experience.',
    isATSFriendly: false,
    recommendedFor: ['Fresh Graduate', 'Entry-Level Trainee', 'University Student'],
    hasPhoto: false,
    component: Template16_CompactOnePage
  },
  {
    id: 'ca-student',
    number: '17',
    name: 'CA Student',
    category: 'CA / ACCA',
    secondaryCategories: ['CA / ACCA', 'Student'],
    layoutType: 'ICAP Exam Progress Breakdown',
    description: 'Designed specifically for ICAP CA students: Highlights PRC/CAF stages, attempts, and articleship readiness.',
    isATSFriendly: false,
    recommendedFor: ['ICAP CAF Qualified', 'CA Articleship Candidate', 'CFAP Student'],
    hasPhoto: true,
    component: Template17_ExecutiveDirector
  },
  {
    id: 'acca-student',
    number: '18',
    name: 'ACCA Student',
    category: 'CA / ACCA',
    secondaryCategories: ['CA / ACCA', 'Student'],
    layoutType: 'ACCA Applied Skills Breakdown',
    description: 'Designed specifically for ACCA students & affiliates: Highlights Applied Skills and Strategic Professional papers.',
    isATSFriendly: false,
    recommendedFor: ['ACCA Student', 'ACCA Affiliate', 'Oxford Brookes Graduate'],
    hasPhoto: true,
    component: Template18_AcademicFellow
  },
  {
    id: 'internship',
    number: '19',
    name: 'Internship',
    category: 'Student',
    secondaryCategories: ['Student', 'Minimal'],
    layoutType: 'Internship Potential Format',
    description: 'Designed for internship & articleship applicants: Prioritizes education, core skills, and extracurriculars.',
    isATSFriendly: false,
    recommendedFor: ['Summer Intern', 'Articleship Inductions', 'Trainee'],
    hasPhoto: false,
    component: Template19_InternationalIFRS
  },
  {
    id: 'academic',
    number: '20',
    name: 'Academic',
    category: 'Academic',
    secondaryCategories: ['Academic', 'ATS Friendly'],
    layoutType: 'Scholarly Academic Format',
    description: 'Academic & faculty fellow CV format: Education near top, scholarly typography, and research/teaching credentials.',
    isATSFriendly: true,
    recommendedFor: ['Lecturer', 'Teaching Assistant', 'Research Fellow'],
    hasPhoto: false,
    component: Template20_CreativeFinance
  },
  {
    id: 'timeline',
    number: '21',
    name: 'Timeline',
    category: 'Modern',
    secondaryCategories: ['Modern', 'Creative'],
    layoutType: 'Vertical Node Timeline',
    description: 'Experience and education are structured in a continuous vertical timeline with node connectors and milestone dots.',
    isATSFriendly: false,
    recommendedFor: ['Experienced Trainee', 'Career Switcher', 'Audit Senior'],
    hasPhoto: false,
    component: Template21_DeloitteStyleGreen
  },
  {
    id: 'split-header',
    number: '22',
    name: 'Split Header',
    category: 'Modern',
    secondaryCategories: ['Modern', 'Professional'],
    layoutType: 'Split Header (50/50)',
    description: 'Header divided into two distinct visual areas: Left side has Name & Subtitle, Right side has Contact Matrix.',
    isATSFriendly: false,
    recommendedFor: ['Chartered Accountant', 'Finance Associate'],
    hasPhoto: false,
    component: Template22_GoldPrestige
  },
  {
    id: 'centered-profile',
    number: '23',
    name: 'Centered Profile',
    category: 'Modern',
    secondaryCategories: ['Modern', 'Professional'],
    layoutType: 'Centered Symmetrical Header',
    description: 'Centered profile header with centered photo, centered title tagline, and structured body below.',
    isATSFriendly: false,
    recommendedFor: ['Public Speaker', 'Advisory Specialist', 'Finance Professional'],
    hasPhoto: true,
    component: Template23_FinanceExecutive
  },
  {
    id: 'editorial',
    number: '24',
    name: 'Editorial',
    category: 'Creative',
    secondaryCategories: ['Creative', 'Executive'],
    layoutType: 'Magazine Editorial Display',
    description: 'Magazine/journal editorial typography: Prominent serif display headline, generous whitespace, stylized quotes.',
    isATSFriendly: false,
    recommendedFor: ['Consultant', 'Financial Journalist', 'Senior Executive'],
    hasPhoto: false,
    component: Template24_AuditProfessional
  },
  {
    id: 'compact-professional',
    number: '25',
    name: 'Compact Professional',
    category: 'Minimal',
    secondaryCategories: ['Minimal', 'Professional'],
    layoutType: 'High-Density 2-Column Grid',
    description: 'Highly compact, space-efficient 2-column layout designed for experienced candidates with multiple credentials.',
    isATSFriendly: false,
    recommendedFor: ['Experienced Accountant', 'Audit Manager', 'Senior Tax Specialist'],
    hasPhoto: false,
    component: Template25_TaxSpecialist
  },
  {
    id: 'premium-monochrome',
    number: '26',
    name: 'Premium Monochrome',
    category: 'Minimal',
    secondaryCategories: ['Minimal', 'ATS Friendly'],
    layoutType: 'Swiss Monochrome Typography',
    description: 'High-contrast Swiss Black & White typography masterpiece. Zero color, pure typographic elegance.',
    isATSFriendly: true,
    recommendedFor: ['Corporate Auditing', 'Banking', 'Advisory'],
    hasPhoto: false,
    component: Template26_BigFourProfessional
  },
  {
    id: 'color-block',
    number: '27',
    name: 'Color Block',
    category: 'Creative',
    secondaryCategories: ['Creative', 'Modern'],
    layoutType: 'Architectural Geometric Block',
    description: 'Uses an architectural structural color block spanning the left corner and header, altering page composition.',
    isATSFriendly: false,
    recommendedFor: ['CA Trainee', 'Modern Financial Analyst'],
    hasPhoto: false,
    component: Template27_CAGraduate
  },
  {
    id: 'top-band',
    number: '28',
    name: 'Top Band',
    category: 'Modern',
    secondaryCategories: ['Modern', 'Professional'],
    layoutType: 'Full-Width Top Header Band',
    description: 'Large bold header band with integrated contact pill chips and photo badge, transitioning into a clean 2-column body.',
    isATSFriendly: false,
    recommendedFor: ['Audit Trainee', 'Accounting Senior'],
    hasPhoto: true,
    component: Template28_ACCAGraduate
  },
  {
    id: 'card-based',
    number: '29',
    name: 'Card Based',
    category: 'Modern',
    secondaryCategories: ['Modern', 'Creative'],
    layoutType: 'Modular Card Containers',
    description: 'Modular card containers for each section with clean borders, shadow-2xs, and distinct section titles.',
    isATSFriendly: false,
    recommendedFor: ['Tech-Accounting', 'Fintech Trainee', 'Modern Auditor'],
    hasPhoto: false,
    component: Template29_FinanceGraduate
  },
  {
    id: 'grid-professional',
    number: '30',
    name: 'Grid Professional',
    category: 'Modern',
    secondaryCategories: ['Modern', 'Professional'],
    layoutType: '2x2 Modular Grid Matrix',
    description: 'Modular grid matrix layout: 2x2 structured sections for qualifications, academics, skills, and experience.',
    isATSFriendly: false,
    recommendedFor: ['Financial Controller', 'Audit Associate', 'Senior Trainee'],
    hasPhoto: false,
    component: Template30_ModernExecutive
  },
  {
    id: 'asymmetric',
    number: '31',
    name: 'Asymmetric',
    category: 'Modern',
    secondaryCategories: ['Modern', 'ATS Friendly'],
    layoutType: 'Asymmetric Split (35/65)',
    description: 'Modern asymmetric layout with 35% Left / 65% Right structural division and clean typography.',
    isATSFriendly: true,
    recommendedFor: ['Corporate Auditing', 'Consulting', 'Accounting'],
    hasPhoto: false,
    component: Template31_CorporateMinimal
  },
  {
    id: 'creative-professional',
    number: '32',
    name: 'Creative Professional',
    category: 'Creative',
    secondaryCategories: ['Creative', 'Modern'],
    layoutType: 'Fintech Capsule Design',
    description: 'Modern Fintech / Tech-Accounting format with rounded tag capsules, dark accents, and contemporary layout.',
    isATSFriendly: false,
    recommendedFor: ['Fintech Trainee', 'Financial Modeler', 'Data Analyst'],
    hasPhoto: false,
    component: Template32_PremiumBlack
  },
  {
    id: 'international',
    number: '33',
    name: 'International',
    category: 'Professional',
    secondaryCategories: ['Professional', 'CA / ACCA'],
    layoutType: 'Global Corporate Format',
    description: 'Global corporate format with international cross-border reporting & IFRS standardization layout.',
    isATSFriendly: false,
    recommendedFor: ['Cross-Border Audit', 'IFRS Advisory', 'Multinational Trainee'],
    hasPhoto: false,
    component: Template33_ProfessionalBlue
  },
  {
    id: 'european-style',
    number: '34',
    name: 'European Style',
    category: 'Professional',
    secondaryCategories: ['Professional', 'Academic'],
    layoutType: 'Europass Structure',
    description: 'Europass/European-inspired curriculum vitae structure with dedicated Personal Information block and CEFR language matrix.',
    isATSFriendly: false,
    recommendedFor: ['European Inductions', 'International Firms', 'ACCA UK'],
    hasPhoto: false,
    component: Template34_CleanGreenFinance
  },
  {
    id: 'modern-minimal',
    number: '35',
    name: 'Modern Minimal',
    category: 'Minimal',
    secondaryCategories: ['Minimal', 'ATS Friendly'],
    layoutType: 'Understated Elegance Single Column',
    description: 'Ultra-clean typography, generous whitespace, understated elegance, zero clutter.',
    isATSFriendly: true,
    recommendedFor: ['Modern Accounting', 'Corporate Advisory', 'Direct Applications'],
    hasPhoto: false,
    component: Template35_InternationalProfessional
  },
  {
    id: 'data-analytics',
    number: '36',
    name: 'Data / Analytics',
    category: 'Finance / Audit',
    secondaryCategories: ['Finance / Audit', 'Modern'],
    layoutType: 'Technical Tool Stack Hierarchy',
    description: 'Designed for finance/data/analytical candidates: Technical software competencies (Power BI, Python, SQL, Advanced Excel) highlighted.',
    isATSFriendly: false,
    recommendedFor: ['Financial Data Analyst', 'BI Specialist', 'Valuation Associate'],
    hasPhoto: false,
    component: Template36_ConsultingStyle
  },
  {
    id: 'management-trainee',
    number: '37',
    name: 'Management Trainee',
    category: 'Student',
    secondaryCategories: ['Student', 'Professional'],
    layoutType: 'Leadership Honors First',
    description: 'Designed for MT / Leadership programs: Academics, leadership roles, case competitions, and potential prioritized.',
    isATSFriendly: false,
    recommendedFor: ['Management Trainee Officer (MTO)', 'Leadership Graduate Program'],
    hasPhoto: false,
    component: Template37_InvestmentBankingStyle
  },
  {
    id: 'experienced-accountant',
    number: '38',
    name: 'Experienced Accountant',
    category: 'Professional',
    secondaryCategories: ['Professional', 'Finance / Audit'],
    layoutType: 'General Ledger Operations Dominant',
    description: 'Heavy practical experience focus: GL, financial reporting, and ERP operations dominate, education condensed.',
    isATSFriendly: false,
    recommendedFor: ['Senior GL Accountant', 'Financial Reporting Senior', 'Audit Senior'],
    hasPhoto: false,
    component: Template38_AccountingFirmStyle
  },
  {
    id: 'senior-finance',
    number: '39',
    name: 'Senior Finance',
    category: 'Executive',
    secondaryCategories: ['Executive', 'Finance / Audit'],
    layoutType: 'Board Level Leadership Format',
    description: 'CFO / Head of Finance format: Corporate governance, capital structure, and multi-entity consolidation prioritized.',
    isATSFriendly: false,
    recommendedFor: ['CFO', 'Head of Finance', 'Finance Director'],
    hasPhoto: false,
    component: Template39_AuditAssurance
  },
  {
    id: 'photo-modern',
    number: '40',
    name: 'Photo Modern',
    category: 'Modern',
    secondaryCategories: ['Modern', 'Creative'],
    layoutType: 'Asymmetric Portrait Card Header',
    description: 'Photo plays a meaningful structural role: Asymmetric floating portrait card on left anchoring the entire modern layout.',
    isATSFriendly: false,
    recommendedFor: ['Audit Trainee', 'Client-Facing Consultant', 'Advisory'],
    hasPhoto: true,
    component: Template40_FinancialAnalyst
  },
  {
    id: 'no-photo-professional',
    number: '41',
    name: 'No Photo Professional',
    category: 'Professional',
    secondaryCategories: ['Professional', 'ATS Friendly'],
    layoutType: 'Expansive Width Photo-Free',
    description: 'Intentionally photo-free clean corporate layout with expansive text width and conservative typography.',
    isATSFriendly: true,
    recommendedFor: ['Corporate Auditing', 'US / UK Firm Submissions', 'Strict No-Photo Requirements'],
    hasPhoto: false,
    component: Template41_ManagementTrainee
  },
  {
    id: 'portfolio-style',
    number: '42',
    name: 'Portfolio Style',
    category: 'Creative',
    secondaryCategories: ['Creative', 'Professional'],
    layoutType: 'Structured Engagement Cards',
    description: 'Portfolio-inspired professional CV: Highlights client case engagements, audit projects, and advisory deliverables in card grids.',
    isATSFriendly: false,
    recommendedFor: ['Consulting Associate', 'Audit Senior', 'Advisory Specialist'],
    hasPhoto: false,
    component: Template42_InternshipProfessional
  },
  {
    id: 'professional-resume',
    number: '43',
    name: 'Professional Resume',
    category: 'ATS Friendly',
    secondaryCategories: ['ATS Friendly', 'Professional'],
    layoutType: 'Standard US Resume Format',
    description: 'American-style standard 1-page/2-page executive resume format with achievement-driven bullets and clean line separators.',
    isATSFriendly: true,
    recommendedFor: ['US Accounting Firms', 'MNCs', 'Direct Applications'],
    hasPhoto: false,
    component: Template43_FreshGraduateMinimal
  },
  {
    id: 'ats-advanced',
    number: '44',
    name: 'ATS Advanced',
    category: 'ATS Friendly',
    secondaryCategories: ['ATS Friendly', 'Minimal'],
    layoutType: 'Pure Machine Readable Semantic',
    description: 'Pure machine-parser compliant resume. Zero icons, zero sidebars, semantic hierarchy, standard margins.',
    isATSFriendly: true,
    recommendedFor: ['Taleo / Workday Screening', 'High-Volume Applications', 'Online Job Boards'],
    hasPhoto: false,
    component: Template44_ExperiencedAccountant
  },
  {
    id: 'ats-executive',
    number: '45',
    name: 'ATS Executive',
    category: 'ATS Friendly',
    secondaryCategories: ['ATS Friendly', 'Executive'],
    layoutType: 'Executive Machine Readable',
    description: 'ATS-compliant Executive Resume: High machine readability, executive summary section, leadership bullets.',
    isATSFriendly: true,
    recommendedFor: ['Executive Searches', 'Board Submissions', 'MNC Management'],
    hasPhoto: false,
    component: Template45_SeniorFinanceProfessional
  },
  {
    id: 'ats-finance',
    number: '46',
    name: 'ATS Finance',
    category: 'ATS Friendly',
    secondaryCategories: ['ATS Friendly', 'Finance / Audit'],
    layoutType: 'Finance Specialized ATS Format',
    description: 'Finance & Audit-specialized ATS format for accounting, treasury, and compliance applications.',
    isATSFriendly: true,
    recommendedFor: ['Senior Accounting Positions', 'Treasury & Audit Jobs', 'Corporate Banking'],
    hasPhoto: false,
    component: Template46_ExecutiveSidebar
  },
  {
    id: 'ats-ca-acca',
    number: '47',
    name: 'ATS CA / ACCA',
    category: 'ATS Friendly',
    secondaryCategories: ['ATS Friendly', 'CA / ACCA'],
    layoutType: 'CA / ACCA Articleship Machine Format',
    description: 'Specialized machine-readable format for CA & ACCA articleship, audit, tax, and accounting trainees.',
    isATSFriendly: true,
    recommendedFor: ['Big Four Online Portals', 'Training Firm Portals', 'Articleship Applications'],
    hasPhoto: false,
    component: Template47_UltraMinimalATS
  }
];

/**
 * Fast ID to Template Map
 */
export const TEMPLATE_MAP = CV_TEMPLATES.reduce((acc, tpl) => {
  acc[tpl.id] = tpl;
  return acc;
}, {});

/**
 * Deterministic AI / Smart Match Recommendation
 */
export function getRecommendedTemplate(cvData) {
  if (!cvData) return CV_TEMPLATES[0];

  const role = (cvData.targetRole || '').toLowerCase();
  const fts = (cvData.ftsBatch || '').toLowerCase();
  const qual = (cvData.professionalQualifications || []).map(q => (q.title + ' ' + q.details).toLowerCase()).join(' ');

  if (role.includes('director') || role.includes('partner') || role.includes('controller') || role.includes('cfo')) {
    return TEMPLATE_MAP['executive'] || TEMPLATE_MAP['senior-finance'] || CV_TEMPLATES[6];
  }

  if (qual.includes('acca') || role.includes('acca')) {
    return TEMPLATE_MAP['acca-student'] || CV_TEMPLATES[17];
  }

  if (qual.includes('icap') || qual.includes('caf') || fts.includes('fts') || role.includes('articleship')) {
    return TEMPLATE_MAP['ca-student'] || CV_TEMPLATES[16];
  }

  if (role.includes('tax')) {
    return TEMPLATE_MAP['tax-professional'] || CV_TEMPLATES[10];
  }

  if (role.includes('analyst') || role.includes('model') || role.includes('fp&a')) {
    return TEMPLATE_MAP['financial-analyst'] || TEMPLATE_MAP['data-analytics'] || CV_TEMPLATES[13];
  }

  if (role.includes('graduate') || role.includes('fresh')) {
    return TEMPLATE_MAP['graduate'] || CV_TEMPLATES[15];
  }

  return TEMPLATE_MAP['classic-corporate'] || CV_TEMPLATES[0];
}

/**
 * Surprise Me Random Template Picker
 */
export function getRandomTemplate(currentId) {
  const others = CV_TEMPLATES.filter(t => t.id !== currentId);
  if (!others.length) return CV_TEMPLATES[0];
  const idx = Math.floor(Math.random() * others.length);
  return others[idx];
}

/**
 * Helper to get template metadata by ID with safe fallback
 */
export function getTemplateById(id) {
  return TEMPLATE_MAP[id] || CV_TEMPLATES[0];
}

/**
 * Helper to get template component by ID with safe fallback
 */
export function getTemplateComponent(templateId) {
  const found = TEMPLATE_MAP[templateId];
  if (found && found.component) {
    return found.component;
  }
  return Template01_ClassicBlack;
}
