import { Phone, Mail, MapPin, Globe } from 'lucide-react';

/**
 * 14 — FINANCIAL ANALYST
 * Analytical visual hierarchy with prominent quantitative modeling skills and financial data sections.
 */
export default function Template14_BankingCapital({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[11px] leading-tight select-text min-h-[1050px] p-7 text-left">
      <div className="border-b-2 border-emerald-700 pb-4 mb-4 flex justify-between items-center">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Financial Planning & Analysis (FP&A)</span>
          <h1 className="text-2xl font-black text-black">{cv.fullName}</h1>
          <div className="text-xs text-zinc-600 font-semibold">
            {[cv.ftsBatch, cv.crn, cv.targetRole || 'Financial Analyst & Modeler'].filter(Boolean).join(' • ')}
          </div>
        </div>
        <div className="text-right text-[10px] text-zinc-600 space-y-0.5">
          {cv.phone && <div>📞 {cv.phone}</div>}
          {cv.email && <div>✉️ {cv.email}</div>}
          {cv.address && <div>📍 {cv.address}</div>}
        </div>
      </div>

      {/* Prominent Analytical Skills Grid */}
      {cv.skills && cv.skills.length > 0 && (
        <section className="mb-4 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200">
          <h2 className="text-xs font-black uppercase tracking-wider text-emerald-900 mb-2">
            Quantitative & Analytical Competencies
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {cv.skills.map((s, idx) => (
              <span key={idx} className="px-2 py-1 bg-white text-emerald-950 font-bold text-[9.5px] rounded-lg border border-emerald-200 shadow-2xs">
                📊 {s}
              </span>
            ))}
          </div>
        </section>
      )}

      <div className="space-y-4">
        {cv.personalStatement && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-emerald-900 border-b border-zinc-200 pb-0.5 mb-1">
              Professional Profile
            </h2>
            <p className="text-[10.5px] text-zinc-700 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-emerald-900 border-b border-zinc-200 pb-0.5 mb-1">
              Financial Analysis & Forecasting Experience
            </h2>
            <ul className="list-disc pl-4 space-y-1 text-[10px] text-zinc-700">
              {cv.experience.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          </section>
        )}

        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-emerald-900 border-b border-zinc-200 pb-0.5 mb-1.5">
              Professional Qualifications (CFA / ICAP / ACCA)
            </h2>
            <div className="space-y-1.5">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="p-2 bg-zinc-50 rounded border-l-3 border-emerald-700 flex justify-between items-baseline text-[10.5px]">
                  <div>
                    <span className="font-bold text-zinc-950">{pq.title}</span>
                    <span className="text-zinc-600 ml-2">({pq.details})</span>
                  </div>
                  {pq.dateInfo && <span className="text-[10px] font-semibold text-emerald-800">{pq.dateInfo}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.academics && cv.academics.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-emerald-900 border-b border-zinc-200 pb-0.5 mb-1.5">
              Academic Background
            </h2>
            <div className="space-y-1.5">
              {cv.academics.map((acad, idx) => (
                <div key={idx} className="flex justify-between items-center text-[10.5px] border-b border-zinc-100 pb-1">
                  <div>
                    <strong>{acad.level}</strong> — <span className="text-zinc-700">{acad.discipline}</span> ({acad.institute})
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-900">{acad.year}</span> | <span className="font-semibold text-emerald-700">{acad.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-5">
          {cv.certifications && cv.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-emerald-900 border-b border-zinc-200 pb-0.5 mb-1">
                Certifications
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
              <h2 className="text-xs font-black uppercase tracking-wider text-emerald-900 border-b border-zinc-200 pb-0.5 mb-1">
                Honors & Distinctions
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
