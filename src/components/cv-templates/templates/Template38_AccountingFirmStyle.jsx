import { Phone, Mail, MapPin, Globe } from 'lucide-react';

/**
 * 38 — EXPERIENCED ACCOUNTANT
 * Heavy practical experience focus: GL, financial reporting, and ERP operations dominate, education condensed.
 */
export default function Template38_AccountingFirmStyle({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[11px] leading-tight select-text min-h-[1050px] p-7 text-left">
      <div className="border-b-2 border-slate-800 pb-4 mb-4 flex justify-between items-center">
        <div>
          <span className="text-[9.5px] font-bold text-slate-700 uppercase tracking-widest">General Ledger & Financial Accounting Senior</span>
          <h1 className="text-2xl font-black text-black">{cv.fullName}</h1>
          <div className="text-xs text-slate-600 font-semibold">
            {[cv.ftsBatch, cv.crn, cv.targetRole || 'Senior Accountant'].filter(Boolean).join(' • ')}
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
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-zinc-200 pb-0.5 mb-1">
              Professional Summary
            </h2>
            <p className="text-[10.5px] text-zinc-700 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {/* 1. Experience Dominates FIRST */}
        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-zinc-200 pb-0.5 mb-1">
              Accounting & Financial Operations Experience
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-[10.5px] text-zinc-800">
              {cv.experience.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          </section>
        )}

        {/* 2. Qualifications */}
        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-zinc-200 pb-0.5 mb-1.5">
              Professional Accreditations
            </h2>
            <div className="space-y-1.5">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="p-2 bg-slate-50 rounded border-l-3 border-slate-700 flex justify-between items-baseline text-[10.5px]">
                  <div>
                    <span className="font-bold text-zinc-950">{pq.title}</span>
                    <span className="text-zinc-600 ml-2">({pq.details})</span>
                  </div>
                  {pq.dateInfo && <span className="text-[10px] font-semibold text-slate-700">{pq.dateInfo}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-5">
          {cv.skills && cv.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-zinc-200 pb-0.5 mb-1">
                ERP & Accounting Software
              </h2>
              <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-zinc-700">
                {cv.skills.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </section>
          )}

          {cv.academics && cv.academics.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-zinc-200 pb-0.5 mb-1">
                Education
              </h2>
              <div className="space-y-1 text-[10px]">
                {cv.academics.map((acad, idx) => (
                  <div key={idx}>
                    <strong>{acad.level}</strong> — {acad.institute} ({acad.year})
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="pt-2 border-t border-zinc-200 flex justify-between text-[9.5px] text-zinc-600">
          <div><strong>Languages:</strong> {cv.languages?.join(', ')}</div>
          <div><strong>Certifications:</strong> {cv.certifications?.slice(0, 2).join(' • ')}</div>
          {cv.reference && cv.reference.name && (
            <div><strong>Reference:</strong> {cv.reference.name}</div>
          )}
        </div>
      </div>
    </div>
  );
}
