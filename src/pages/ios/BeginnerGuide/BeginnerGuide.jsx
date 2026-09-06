import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  Download,
  Video,
  Play,
  CheckCircle2,
  BookOpen,
  Briefcase,
  Award,
  Clock,
  Coins,
  ChevronLeft,
  MessageSquare,
  HelpCircle,
  TrendingUp,
  FileText,
  Building2,
  Users,
  ShieldCheck,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import mentorImage from '../../../assets/mentor_portrait.png';

export default function BeginnerGuide({ onNavigateTab }) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const stages = [
    {
      step: '01',
      title: 'PRC (Pre-Requisite Competencies)',
      duration: '6 to 9 Months',
      papers: '5 Computer-Based Papers (PRC 1 to 5)',
      desc: 'Entry stage covering Business Writing, Quantitative Methods, Principles of Economics, Financial Accounting, and Business Law. Exams are held every month at ICAP assessment centers across Pakistan.',
      highlight: 'Monthly computer-based testing with rapid results',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
    },
    {
      step: '02',
      title: 'CAF (Certificate in Accounting & Finance)',
      duration: '1.5 to 2 Years',
      papers: '8 Written Papers (Group A & Group B)',
      desc: 'Intermediate level covering Financial Accounting (FAR 1 & 2), Cost & Management Accounting, Business Law, Company Law, Taxation, and Audit & Assurance. Passing CAF makes you eligible for Big 4 articleship.',
      highlight: 'Clearing CAF unlocks Big 4 & Top 10 Firm Articleship',
      badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    },
    {
      step: '03',
      title: '3.5-Year Articleship (Practical Training)',
      duration: '3.5 Years Hands-On',
      papers: 'Mandatory Real-World Traineeship',
      desc: 'Paid professional training in registered Chartered Accountancy firms (PwC, EY, KPMG, Deloitte, BDO, etc.). You earn a mandatory monthly stipend while auditing multi-billion rupee corporate clients.',
      highlight: 'Paid training with mandatory monthly stipend',
      badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20'
    },
    {
      step: '04',
      title: 'CFAP & MSA (Final Qualifications)',
      duration: 'Taken during & after articleship',
      papers: '6 Advanced Papers + 2 Case Studies',
      desc: 'Advanced corporate reporting, audit strategy, tax planning, business finance, and multi-subject case studies. Passing these leads to the prestigious title of Chartered Accountant (ACA).',
      highlight: 'Award of Prestigious ACA Title & Global Practice Rights',
      badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    }
  ];

  const faqs = [
    {
      q: 'Can Pre-Medical, Pre-Engineering, or ICS students do CA?',
      a: 'Yes, absolutely! There is no requirement of having an accounting background. In fact, many top position holders in ICAP come from Pre-Engineering, Pre-Medical, and ICS backgrounds because of strong analytical skills. The PRC entry stage starts from absolute fundamentals.'
    },
    {
      q: 'What are the minimum eligibility criteria to join CA after Intermediate or A-Levels?',
      a: 'You need a minimum of 50% marks in Intermediate (FSc, ICS, I.Com, FA) or at least two A-Level passes (with an IBCC equivalence certificate). University graduates (BS, BBA, B.Com) can also join and may get exemptions from the PRC stage.'
    },
    {
      q: 'How much stipend do students receive during the 3.5 years articleship?',
      a: 'ICAP specifies mandatory minimum monthly stipends for all registered training firms. As of current regulations, trainees receive approximately PKR 19,000 to PKR 30,000+ per month depending on the year of articleship and firm classification.'
    },
    {
      q: 'How is CA different from a 4-year BBA or BS Accounting degree?',
      a: 'A university degree provides academic knowledge without practical work experience. In contrast, CA integrates 3.5 years of rigorous, real-world corporate audit and advisory experience inside top accounting firms before you qualify. Furthermore, CA has global recognition and reciprocity with ICAEW (UK), CPA Australia, and CA ANZ.'
    },
    {
      q: 'What happens if I fail a paper in CA?',
      a: 'Failing a paper is common in professional qualifications. In CA, you only need to re-sit the specific paper you did not clear — you never repeat an entire academic year. PRC exams take place every month, and CAF exams occur twice a year (March and September).'
    }
  ];

  const handleDownloadKit = () => {
    setDownloadSuccess(true);
    const content = `THE TAXMAN'S CAPITAL - COMPLETE CA PAKISTAN STARTER GUIDE FOR BEGINNERS
========================================================================
1. What is CA?
Chartered Accountancy (CA) awarded by the Institute of Chartered Accountants of Pakistan (ICAP)
is the highest professional finance and accounting qualification in the country, recognized globally.

2. Eligibility:
- Intermediate (FSc, ICS, I.Com, FA) with minimum 50% marks.
- A-Levels with at least 2 passes (plus IBCC equivalence).
- Graduates (BBA, BS, B.Com) qualify for fast-track entry and PRC exemptions.

3. The 4 Career Stages:
- Stage 1: PRC (Pre-Requisite Competencies) - 5 Computer Based Papers. Held monthly.
- Stage 2: CAF (Certificate in Accounting & Finance) - 8 Written Papers. Group A & B.
- Stage 3: 3.5-Year Articleship - Paid practical training at PwC, EY, KPMG, Deloitte, etc.
- Stage 4: CFAP & MSA - Advanced papers & Multi-Subject Case Studies.

4. Cost Comparison:
- CA Total Investment: ~PKR 400,000 - 600,000 over 4-5 years.
- Private University Degree: PKR 2,500,000 - 4,500,000+.
- Result: CA is ~80% more affordable and includes a monthly training stipend!

5. Next Steps:
- Register at ICAP website (icap.org.pk).
- Access free notes, CV reviews, and mentor sessions at The TaxMan's Capital.
Website: https://thetaxmanscapital.com
Free Mentorship & Inquiries: info@thetaxmanscapital.com
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'CA_Pakistan_Beginner_Starter_Guide.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen bg-bgLight">
      {/* Top Header & Breadcrumb */}
      <section className="bg-navy text-white pt-12 pb-16 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brandGreen/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-brandGreen/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb / Back Button */}
          <div className="mb-6">
            <button
              onClick={() => {
                if (onNavigateTab) onNavigateTab('Home');
                else {
                  window.history.pushState(null, '', '/');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }
              }}
              className="inline-flex items-center space-x-2 text-xs font-bold text-gray-300 hover:text-brandGreen bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brandGreen/15 border border-brandGreen/30 text-brandGreen text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Beginner's Master Blueprint</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-['Outfit',sans-serif]">
                What is CA & How to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brandGreen via-emerald-400 to-teal-300">
                  Start in Pakistan?
                </span>
              </h1>

              <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed font-normal">
                Everything you need to know about the Chartered Accountancy qualification by ICAP: eligibility criteria, the 4 stages, fee comparison vs university degrees, Big 4 articleship, and salary prospects.
              </p>

              {/* Quick Summary Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm">
                  <span className="text-[10px] uppercase font-extrabold text-brandGreen tracking-wider block">Duration</span>
                  <span className="text-sm sm:text-base font-black text-white">4.5 – 5 Years</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm">
                  <span className="text-[10px] uppercase font-extrabold text-brandGreen tracking-wider block">Eligibility</span>
                  <span className="text-sm sm:text-base font-black text-white">50% Inter / A-Levels</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm">
                  <span className="text-[10px] uppercase font-extrabold text-brandGreen tracking-wider block">Training</span>
                  <span className="text-sm sm:text-base font-black text-white">Paid Articleship</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm">
                  <span className="text-[10px] uppercase font-extrabold text-brandGreen tracking-wider block">Recognition</span>
                  <span className="text-sm sm:text-base font-black text-white">Global (ICAP)</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={handleDownloadKit}
                  className="inline-flex items-center space-x-2 px-5 py-3 bg-brandGreen hover:bg-brandGreen-dark text-white text-xs sm:text-sm font-extrabold rounded-xl transition-all shadow-md shadow-brandGreen/20 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloadSuccess ? 'Guide Downloaded!' : 'Download Starter Kit (.txt)'}</span>
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('ca-stages-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center space-x-2 px-5 py-3 bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-bold rounded-xl border border-white/10 transition-colors cursor-pointer"
                >
                  <span>Explore the 4 Stages</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Card / Quote */}
            <div className="lg:col-span-4">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={mentorImage}
                    alt="Saboor Ahmad CA"
                    className="w-14 h-14 rounded-full object-cover border-2 border-brandGreen"
                  />
                  <div>
                    <h3 className="text-sm font-extrabold text-white">Saboor Ahmad</h3>
                    <span className="text-[11px] text-brandGreen font-bold uppercase">CA, ACCA • Lead Mentor</span>
                  </div>
                </div>
                <p className="text-xs text-gray-300 italic leading-relaxed border-t border-white/10 pt-3">
                  "CA is not about extraordinary genius; it is about discipline, consistency, and professional work ethics. If you pass CAF and step into Big 4 articleship, your career trajectory will be extraordinary."
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (onNavigateTab) onNavigateTab('Counseling');
                    }}
                    className="w-full py-2.5 bg-brandGreen/20 hover:bg-brandGreen/30 text-brandGreen border border-brandGreen/30 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Book Free 1-on-1 Guidance Call →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. What is CA & Why Choose It? */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-extrabold text-brandGreen uppercase tracking-widest">WHY CHARTERED ACCOUNTANCY?</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
              The Gold Standard of Corporate Leadership & Finance in Pakistan
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
              Chartered Accountancy is the premier business and finance credential regulated by the <strong className="text-navy">Institute of Chartered Accountants of Pakistan (ICAP)</strong> under the Chartered Accountants Ordinance, 1961.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
              Unlike academic business degrees, CA qualifies you with statutory authority to audit listed public companies, advise board members on international tax frameworks, and lead multinational organizations as CFOs and CEOs.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-brandGreen shrink-0 mt-0.5" />
                <span className="text-xs font-bold text-navy">Statutory Audit Rights in Pakistan</span>
              </div>
              <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-brandGreen shrink-0 mt-0.5" />
                <span className="text-xs font-bold text-navy">ICAEW & CPA Global Reciprocity</span>
              </div>
              <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-brandGreen shrink-0 mt-0.5" />
                <span className="text-xs font-bold text-navy">Direct C-Suite Executive Pathway</span>
              </div>
              <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-brandGreen shrink-0 mt-0.5" />
                <span className="text-xs font-bold text-navy">High Demand in Gulf (KSA & UAE)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-md space-y-6">
            <h3 className="text-lg font-extrabold text-navy pb-3 border-b border-gray-100">
              Who Can Join CA? (Eligibility Criteria)
            </h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 font-black flex items-center justify-center text-xs shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-navy">Intermediate Students (HSSC)</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Minimum <strong>50% marks</strong> in FSc Pre-Medical, Pre-Engineering, ICS, I.Com, or FA.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 font-black flex items-center justify-center text-xs shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-navy">A-Levels / Cambridge Students</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Minimum <strong>2 passes</strong> in A-Levels with IBCC equivalence. No accounting background required.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 font-black flex items-center justify-center text-xs shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-navy">University Graduates (Fast-Track)</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Graduates with 14 or 16 years of education (B.Com, BBA, BS) qualify for fast-track exemptions in PRC.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 font-medium">
              💡 <strong>Myth Buster:</strong> You do NOT need an accounting or commerce background. Science and engineering students start from paper PRC-1 and excel with flying colors.
            </div>
          </div>
        </div>
      </section>

      {/* 2. The 4 Stages Roadmap */}
      <section id="ca-stages-section" className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 flex flex-col items-center">
            <span className="text-xs font-extrabold text-brandGreen uppercase tracking-widest mb-2">COMPLETE ROADMAP</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight pb-3 relative">
              The 4 Stages of Chartered Accountancy
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-brandGreen rounded-full" />
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-4 leading-relaxed font-medium">
              From your first computer-based exam in PRC to high-stakes multi-subject case studies, here is the structured step-by-step pathway to becoming an ACA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stages.map((stg) => (
              <div
                key={stg.step}
                className="bg-gray-50 rounded-3xl border border-gray-200 p-6 sm:p-8 hover:shadow-xl hover:border-brandGreen transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-gray-300 group-hover:text-brandGreen transition-colors">
                      {stg.step}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold border ${stg.badgeColor}`}>
                      {stg.duration}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-navy mb-2 group-hover:text-brandGreen transition-colors">
                    {stg.title}
                  </h3>

                  <div className="inline-block px-3 py-1 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-700 mb-4">
                    {stg.papers}
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                    {stg.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-xs font-bold text-navy">
                  <span className="text-brandGreen">★ {stg.highlight}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Cost Comparison vs University Degrees */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 flex flex-col items-center">
          <span className="text-xs font-extrabold text-brandGreen uppercase tracking-widest mb-2">FINANCIAL REALITY & ROI</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight pb-3 relative">
            Cost Comparison: CA vs 4-Year University Degrees
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-brandGreen rounded-full" />
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-4 leading-relaxed font-medium">
            CA is one of the very few prestigious qualifications where you do not incur crippling debt. In fact, students earn a guaranteed stipend during their 3.5 years of practical training.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* CA Card */}
          <div className="bg-gradient-to-br from-[#021B3A] to-[#042A58] text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <span className="px-3 py-1 bg-brandGreen/20 text-brandGreen border border-brandGreen/30 text-xs font-extrabold rounded-full uppercase tracking-wider">
                Recommended Choice
              </span>
              <h3 className="text-2xl font-black">Chartered Accountancy (CA)</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Pay per stage only for exam registrations and study material. Zero campus overheads or semester lab charges.
              </p>

              <div className="py-4 border-y border-white/10 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Total 5-Year ICAP Exam & Registration Fee:</span>
                  <span className="font-bold text-white">~PKR 250,000 – 350,000</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Estimated Tuition & Books:</span>
                  <span className="font-bold text-white">~PKR 200,000 – 300,000</span>
                </div>
                <div className="flex justify-between text-xs pt-2 border-t border-white/10">
                  <span className="font-extrabold text-brandGreen">Total Estimated Investment:</span>
                  <span className="font-black text-brandGreen text-sm">~PKR 500,000 – 650,000</span>
                </div>
              </div>

              <div className="p-4 bg-white/10 rounded-2xl border border-brandGreen/30 text-xs text-brandGreen font-bold flex items-center space-x-2">
                <Coins className="w-5 h-5 shrink-0" />
                <span>Earn PKR 800,000 – 1,200,000+ total stipend during 3.5 years articleship!</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-xs text-gray-300 font-semibold">
              Net Cost: CA pays for itself through the mandatory articleship training stipend.
            </div>
          </div>

          {/* University Degree Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="px-3 py-1 bg-gray-100 text-gray-600 border border-gray-200 text-xs font-extrabold rounded-full uppercase tracking-wider">
                Traditional University
              </span>
              <h3 className="text-2xl font-black text-navy">Private University BBA / BS Degree</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                4-year degree programs with recurring semester fees, lab fees, campus charges, and zero guaranteed internship stipend.
              </p>

              <div className="py-4 border-y border-gray-100 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">8 Semesters Tuition (Top Private Unis):</span>
                  <span className="font-bold text-navy">PKR 2,400,000 – 4,500,000+</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Hostel, Books & Campus Fees:</span>
                  <span className="font-bold text-navy">PKR 600,000 – 1,200,000</span>
                </div>
                <div className="flex justify-between text-xs pt-2 border-t border-gray-100">
                  <span className="font-extrabold text-rose-600">Total Estimated Cost:</span>
                  <span className="font-black text-rose-600 text-sm">PKR 3,000,000 – 5,500,000+</span>
                </div>
              </div>

              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-800 font-bold">
                ⚠️ University graduates still have to struggle for entry-level internships with zero audit rights.
              </div>
            </div>

            <div className="text-xs text-gray-500 font-semibold">
              Conclusion: CA is over 80% cheaper while granting vastly superior market recognition.
            </div>
          </div>
        </div>
      </section>

      {/* 4. Starter Kit & Mentor Presentation */}
      <section className="py-16 bg-navy text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-extrabold text-brandGreen uppercase tracking-widest">FREE BEGINNER STARTER KIT</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit',sans-serif]">
                Download Your Official CA Starter Pack
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
                We have compiled a comprehensive onboarding pack containing the ICAP syllabus breakdown for PRC 1 to 5, sample MCQs, formula sheets, and a firm application timeline.
              </p>

              <div className="space-y-2 pt-2 text-xs text-gray-300">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-brandGreen" />
                  <span>PRC 1 to 5 Syllabus and Recommended Books List</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-brandGreen" />
                  <span>Step-by-step ICAP online student registration guide</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-brandGreen" />
                  <span>Big 4 Articleship eligibility benchmarks</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleDownloadKit}
                  className="inline-flex items-center space-x-2 px-6 py-3.5 bg-brandGreen hover:bg-brandGreen-dark text-white text-xs sm:text-sm font-extrabold rounded-xl transition-all shadow-lg shadow-brandGreen/20 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloadSuccess ? 'File Downloaded Successfully!' : 'Download Complete Starter Guide (.txt)'}</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brandGreen/20 text-brandGreen flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-white">Join the PRC Students Community</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Connect with 4,200+ students currently preparing for PRC exams. Share notes, discuss questions, and get peer motivation.
              </p>
              <button
                onClick={() => {
                  window.open('https://chat.whatsapp.com/example1', '_blank');
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition-colors cursor-pointer shadow-md"
              >
                Join Official PRC WhatsApp Group →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQs for Beginners */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 flex flex-col items-center">
          <span className="text-xs font-extrabold text-brandGreen uppercase tracking-widest mb-2">COMMON QUESTIONS</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight pb-2 relative">
            Frequently Asked Questions by New Students
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-brandGreen rounded-full" />
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4.5 text-left flex items-center justify-between text-sm font-extrabold text-navy hover:text-brandGreen transition-colors cursor-pointer"
              >
                <span className="flex-1 pr-4">{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-brandGreen shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 font-medium">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. Bottom Banner / Next Steps */}
      <section className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-navy to-[#052347] text-white rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">Still Have Questions About Starting CA?</h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Book a 100% Free 1-on-1 counseling session with Saboor Ahmad and senior CA mentors to evaluate your career goals.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                if (onNavigateTab) onNavigateTab('Counseling');
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-brandGreen hover:bg-brandGreen-dark text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer whitespace-nowrap"
            >
              Book 1-on-1 Session Free →
            </button>
            <button
              onClick={() => {
                if (onNavigateTab) onNavigateTab('Home');
              }}
              className="w-full sm:w-auto px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/10 transition-colors cursor-pointer whitespace-nowrap"
            >
              Return to Home
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
