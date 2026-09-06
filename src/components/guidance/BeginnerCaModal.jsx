import React, { useState } from 'react';
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
  X,
  MessageSquare,
  HelpCircle,
  TrendingUp,
  FileText
} from 'lucide-react';
import PortalModal from '../PortalModal';

export default function BeginnerCaModal({ isOpen, onClose, onOpenCommunity }) {
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'eligibility' | 'cost' | 'video'
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const stages = [
    {
      step: '01',
      title: 'PRC (Pre-Requisite Competencies)',
      duration: '6 to 9 Months',
      papers: '5 Computer-Based Papers (PRC 1 to 5)',
      desc: 'Entry stage covering Business Writing, Quantitative Methods, Principles of Economics, Financial Accounting, and Business Law. Exams held every month.',
      highlight: 'Exams held monthly at ICAP centers'
    },
    {
      step: '02',
      title: 'CAF (Certificate in Accounting & Finance)',
      duration: '1.5 to 2 Years',
      papers: '8 Written Papers (Group A & Group B)',
      desc: 'Intermediate level covering Financial Accounting, Cost Accounting, Tax, Audit, and Company Law. Passing CAF makes you eligible for Big 4 Articleship.',
      highlight: 'Passing opens Big 4 & Top 10 Firm Inductions'
    },
    {
      step: '03',
      title: '3.5-Year Articleship (Firm Training)',
      duration: '3.5 Years Hands-On',
      papers: 'Mandatory Practical Traineeship',
      desc: 'Paid training in top audit firms (EY, PwC, KPMG, Deloitte, BDO, etc.). You earn a monthly stipend while auditing multi-billion rupee corporate clients.',
      highlight: 'Paid training with real corporate audits'
    },
    {
      step: '04',
      title: 'CFAP & MSA (Final Qualifications)',
      duration: 'During & After Articleship',
      papers: '6 Advanced Papers + 2 Multi-Subject Case Studies',
      desc: 'Advanced corporate reporting, audit strategy, tax planning, and strategic management case study. Upon completion, you become a Chartered Accountant (ACA).',
      highlight: 'Award of Prestigious ACA Title'
    }
  ];

  const handleDownloadKit = () => {
    setDownloadSuccess(true);
    // Downloadable PDF roadmap summary
    const content = `THE TAXMAN'S CAPITAL - COMPLETE CA STARTER GUIDE FOR BEGINNERS
========================================================================
Eligibility Criteria:
- Minimum 50% in Intermediate (FSc, ICS, I.Com, FA) or equivalent.
- A-Levels with at least 3 subjects.
- Graduates (B.Com, BBA, BS) get exemptions in PRC.

The 4 CA Stages:
1. PRC (5 Papers): Monthly computer-based exams.
2. CAF (8 Papers): Written exams held twice a year (March & September).
3. 3.5 Years Articleship: Professional training in registered Chartered firms with monthly stipend.
4. CFAP & MSA: Final strategic papers.

Total Estimated Cost:
- ICAP Fee: ~Rs. 150,000 - 250,000 spread over 4-5 years.
- Compared to private universities charging Rs. 2,000,000+, CA is 80% more affordable with higher starting salaries.

Mentorship Helpdesk:
Website: https://thetaxmanscapital.com
Free Study Materials & Induction Hub: The TaxMan's Capital
Lead Mentor: Saboor Ahmad CA
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
    <PortalModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl" className="p-0 overflow-hidden bg-white text-gray-800 rounded-3xl shadow-2xl border border-gray-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#021B3A] via-[#032854] to-[#011429] text-white p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brandGreen/20 border border-brandGreen/30 text-brandGreen text-[11px] font-extrabold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Complete Beginner Guide for Intermediate & A-Levels</span>
        </div>

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight">
          What is CA & How to Start in Pakistan?
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-xl leading-relaxed">
          The ultimate entry blueprint for students aspiring to become a Chartered Accountant under ICAP. Learn the exact path, duration, cost, and firm opportunities.
        </p>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 mt-6 bg-white/10 p-1.5 rounded-2xl border border-white/10 overflow-x-auto scrollbar-none">
          {[
            { id: 'roadmap', label: 'The 4 Stages', icon: <TrendingUp className="w-3.5 h-3.5" /> },
            { id: 'eligibility', label: 'Eligibility & Rules', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
            { id: 'cost', label: 'Cost vs University', icon: <Coins className="w-3.5 h-3.5" /> },
            { id: 'video', label: 'Mentor Video & Kit', icon: <Video className="w-3.5 h-3.5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-brandGreen text-white shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 sm:p-8 max-h-[62vh] overflow-y-auto space-y-6">
        {activeTab === 'roadmap' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-navy">The Step-by-Step CA Pathway</h3>
                <p className="text-xs text-gray-500">From enrollment to becoming a globally qualified Chartered Accountant (ACA)</p>
              </div>
              <span className="text-[11px] font-bold text-brandGreen bg-brandGreen/10 px-2.5 py-1 rounded-full border border-brandGreen/20">
                Avg. Time: 4.5 – 5 Years
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {stages.map((stage) => (
                <div
                  key={stage.step}
                  className="p-5 rounded-2xl bg-[#F8F9FB] border border-gray-100 hover:border-brandGreen/30 hover:shadow-md transition-all space-y-2.5 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-brandGreen bg-brandGreen/10 px-2 py-0.5 rounded-md">
                      STAGE {stage.step}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{stage.duration}</span>
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-navy">{stage.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{stage.desc}</p>

                  <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-gray-500">{stage.papers}</span>
                  </div>
                  <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                    ✓ {stage.highlight}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'eligibility' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-navy">Who Can Start CA in Pakistan?</h3>
              <p className="text-xs text-gray-500">ICAP has straightforward entry criteria open to all academic disciplines</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#F8F9FB] border border-gray-100 flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-xl bg-brandGreen/10 text-brandGreen flex items-center justify-center font-black flex-shrink-0 mt-0.5">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-navy text-sm">Intermediate Students (FSc, ICS, I.Com, FA)</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Students with at least <strong>50% marks</strong> in HSSC (Pre-Medical, Pre-Engineering, ICS, Commerce, or General Arts) can directly register for PRC. Pre-Medical students are widely successful in CA!
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F9FB] border border-gray-100 flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black flex-shrink-0 mt-0.5">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-navy text-sm">Cambridge / A-Levels Students</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Minimum 3 A-Level subjects with passing grades (IBCC Equivalence of at least 50%).
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F9FB] border border-gray-100 flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-black flex-shrink-0 mt-0.5">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-navy text-sm">University Graduates (B.Com, BBA, BS Accounting)</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Graduates with 14 or 16 years of education can claim exemptions from PRC and jump directly into CAF level.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cost' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-navy">Why CA is 80% More Affordable Than University</h3>
              <p className="text-xs text-gray-500">Comparison of total financial investment and career ROI</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-emerald-800 text-sm">CA (Chartered Accountancy)</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[10px]">ICAP</span>
                </div>
                <div className="text-2xl font-black text-emerald-700">~Rs. 200,000 - 300,000</div>
                <p className="text-emerald-900 leading-relaxed">
                  Fee paid paper-by-paper over 4-5 years. Plus, during your 3.5-year articleship, the audit firm pays <strong>YOU</strong> a monthly stipend (approx. Rs. 20,000 - 35,000/mo), recovering most of your education expense before qualifying!
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-gray-800 text-sm">Private University Degree</span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-300 text-gray-700 font-extrabold text-[10px]">LUMS / IBA / Private</span>
                </div>
                <div className="text-2xl font-black text-gray-700">Rs. 2,000,000 - 4,500,000+</div>
                <p className="text-gray-600 leading-relaxed">
                  High semester fees, hostel costs, and general degrees with no guaranteed internship or articleship placement upon graduation.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'video' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-navy">Lead Mentor Welcome & Starter Kit</h3>
              <p className="text-xs text-gray-500">Listen to Saboor Ahmad CA breakdown how you can navigate your career</p>
            </div>

            {/* Video Placeholder Player Card */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-tr from-[#021B3A] to-[#090C11] aspect-video flex flex-col items-center justify-center text-center p-6 border border-white/10 shadow-lg">
              <div className="w-16 h-16 rounded-full bg-brandGreen/20 border-2 border-brandGreen flex items-center justify-center text-brandGreen mb-3 shadow-lg shadow-brandGreen/30 animate-pulse">
                <Play className="w-7 h-7 fill-current ml-1" />
              </div>
              <h4 className="text-sm sm:text-base font-black text-white">"Welcome to Chartered Accountancy"</h4>
              <p className="text-xs text-gray-300 mt-1 max-w-md">
                Recorded session by lead mentor <strong>Saboor Ahmad CA</strong> on navigating PRC, exam techniques, and Big 4 mindsets.
              </p>
              <span className="mt-3 px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold text-emerald-300 border border-white/10">
                100% Free Mentorship • The TaxMan's Capital
              </span>
            </div>

            {/* Starter Kit Download Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-brandGreen/10 border border-brandGreen/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-brandGreen text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-black text-navy block">Download CA Beginner Starter Guide (PDF)</span>
                  <span className="text-[11px] text-gray-500">Includes subject syllabi, study timetable, and ICAP registration guide</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadKit}
                className="w-full sm:w-auto px-5 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer flex-shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>{downloadSuccess ? 'Downloaded!' : 'Download Free Kit'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Support Banner */}
      <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-gray-600">
          <MessageSquare className="w-4 h-4 text-brandGreen flex-shrink-0" />
          <span>Have questions about starting CA? Join our <strong>Beginner Helpdesk Group</strong> on WhatsApp.</span>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenCommunity) onOpenCommunity();
            }}
            className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            Join Beginner Community →
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </PortalModal>
  );
}
