import { Phone, Mail, MapPin, Globe } from 'lucide-react';

/**
 * 42 — PORTFOLIO STYLE
 * Portfolio-inspired professional CV: Highlights client case engagements, audit projects, and advisory deliverables.
 */
export default function Template42_InternshipProfessional({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[11px] leading-tight select-text min-h-[1050px] p-7 text-left">
      <div className="border-b-2 border-indigo-700 pb-4 mb-4 flex justify-between items-center">
        <div>
          <span className="text-[9.5px] font-bold text-indigo-700 uppercase tracking-widest">Audit & Project Engagement Portfolio</span>
          <h1 className="text-2xl font-black text-black">{cv.fullName}</h1>
          <div className="text-xs text-slate-600 font-semibold">
            {[cv.ftsBatch, cv.crn, cv.targetRole || 'Audit & Advisory Senior'].filter(Boolean).join(' • ')}
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
          <section className="bg-indigo-50/40 p-3 rounded-xl border border-indigo-100">
            <h2 className="text-xs font-black uppercase text-indigo-950 mb-1">Practice Overview</h2>
            <p className="text-[10.5px] text-zinc-700 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {/* Structured Portfolio Case Engagements */}
        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-indigo-950 border-b-2 border-indigo-600 pb-0.5 mb-2">
              Featured Engagements & Deliverables
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              {cv.experience.map((e, idx) => (
                <div key={idx} className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                  <div className="font-bold text-indigo-950 text-[10.5px]">Engagement #{idx + 1}</div>
                  <p className="text-[10px] text-zinc-700 leading-snug">{e}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-indigo-950 border-b-2 border-indigo-600 pb-0.5 mb-1.5">
              Professional Credentials
            </h2>
            <div className="space-y-1.5">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="p-2 bg-zinc-50 rounded border-l-3 border-indigo-700 flex justify-between items-baseline text-[10.5px]">
                  <div>
                    <span className="font-bold text-zinc-950">{pq.title}</span>
                    <span className="text-zinc-600 ml-2">({pq.details})</span>
                  </div>
                  {pq.dateInfo && <span className="text-[10px] font-semibold text-indigo-800">{pq.dateInfo}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.academics && cv.academics.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-indigo-950 border-b-2 border-indigo-600 pb-0.5 mb-1.5">
              Academic Background
            </h2>
            <div className="space-y-1.5 text-[10.5px]">
              {cv.academics.map((acad, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-zinc-100 pb-1">
                  <div>
                    <strong>{acad.level}</strong> — <span className="text-zinc-700">{acad.discipline}</span> ({acad.institute})
                  </div>
                  <div className="text-right font-semibold text-indigo-800">{acad.year} | {acad.score}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-5">
          {cv.skills && cv.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-indigo-950 border-b-2 border-indigo-600 pb-0.5 mb-1">
                Technical Competencies
              </h2>
              <div className="flex flex-wrap gap-1">
                {cv.skills.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-indigo-50 text-indigo-950 font-medium text-[9px] rounded border border-indigo-200">{s}</span>
                ))}
              </div>
            </section>
          )}

          {cv.certifications && cv.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-indigo-950 border-b-2 border-indigo-600 pb-0.5 mb-1">
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
