/**
 * 12 — BIG FOUR STYLE
 * Clean corporate consulting-inspired design with high information density and crisp rule dividers.
 * 100% ATS Friendly.
 */
export default function Template12_ATSFriendlyCorporate({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-serif text-[11px] leading-snug select-text min-h-[1050px] p-8 sm:p-9 text-left">
      <div className="border-b border-zinc-900 pb-3 mb-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 uppercase">{cv.fullName}</h1>
          <div className="text-xs font-sans font-semibold text-zinc-700 tracking-wider uppercase mt-0.5">
            {[cv.ftsBatch, cv.crn, cv.targetRole || 'Audit & Advisory Associate'].filter(Boolean).join('  |  ')}
          </div>
        </div>
        <div className="text-right text-[10px] font-sans text-zinc-600 space-y-0.5">
          {cv.phone && <div>Tel: {cv.phone}</div>}
          {cv.email && <div>Email: {cv.email}</div>}
          {cv.address && <div>Location: {cv.address}</div>}
          {cv.linkedin && <div className="text-zinc-950 underline">{cv.linkedin}</div>}
        </div>
      </div>

      <div className="space-y-3.5 font-sans">
        {cv.personalStatement && (
          <section>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-0.5 mb-1">
              Professional Overview
            </h2>
            <p className="text-[10.5px] text-zinc-800 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-0.5 mb-1.5">
              Professional Accounting Qualifications
            </h2>
            <div className="space-y-1 text-[10.5px]">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="flex justify-between">
                  <span><strong>{pq.title}</strong> — {pq.details}</span>
                  {pq.dateInfo && <span className="text-zinc-600 italic font-serif">{pq.dateInfo}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-0.5 mb-1">
              Professional & Practical Experience
            </h2>
            <ul className="list-disc pl-5 space-y-0.5 text-[10px] text-zinc-800">
              {cv.experience.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          </section>
        )}

        {cv.academics && cv.academics.length > 0 && (
          <section>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-0.5 mb-1.5">
              Academic Background
            </h2>
            <div className="space-y-1 text-[10.5px]">
              {cv.academics.map((acad, idx) => (
                <div key={idx} className="flex justify-between">
                  <div>
                    <strong>{acad.level}</strong>, {acad.discipline} — {acad.institute}
                  </div>
                  <div className="text-zinc-700">{acad.year} | {acad.score}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.skills && cv.skills.length > 0 && (
          <section>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-0.5 mb-1">
              Core Competencies
            </h2>
            <p className="text-[10px] text-zinc-800">{cv.skills.join('  •  ')}</p>
          </section>
        )}

        <div className="grid grid-cols-2 gap-4">
          {cv.certifications && cv.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-0.5 mb-1">
                Certifications
              </h2>
              <ul className="list-disc pl-4 space-y-0.5 text-[9.5px] text-zinc-800">
                {cv.certifications.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </section>
          )}

          {cv.achievements && cv.achievements.length > 0 && (
            <section>
              <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-0.5 mb-1">
                Achievements & Honors
              </h2>
              <ul className="list-disc pl-4 space-y-0.5 text-[9.5px] text-zinc-800">
                {cv.achievements.map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="pt-2 border-t border-zinc-300 flex justify-between text-[9.5px] text-zinc-600 font-sans">
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
