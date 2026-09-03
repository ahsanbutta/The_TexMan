/**
 * 15 — INVESTMENT BANKING
 * Dense Wall Street financial analyst format with tight margins, valuation & transaction emphasis.
 * 100% ATS Friendly.
 */
export default function Template15_CharteredLead({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-serif text-[10.5px] leading-tight select-text min-h-[1050px] p-7 sm:p-8 text-left">
      <div className="text-center border-b-2 border-black pb-2.5 mb-3">
        <h1 className="text-xl font-bold uppercase tracking-wider text-black">{cv.fullName}</h1>
        <div className="text-[10.5px] font-sans font-semibold text-zinc-700 mt-0.5">
          {[cv.ftsBatch, cv.crn, cv.targetRole || 'Investment Banking & M&A Analyst'].filter(Boolean).join('  |  ')}
        </div>
        <div className="text-[9.5px] font-sans text-zinc-600 flex justify-center gap-3 pt-1">
          {cv.phone && <span>Tel: {cv.phone}</span>}
          {cv.email && <span>Email: {cv.email}</span>}
          {cv.address && <span>Location: {cv.address}</span>}
          {cv.linkedin && <span>LinkedIn: {cv.linkedin}</span>}
        </div>
      </div>

      <div className="space-y-3 font-sans">
        {cv.personalStatement && (
          <section>
            <h2 className="text-[11px] font-serif font-bold uppercase tracking-wider text-black border-b border-zinc-400 pb-0.5 mb-1">
              Executive Profile
            </h2>
            <p className="text-[10px] text-zinc-800 leading-snug text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-[11px] font-serif font-bold uppercase tracking-wider text-black border-b border-zinc-400 pb-0.5 mb-1">
              Investment Banking & Financial Modeling Experience
            </h2>
            <ul className="list-disc pl-5 space-y-0.5 text-[9.5px] text-zinc-800">
              {cv.experience.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          </section>
        )}

        {cv.academics && cv.academics.length > 0 && (
          <section>
            <h2 className="text-[11px] font-serif font-bold uppercase tracking-wider text-black border-b border-zinc-400 pb-0.5 mb-1">
              Education & Academic Honors
            </h2>
            <div className="space-y-1 text-[10px]">
              {cv.academics.map((acad, idx) => (
                <div key={idx} className="flex justify-between">
                  <div>
                    <strong>{acad.institute}</strong> — {acad.level}, {acad.discipline}
                  </div>
                  <div>{acad.year} | Grade: {acad.score}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-[11px] font-serif font-bold uppercase tracking-wider text-black border-b border-zinc-400 pb-0.5 mb-1">
              Professional Certifications (CFA / ICAP / ACCA)
            </h2>
            <div className="space-y-0.5 text-[10px]">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="flex justify-between">
                  <span><strong>{pq.title}</strong> — {pq.details}</span>
                  {pq.dateInfo && <span className="text-zinc-600 font-serif italic">{pq.dateInfo}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.skills && cv.skills.length > 0 && (
          <section>
            <h2 className="text-[11px] font-serif font-bold uppercase tracking-wider text-black border-b border-zinc-400 pb-0.5 mb-1">
              Financial Modeling & Quantitative Skills
            </h2>
            <p className="text-[10px] text-zinc-800">{cv.skills.join(' • ')}</p>
          </section>
        )}

        <div className="grid grid-cols-2 gap-4">
          {cv.certifications && cv.certifications.length > 0 && (
            <section>
              <h2 className="text-[11px] font-serif font-bold uppercase tracking-wider text-black border-b border-zinc-400 pb-0.5 mb-1">
                Certifications
              </h2>
              <ul className="list-disc pl-5 space-y-0.5 text-[9px] text-zinc-800">
                {cv.certifications.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </section>
          )}

          {cv.achievements && cv.achievements.length > 0 && (
            <section>
              <h2 className="text-[11px] font-serif font-bold uppercase tracking-wider text-black border-b border-zinc-400 pb-0.5 mb-1">
                Honors & Distinctions
              </h2>
              <ul className="list-disc pl-5 space-y-0.5 text-[9px] text-zinc-800">
                {cv.achievements.map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="pt-2 border-t border-zinc-400 flex justify-between text-[9px] text-zinc-600">
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
