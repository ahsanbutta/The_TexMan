import { Phone, Mail, MapPin, Globe } from 'lucide-react';

/**
 * 30 — GRID PROFESSIONAL
 * Modular grid matrix layout: 2x2 structured sections for qualifications, academics, skills, and experience.
 */
export default function Template30_ModernExecutive({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[11px] leading-tight select-text min-h-[1050px] p-7 text-left">
      <div className="border-b-2 border-slate-900 pb-4 mb-4 flex justify-between items-center">
        <div>
          <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-widest">Chartered & Corporate Professional</span>
          <h1 className="text-2xl font-black text-black">{cv.fullName}</h1>
          <div className="text-xs text-slate-700 font-semibold">
            {[cv.ftsBatch, cv.crn, cv.targetRole || 'Audit & Financial Analyst'].filter(Boolean).join(' • ')}
          </div>
        </div>
        <div className="text-right text-[10px] text-zinc-600 space-y-0.5">
          {cv.phone && <div>📞 {cv.phone}</div>}
          {cv.email && <div>✉️ {cv.email}</div>}
          {cv.address && <div>📍 {cv.address}</div>}
        </div>
      </div>

      <div className="space-y-4">
        {cv.personalStatement && (
          <section className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <h2 className="text-xs font-black uppercase text-slate-900 mb-1">Executive Summary</h2>
            <p className="text-[10px] text-zinc-700 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {/* 2x2 Grid Structure */}
        <div className="grid grid-cols-2 gap-4">
          {/* Box 1: Qualifications */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              Qualifications (ICAP / ACCA)
            </h2>
            <div className="space-y-1 text-[10px]">
              {cv.professionalQualifications?.map((pq, idx) => (
                <div key={idx} className="pb-1 border-b border-slate-100 last:border-0">
                  <div className="font-bold text-black">{pq.title}</div>
                  <div className="text-slate-600 text-[9.5px]">{pq.details} {pq.dateInfo && `(${pq.dateInfo})`}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Box 2: Academics */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              Academic Background
            </h2>
            <div className="space-y-1 text-[10px]">
              {cv.academics?.map((acad, idx) => (
                <div key={idx} className="pb-1 border-b border-slate-100 last:border-0">
                  <div className="font-bold text-black">{acad.level} ({acad.discipline})</div>
                  <div className="text-slate-600 text-[9.5px]">{acad.institute} — {acad.year} ({acad.score})</div>
                </div>
              ))}
            </div>
          </div>

          {/* Box 3: Experience */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              Experience & Projects
            </h2>
            <ul className="list-disc pl-4 space-y-0.5 text-[9.5px] text-zinc-700">
              {cv.experience?.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          </div>

          {/* Box 4: Skills & Certifications */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              Skills & Certifications
            </h2>
            <div className="flex flex-wrap gap-1 mb-1">
              {cv.skills?.map((s, idx) => (
                <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded text-[8.5px] font-medium">{s}</span>
              ))}
            </div>
            <ul className="list-disc pl-4 space-y-0.5 text-[9px] text-zinc-600">
              {cv.certifications?.map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 flex justify-between text-[9px] text-zinc-600">
          <div><strong>Languages:</strong> {cv.languages?.join(', ')}</div>
          <div><strong>Activities:</strong> {cv.extraCurricular?.slice(0, 2).join(' • ')}</div>
          {cv.reference && cv.reference.name && (
            <div><strong>Reference:</strong> {cv.reference.name}</div>
          )}
        </div>
      </div>
    </div>
  );
}
