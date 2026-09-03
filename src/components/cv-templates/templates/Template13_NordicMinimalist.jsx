/**
 * 13 — CONSULTING
 * Management consulting-style layout (McKinsey / BCG style).
 * Achievement & impact-oriented bullet points, structured problem-solving hierarchy.
 * 100% ATS Friendly.
 */
export default function Template13_NordicMinimalist({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[11px] leading-normal select-text min-h-[1050px] p-8 sm:p-9 text-left">
      <div className="border-b-2 border-zinc-900 pb-3 mb-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 uppercase">{cv.fullName}</h1>
          <div className="text-xs font-semibold text-zinc-700 tracking-wider uppercase mt-0.5">
            {[cv.ftsBatch, cv.crn, cv.targetRole || 'Strategy & Financial Consultant'].filter(Boolean).join('  |  ')}
          </div>
        </div>
        <div className="text-right text-[10px] text-zinc-600 space-y-0.5">
          {cv.phone && <div>{cv.phone}</div>}
          {cv.email && <div>{cv.email}</div>}
          {cv.address && <div>{cv.address}</div>}
          {cv.linkedin && <div className="text-zinc-900 underline">{cv.linkedin}</div>}
        </div>
      </div>

      <div className="space-y-3.5">
        {cv.personalStatement && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-0.5 mb-1 font-serif">
              Executive Profile
            </h2>
            <p className="text-[10.5px] text-zinc-800 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-0.5 mb-1 font-serif">
              Consulting & Professional Engagements
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-[10.5px] text-zinc-800">
              {cv.experience.map((e, idx) => (
                <li key={idx}>
                  <strong className="text-zinc-950">{e.split(':')[0] || 'Engagement'}:</strong>{' '}
                  {e.split(':')[1] || e}
                </li>
              ))}
            </ul>
          </section>
        )}

        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-0.5 mb-1.5 font-serif">
              Professional Qualifications & Accreditations
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

        {cv.academics && cv.academics.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-0.5 mb-1.5 font-serif">
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-0.5 mb-1 font-serif">
              Consulting & Technical Competencies
            </h2>
            <p className="text-[10.5px] text-zinc-800">{cv.skills.join('  •  ')}</p>
          </section>
        )}

        <div className="grid grid-cols-2 gap-4">
          {cv.certifications && cv.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-0.5 mb-1 font-serif">
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
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-0.5 mb-1 font-serif">
                Key Honors & Awards
              </h2>
              <ul className="list-disc pl-4 space-y-0.5 text-[9.5px] text-zinc-800">
                {cv.achievements.map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="pt-2 border-t border-zinc-300 flex justify-between text-[9.5px] text-zinc-600">
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
