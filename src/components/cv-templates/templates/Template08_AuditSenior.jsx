import { Phone, Mail, MapPin, Globe } from 'lucide-react';

/**
 * 08 — FINANCE EXECUTIVE
 * Structured financial presentation with executive KPI metric cards and strategic credentials.
 */
export default function Template08_AuditSenior({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[11px] leading-tight select-text min-h-[1050px] p-8 text-left">
      {/* Header */}
      <div className="bg-[#1e293b] text-white p-6 rounded-2xl mb-4 flex justify-between items-center">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Financial Strategy & Reporting</span>
          <h1 className="text-2xl font-black text-white">{cv.fullName}</h1>
          <div className="text-xs font-semibold text-slate-200">
            {[cv.ftsBatch, cv.crn, cv.targetRole || 'Finance Manager / Controller'].filter(Boolean).join(' • ')}
          </div>
        </div>
        <div className="text-right text-[10px] text-slate-300 space-y-0.5">
          {cv.phone && <div>📞 {cv.phone}</div>}
          {cv.email && <div>✉️ {cv.email}</div>}
          {cv.address && <div>📍 {cv.address}</div>}
        </div>
      </div>

      <div className="space-y-4">
        {cv.personalStatement && (
          <section className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <h2 className="text-xs font-black uppercase text-[#1e293b] mb-1">Executive Summary</h2>
            <p className="text-[10.5px] text-zinc-700 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-[#1e293b] border-b-2 border-amber-500 pb-0.5 mb-2">
              Chartered & Professional Accreditations
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-200 text-[10.5px]">
                  <div className="font-bold text-zinc-950">{pq.title}</div>
                  <div className="text-amber-900">{pq.details} {pq.dateInfo && `(${pq.dateInfo})`}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-[#1e293b] border-b-2 border-amber-500 pb-0.5 mb-1.5">
              Financial Operations & Management Experience
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-[10.5px] text-zinc-800">
              {cv.experience.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          </section>
        )}

        {cv.academics && cv.academics.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-[#1e293b] border-b-2 border-amber-500 pb-0.5 mb-1.5">
              Academic Qualifications
            </h2>
            <div className="space-y-1.5 text-[10.5px]">
              {cv.academics.map((acad, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-zinc-100 pb-1">
                  <div>
                    <strong>{acad.level}</strong> — <span className="text-zinc-700">{acad.discipline}</span> ({acad.institute})
                  </div>
                  <div className="font-semibold text-slate-800">{acad.year} | {acad.score}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-5">
          {cv.skills && cv.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#1e293b] border-b-2 border-amber-500 pb-0.5 mb-1">
                Financial Modeling & IFRS
              </h2>
              <div className="flex flex-wrap gap-1">
                {cv.skills.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-medium text-[9.5px] border border-slate-200">
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {cv.certifications && cv.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#1e293b] border-b-2 border-amber-500 pb-0.5 mb-1">
                Certifications
              </h2>
              <ul className="list-disc pl-4 space-y-0.5 text-[9.5px] text-zinc-700">
                {cv.certifications.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="pt-2 border-t border-zinc-200 flex justify-between text-[9.5px] text-zinc-600">
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
