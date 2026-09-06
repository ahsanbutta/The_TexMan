import React, { useState } from 'react';
import { ShieldCheck, Lock, FileText, X, CheckCircle, AlertTriangle, Eye, Globe } from 'lucide-react';
import PortalModal from '../PortalModal';

export default function TermsAndPrivacyModal({ isOpen, onClose, initialTab = 'terms' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  return (
    <PortalModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl" className="p-0 overflow-hidden bg-white text-gray-800 rounded-3xl shadow-2xl border border-gray-100">
      {/* Header */}
      <div className="bg-[#021B3A] text-white p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-brandGreen/20 border border-brandGreen/30 flex items-center justify-center text-brandGreen">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-white">The TaxMan's Capital Governance</h2>
            <p className="text-xs text-emerald-300 font-medium">Terms of Service & Sensitive Data Protection Safeguards</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 mt-5 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeTab === 'terms' ? 'bg-brandGreen text-white shadow-md' : 'text-gray-300 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeTab === 'privacy' ? 'bg-brandGreen text-white shadow-md' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy & Data Protection Policy</span>
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 max-h-[60vh] overflow-y-auto space-y-5 text-xs text-gray-600 leading-relaxed font-normal">
        {activeTab === 'terms' ? (
          <>
            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-navy flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-brandGreen" />
                <span>1. Acceptance of Terms & Educational Purpose</span>
              </h3>
              <p>
                By creating an account, accessing study materials, or registering for counseling on <strong>The TaxMan's Capital</strong>, you agree to comply with these terms. This platform operates strictly as a <strong>100% free professional and educational mentorship initiative</strong> for students pursuing CA (ICAP), ACCA, and finance qualifications across Pakistan and globally.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-navy flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-brandGreen" />
                <span>2. Ethical Usage & Academic Integrity</span>
              </h3>
              <p>
                All resources, mock interview question banks, templates, and guides are for personal academic development only. Commercial reselling, unauthorized automated scraping, or re-distribution under false pretenses is strictly prohibited. Users must adhere to the high professional ethics standards established by the Institute of Chartered Accountants of Pakistan (ICAP).
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-navy flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-brandGreen" />
                <span>3. Verification & Mentorship Counseling</span>
              </h3>
              <p>
                Career counseling feedback, CV audits, and mock interview ratings are delivered in good faith by qualified Chartered Accountants and senior mentors to help candidates enhance their competitive standing for Big 4, SMP, and corporate opportunities. While our mentorship significantly elevates placement prospects, final induction and hiring decisions rest solely with independent firm recruitment boards.
              </p>
            </section>
          </>
        ) : (
          <>
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start space-x-3 text-emerald-900">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-extrabold text-xs block">Our Zero-Commercialization Pledge</span>
                <p className="text-[11px] leading-snug">
                  We treat candidate information with the utmost confidentiality. We do <strong>NOT</strong> sell, broker, or monetize your contact information, CV, academic attempts, or test results to third-party marketing companies.
                </p>
              </div>
            </div>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-navy flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-brandGreen" />
                <span>1. What Sensitive Data We Collect</span>
              </h3>
              <p>
                To provide tailored study roadmaps, induction CV reviews, and verified community access, we collect:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li><strong>Account Credentials:</strong> Full name, verified email address, username, and encrypted password.</li>
                <li><strong>Academic Profile:</strong> Qualification stage (e.g. PRC, CAF, CFAP, ACCA Inter) and target firm preferences.</li>
                <li><strong>Career Documents:</strong> Resumes/CVs uploaded for review, counseling queries, and mock interview performance metrics.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-navy flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-brandGreen" />
                <span>2. How Your Data is Safeguarded</span>
              </h3>
              <p>
                All transmitted data is encrypted via modern industry TLS/HTTPS encryption. CVs and personal student records are accessible only to lead mentors and authorized counseling administrators for the express purpose of career guidance.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-navy flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-brandGreen" />
                <span>3. Your Rights & Data Deletion</span>
              </h3>
              <p>
                You retain complete ownership of your data. At any time, you can:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Update or modify your profile and academic stage from your User Dashboard.</li>
                <li>Request a complete export or permanent deletion of your profile, queries, and uploaded documents by contacting <span className="text-brandGreen font-bold">privacy@thetaxmanscapital.com</span>.</li>
              </ul>
            </section>
          </>
        )}
      </div>

      {/* Footer CTA */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-[11px] text-gray-500">
          <CheckCircle className="w-4 h-4 text-brandGreen" />
          <span>Last updated: September 2026</span>
        </div>
        <button
          onClick={onClose}
          className="px-5 py-2 bg-navy hover:bg-navy-dark text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
        >
          Understood & Close
        </button>
      </div>
    </PortalModal>
  );
}
