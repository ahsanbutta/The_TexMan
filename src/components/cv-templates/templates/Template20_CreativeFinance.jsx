/**
 * 20 — ACADEMIC
 * Academic & Faculty Fellow CV format: Education near top, scholarly typography, research & credentials prioritized.
 * 100% ATS Friendly.
 */
export default function Template20_CreativeFinance({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-serif text-[11px] leading-relaxed select-text min-h-[1050px] p-8 sm:p-10 text-left">
      <div className="text-center pb-4 mb-4 border-b-2 border-stone-800">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-stone-950 font-serif">{cv.fullName}</h1>
        <div className="text-xs font-sans font-semibold text-stone-700 tracking-wider uppercase mt-1">
          {[cv.ftsBatch, cv.crn, cv.targetRole || 'Lecturer & Accounting Fellow'].filter(Boolean).join('  |  ')}
        </div>
        <div className="text-[10px] font-sans text-stone-600 flex justify-center flex-wrap gap-x-4 gap-y-0.5 pt-1">
          {cv.phone && <span>Phone: {cv.phone}</span>}
          {cv.email && <span>Email: {cv.email}</span>}
          {cv.address && <span>Location: {cv.address}</span>}
          {cv.linkedin && <span>LinkedIn: {cv.linkedin}</span>}
        </div>
      </div>

      <div className="space-y-4 font-sans">
        {cv.personalStatement && (
          <section>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-stone-950 border-b border-stone-300 pb-0.5 mb-1.5">
              Academic Profile & Research Interests
            </h2>
            <p className="text-[10.5px] text-zinc-800 leading-relaxed text-justify font-serif">{cv.personalStatement}</p>
          </section>
        )}

        {/* 1. Academic Degrees FIRST */}
        {cv.academics && cv.academics.length > 0 && (
          <section>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-stone-950 border-b border-stone-300 pb-0.5 mb-2">
              Academic Background & Degrees
            </h2>
            <div className="space-y-2 text-[10.5px]">
              {cv.academics.map((acad, idx) => (
                <div key={idx} className="flex justify-between items-baseline">
                  <div>
                    <strong className="text-stone-950">{acad.level}</strong>, {acad.discipline} — <span className="text-zinc-700">{acad.institute}</span>
                  </div>
                  <div className="text-stone-600 font-serif">{acad.year} ({acad.score})</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2. Professional Certifications */}
        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-stone-950 border-b border-stone-300 pb-0.5 mb-2">
              Professional Credentials & Accreditations
            </h2>
            <div className="space-y-1.5 text-[10.5px]">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="flex justify-between">
                  <span><strong className="text-stone-950">{pq.title}</strong> — {pq.details}</span>
                  {pq.dateInfo && <span className="text-stone-600 font-serif italic">{pq.dateInfo}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-stone-950 border-b border-stone-300 pb-0.5 mb-1.5">
              Teaching, Research & Practical Experience
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-[10.5px] text-zinc-800">
              {cv.experience.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          </section>
        )}

        <div className="grid grid-cols-2 gap-6 pt-1">
          {cv.skills && cv.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-stone-950 border-b border-stone-300 pb-0.5 mb-1.5">
                Scholarly Competencies
              </h2>
              <p className="text-[10px] text-zinc-800 leading-relaxed">{cv.skills.join('  •  ')}</p>
            </section>
          )}

          {cv.certifications && cv.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-stone-950 border-b border-stone-300 pb-0.5 mb-1.5">
                Certifications & Directives
              </h2>
              <ul className="list-disc pl-4 space-y-0.5 text-[9.5px] text-zinc-700">
                {cv.certifications.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="pt-3 border-t border-stone-300 flex justify-between text-[10px] text-stone-600 font-serif">
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
