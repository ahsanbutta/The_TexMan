import { Phone, Mail, MapPin, Globe } from 'lucide-react';

/**
 * 37 — MANAGEMENT TRAINEE
 * Designed for MT / Leadership programs: Academics, leadership roles, case competitions, and potential prioritized.
 */
export default function Template37_InvestmentBankingStyle({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[11px] leading-tight select-text min-h-[1050px] p-7 text-left">
      <div className="border-b-3 border-amber-600 pb-4 mb-4 flex justify-between items-center">
        <div>
          <span className="text-[9.5px] font-bold text-amber-700 uppercase tracking-widest">Management Trainee & Leadership Program</span>
          <h1 className="text-2xl font-black text-black">{cv.fullName}</h1>
          <div className="text-xs text-zinc-600 font-semibold">
            {[cv.ftsBatch, cv.crn, cv.targetRole || 'Management Trainee (MTO)'].filter(Boolean).join(' • ')}
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
          <section className="bg-amber-50/40 p-3 rounded-xl border border-amber-200">
            <h2 className="text-xs font-black uppercase text-amber-950 mb-1">Leadership Statement</h2>
            <p className="text-[10px] text-zinc-700 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {cv.academics && cv.academics.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-amber-900 border-b border-zinc-200 pb-0.5 mb-1.5">
              1. Academic Honors & Education
            </h2>
            <div className="space-y-1.5 text-[10.5px]">
              {cv.academics.map((acad, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-zinc-100 pb-1">
                  <div>
                    <strong>{acad.level}</strong> — <span className="text-zinc-700">{acad.discipline}</span> ({acad.institute})
                  </div>
                  <div className="text-right font-semibold text-amber-900">{acad.year} | {acad.score}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.achievements && cv.achievements.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-amber-900 border-b border-zinc-200 pb-0.5 mb-1.5">
              2. Leadership Honors & Competitions
            </h2>
            <ul className="list-disc pl-5 space-y-0.5 text-[10px] text-zinc-700">
              {cv.achievements.map((a, idx) => (
                <li key={idx}>{a}</li>
              ))}
            </ul>
          </section>
        )}

        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-amber-900 border-b border-zinc-200 pb-0.5 mb-1.5">
              3. Professional Qualifications
            </h2>
            <div className="space-y-1.5">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="p-2 bg-zinc-50 rounded border-l-3 border-amber-600 flex justify-between items-baseline text-[10.5px]">
                  <div>
                    <span className="font-bold text-zinc-950">{pq.title}</span>
                    <span className="text-zinc-600 ml-2">({pq.details})</span>
                  </div>
                  {pq.dateInfo && <span className="text-[10px] font-semibold text-amber-800">{pq.dateInfo}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-amber-900 border-b border-zinc-200 pb-0.5 mb-1">
              4. Leadership Roles & Internships
            </h2>
            <ul className="list-disc pl-5 space-y-0.5 text-[10px] text-zinc-700">
              {cv.experience.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          </section>
        )}

        <div className="grid grid-cols-2 gap-5">
          {cv.skills && cv.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-amber-900 border-b border-zinc-200 pb-0.5 mb-1">
                Core Competencies
              </h2>
              <div className="flex flex-wrap gap-1">
                {cv.skills.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-amber-50 text-amber-950 font-medium text-[9px] rounded border border-amber-200">{s}</span>
                ))}
              </div>
            </section>
          )}

          {cv.certifications && cv.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-amber-900 border-b border-zinc-200 pb-0.5 mb-1">
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
