import { Phone, Mail, MapPin, Globe } from 'lucide-react';

/**
 * 21 — TIMELINE
 * Experience and education are structured in a continuous vertical timeline with node connectors and milestone dots.
 */
export default function Template21_DeloitteStyleGreen({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[11px] leading-tight select-text min-h-[1050px] p-8 text-left">
      {/* Header */}
      <div className="border-b-2 border-emerald-500 pb-4 mb-5 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight">{cv.fullName}</h1>
          <div className="text-xs font-bold text-emerald-600 mt-0.5">
            {[cv.ftsBatch, cv.crn, cv.targetRole || 'Chartered Accountant Trainee'].filter(Boolean).join(' • ')}
          </div>
        </div>
        <div className="text-right text-[10px] text-zinc-600 space-y-0.5">
          {cv.phone && <div>📞 {cv.phone}</div>}
          {cv.email && <div>✉️ {cv.email}</div>}
          {cv.address && <div>📍 {cv.address}</div>}
        </div>
      </div>

      <div className="space-y-5">
        {cv.personalStatement && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-black mb-1">
              Professional Summary
            </h2>
            <p className="text-[10.5px] text-zinc-700 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {/* Vertical Timeline Experience */}
        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-black mb-3">
              Professional Timeline & Engagements
            </h2>
            <div className="relative pl-6 border-l-2 border-emerald-500 space-y-3.5">
              {cv.experience.map((e, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline Dot */}
                  <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs"></span>
                  <div className="text-[10.5px] text-zinc-800 leading-snug">{e}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Vertical Timeline Education & Qualifications */}
        {(cv.professionalQualifications || cv.academics) && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-black mb-3">
              Academic & Certification Milestones
            </h2>
            <div className="relative pl-6 border-l-2 border-emerald-500 space-y-3">
              {cv.professionalQualifications?.map((pq, idx) => (
                <div key={`pq-${idx}`} className="relative">
                  <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-black border-2 border-white shadow-xs"></span>
                  <div className="font-bold text-zinc-950 text-[10.5px]">{pq.title}</div>
                  <div className="text-emerald-700 text-[10px]">{pq.details} {pq.dateInfo && `(${pq.dateInfo})`}</div>
                </div>
              ))}

              {cv.academics?.map((acad, idx) => (
                <div key={`acad-${idx}`} className="relative">
                  <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-slate-400 border-2 border-white shadow-xs"></span>
                  <div className="font-bold text-zinc-950 text-[10.5px]">{acad.level} ({acad.discipline})</div>
                  <div className="text-zinc-600 text-[10px]">{acad.institute} — {acad.year} ({acad.score})</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-5 pt-2 border-t border-zinc-200">
          {cv.skills && cv.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-black mb-1">
                Core Competencies
              </h2>
              <div className="flex flex-wrap gap-1">
                {cv.skills.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-zinc-100 text-zinc-800 rounded font-medium text-[9px] border border-zinc-200">
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {cv.certifications && cv.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-black mb-1">
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
