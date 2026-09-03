import { Phone, Mail, MapPin, Globe } from 'lucide-react';

/**
 * 29 — CARD BASED
 * Modular card containers for each section with clean borders, shadow-2xs, and distinct section titles.
 */
export default function Template29_FinanceGraduate({ cv }) {
  return (
    <div className="w-full bg-[#f8fafc] text-zinc-900 font-sans text-[11px] leading-tight select-text min-h-[1050px] p-6 sm:p-7 text-left space-y-3.5">
      {/* Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex justify-between items-center">
        <div className="space-y-1">
          <span className="text-[9.5px] font-bold text-blue-600 uppercase tracking-widest">Chartered Accounting & Audit</span>
          <h1 className="text-2xl font-black text-slate-900">{cv.fullName}</h1>
          <div className="text-xs text-slate-600 font-semibold">
            {[cv.ftsBatch, cv.crn, cv.targetRole || 'Audit & Assurance Trainee'].filter(Boolean).join(' • ')}
          </div>
        </div>
        <div className="text-right text-[10px] text-slate-600 space-y-0.5">
          {cv.phone && <div>📞 {cv.phone}</div>}
          {cv.email && <div>✉️ {cv.email}</div>}
          {cv.address && <div>📍 {cv.address}</div>}
        </div>
      </div>

      {/* Summary Card */}
      {cv.personalStatement && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <h2 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-1">Executive Summary</h2>
          <p className="text-[10px] text-slate-700 leading-relaxed text-justify">{cv.personalStatement}</p>
        </div>
      )}

      {/* Qualifications Card */}
      {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <h2 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-2">Professional Accreditations</h2>
          <div className="grid grid-cols-2 gap-2">
            {cv.professionalQualifications.map((pq, idx) => (
              <div key={idx} className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-[10.5px]">
                <div className="font-bold text-slate-900">{pq.title}</div>
                <div className="text-slate-600 text-[10px]">{pq.details} {pq.dateInfo && `(${pq.dateInfo})`}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience Card */}
      {cv.experience && cv.experience.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <h2 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-1.5">Professional Experience</h2>
          <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-slate-700">
            {cv.experience.map((e, idx) => (
              <li key={idx}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Education Card */}
      {cv.academics && cv.academics.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <h2 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-1.5">Academic Background</h2>
          <div className="space-y-1 text-[10px]">
            {cv.academics.map((acad, idx) => (
              <div key={idx} className="flex justify-between border-b border-slate-100 pb-1">
                <div><strong>{acad.level}</strong> — {acad.discipline} ({acad.institute})</div>
                <span className="font-semibold text-blue-900">{acad.year} | {acad.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid Cards (Skills & Certifications) */}
      <div className="grid grid-cols-2 gap-3.5">
        {cv.skills && cv.skills.length > 0 && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-1.5">Competencies</h2>
            <div className="flex flex-wrap gap-1">
              {cv.skills.map((s, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-900 rounded font-medium text-[9px] border border-blue-100">{s}</span>
              ))}
            </div>
          </div>
        )}

        {cv.certifications && cv.certifications.length > 0 && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-1.5">Certifications</h2>
            <ul className="list-disc pl-4 space-y-0.5 text-[9.5px] text-slate-700">
              {cv.certifications.map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between text-[9px] text-slate-600">
        <div><strong>Languages:</strong> {cv.languages?.join(', ')}</div>
        <div><strong>Activities:</strong> {cv.extraCurricular?.slice(0, 2).join(' • ')}</div>
        {cv.reference && cv.reference.name && (
          <div><strong>Reference:</strong> {cv.reference.name}</div>
        )}
      </div>
    </div>
  );
}
