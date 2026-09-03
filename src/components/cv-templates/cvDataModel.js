import aliAvatar from '../../assets/ali_iqbal.png';
import ayeshaAvatar from '../../assets/ayesha_khan.png';
import hassanAvatar from '../../assets/hassan_raza.png';
import iramAvatar from '../../assets/iram_fatima.png';
import bilalAvatar from '../../assets/m_bilal.png';
import usmanAvatar from '../../assets/usman_saleem.png';

/**
 * Available professional dummy avatars for instant selection
 */
export const DUMMY_AVATARS = [
  { id: 'ali', name: 'Ali Iqbal (CA Finalist)', src: aliAvatar },
  { id: 'ayesha', name: 'Ayesha Khan (ACCA Affiliate)', src: ayeshaAvatar },
  { id: 'hassan', name: 'Hassan Raza (Audit Senior)', src: hassanAvatar },
  { id: 'iram', name: 'Iram Fatima (Tax Associate)', src: iramAvatar },
  { id: 'bilal', name: 'Muhammad Bilal (CAF Qualified)', src: bilalAvatar },
  { id: 'usman', name: 'Usman Saleem (Advisory Lead)', src: usmanAvatar }
];

/**
 * Canonical Standard Articleship CV Data (Hafiz Muhammad Numan sample)
 */
export const DEFAULT_CV_DATA = {
  templateId: 'classic-black',
  profileImage: aliAvatar,
  fullName: 'Hafiz Muhammad Numan',
  ftsBatch: 'FTS – 35',
  crn: 'CRN - 129144',
  phone: '03104383648',
  address: 'House no 328/J Bismillah Street Walton Road Lahore',
  email: 'numanmughal78600@gmail.com',
  linkedin: 'https://www.linkedin.com/in/numan-mughal-55839a257',
  website: '',
  targetRole: 'Chartered Accountant Trainee / Articleship',
  
  languages: ['Urdu', 'English', 'Punjabi'],
  
  extraCurricular: [
    'Captain of Cricket Team at School and College level.',
    'Student of the year (2018)',
    '200 m Race Winner',
    'Winner of Chemistry Quiz Competition',
    'Winner of Poster Competition'
  ],
  
  reference: {
    name: 'Ali Imran ACA',
    designation: 'Teacher at School of Business Intelligence',
    email: 'ali.imran.144@gmail.com',
    phone: '+92 300 1234567'
  },

  personalStatement: 'Highly motivated and dedicated student who is looking forward to joining a reputable firm to pursue my career as a Chartered Accountant and enhance my knowledge of Accounting, Auditing and Taxation through practical exposure in a professional learning environment. I strongly believe that training will help me in achieving my career milestones. Integrity, strong ethics and adaptability are the basic values of my personality.',

  professionalQualifications: [
    {
      title: 'Assessment of Fundamental Competencies (AFC)',
      details: 'in 1 attempt',
      dateInfo: '(June 2021)'
    },
    {
      title: 'Certificate in Accounting and Finance (CAF)',
      details: 'qualified in 3 attempts',
      dateInfo: '(2 papers result awaited)'
    }
  ],

  academics: [
    {
      level: 'INTERMEDIATE',
      year: '(2020)',
      discipline: 'FSC Pre-Medical',
      institute: 'Forman Christian College',
      score: '76.27% (A)'
    },
    {
      level: 'MATRICULATION',
      year: '(2018)',
      discipline: 'Science',
      institute: 'Qurban and Surraya Educational Trust',
      score: '92.10% (A+)'
    }
  ],

  certifications: [
    'Ms. Office (SKANS Lahore)',
    'QuickBooks (Coursera)',
    'Foundations for Project Management (Coursera)',
    'Hafiz e Quran (Dar e Arqam)',
    'Presentation and Personal Effectiveness (SKANS) in process',
    'Data Analytics and Business Intelligence (Digiskills) in process',
    'Freelancing (Digiskills) in process'
  ],

  achievements: [
    '75% scholarship for Intermediate',
    'All papers passed in first attempt',
    'Merit Certificate in Accounting & Financial Reporting'
  ],

  skills: [
    'Financial Accounting & Reporting (IFRS / IAS)',
    'Audit Sampling & Risk Assessment',
    'Advanced MS Excel (VLOOKUP, Pivot Tables, XLOOKUP)',
    'QuickBooks & ERP Familiarity',
    'Strong Professional Skepticism & Attention to Detail',
    'Effective Business Communication & Presentation',
    'Time Management & Deadline Adherence'
  ],

  experience: [
    'Teaching Experience in Accounting & Business Mathematics at Academy and Home Tuition',
    'Freelance Bookkeeping & Financial Statement Preparation for local SME clients'
  ]
};

/**
 * Normalizes CV data so every template receives clean, predictable fields
 */
export function normalizeCVData(rawCV = {}) {
  const cv = { ...DEFAULT_CV_DATA, ...rawCV };

  return {
    templateId: cv.templateId || 'classic-black',
    profileImage: cv.profileImage || '',
    fullName: cv.fullName || 'Your Full Name',
    ftsBatch: cv.ftsBatch || '',
    crn: cv.crn || '',
    phone: cv.phone || '',
    address: cv.address || '',
    email: cv.email || '',
    linkedin: cv.linkedin || '',
    website: cv.website || '',
    targetRole: cv.targetRole || 'Audit & Assurance Trainee',
    personalStatement: cv.personalStatement || '',
    
    // Arrays
    languages: Array.isArray(cv.languages) ? cv.languages : [],
    extraCurricular: Array.isArray(cv.extraCurricular) ? cv.extraCurricular : [],
    certifications: Array.isArray(cv.certifications) ? cv.certifications : [],
    achievements: Array.isArray(cv.achievements) ? cv.achievements : [],
    skills: Array.isArray(cv.skills) ? cv.skills : [],
    experience: Array.isArray(cv.experience) ? cv.experience : [],

    // Structured Arrays
    professionalQualifications: Array.isArray(cv.professionalQualifications)
      ? cv.professionalQualifications
      : [],
    academics: Array.isArray(cv.academics) ? cv.academics : [],

    // Reference
    reference: cv.reference || {
      name: '',
      designation: '',
      email: '',
      phone: ''
    }
  };
}
