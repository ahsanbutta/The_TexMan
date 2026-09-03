import { Phone, Mail, MapPin, Globe } from 'lucide-react';

/**
 * 36 — DATA / ANALYTICS
 * Designed for finance/data/analytical candidates: Technical software competencies (Power BI, Python, SQL, Advanced Excel) highlighted.
 */
export default function Template36_ConsultingStyle({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[11px] leading-tight select-text min-h-[1050px] p-7 text-left">
      <div className="border-b-2 border-cyan-700 pb-4 mb-4 flex justify-between items-center">
        <div>
          <span className="text-[9.5px] font-bold text-cyan-700 uppercase tracking-widest">Financial Data & Business Intelligence</span>
          <h1 className="text-2xl font-black text-black">{cv.fullName}</h1>
          <div className="text-xs text-slate-600 font-semibold">
            {[cv.ftsBatch, cv.crn, cv.targetRole || 'Financial Data Analyst & Modeler'].filter(Boolean).join(' • ')}
          </div>
        </div>
        <div className="text-right text-[10px] text-zinc-600 space-y-0.5">
          {cv.phone && <div>📞 {cv.phone}</div>}
          {cv.email && <div>✉️ {cv.email}</div>}
          {cv.address && <div>📍 {cv.address}</div>}
        </div>
      </div>

      {/* Prominent Data Analytics Tool Stack */}
      {cv.skills && cv.skills.length > 0 && (
        <div className="bg-cyan-50/60 p-3.5 rounded-xl border border-cyan-200 mb-4">
          <h2 className="text-xs font-black uppercase text-cyan-950 mb-1.5">Data & Financial Modeling Competencies</h2>
          <div className="flex flex-wrap gap-1">
            {cv.skills.map((s, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-white text-cyan-950 font-bold text-[9.5px] rounded border border-cyan-200 shadow-2xs">
                ⚡ {s}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {cv.personalStatement && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-cyan-950 border-b border-zinc-200 pb-0.5 mb-1">
              Analytical Profile
            </h2>
            <p className="text-[10.5px] text-zinc-700 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-cyan-950 border-b border-zinc-200 pb-0.5 mb-1">
              Data & Financial Analysis Projects
            </h2>
            <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-zinc-700">
              {cv.experience.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          </section>
        )}

        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-cyan-950 border-b border-zinc-200 pb-0.5 mb-1.5">
              Professional Credentials
            </h2>
            <div className="space-y-1.5">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="p-2 bg-zinc-50 rounded border-l-3 border-cyan-700 flex justify-between items-baseline text-[10.5px]">
                  <div>
                    <span className="font-bold text-zinc-950">{pq.title}</span>
                    <span className="text-zinc-600 ml-2">({pq.details})</span>
                  </div>
                  {pq.dateInfo && <span className="text-[10px] font-semibold text-cyan-800">{pq.dateInfo}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.academics && cv.academics.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-cyan-950 border-b border-zinc-200 pb-0.5 mb-1.5">
              Academic Background
            </h2>
            <div className="space-y-1.5 text-[10.5px]">
              {cv.academics.map((acad, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-zinc-100 pb-1">
                  <div>
                    <strong>{acad.level}</strong> — <span className="text-zinc-700">{acad.discipline}</span> ({acad.institute})
                  </div>
                  <div className="text-right font-semibold text-cyan-800">{acad.year} | {acad.score}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-5">
          {cv.certifications && cv.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-cyan-950 border-b border-zinc-200 pb-0.5 mb-1">
                Data Certifications
              </h2>
              <ul className="list-disc pl-4 space-y-0.5 text-[9.5px] text-zinc-700">
                {cv.certifications.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </section>
          )}

          {cv.achievements && cv.achievements.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-cyan-950 border-b border-zinc-200 pb-0.5 mb-1">
                Honors & Competitions
              </h2>
              <ul className="list-disc pl-4 space-y-0.5 text-[9.5px] text-zinc-700">
                {cv.achievements.map((a, idx) => (
                  <li key={idx}>{a}</li>
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
