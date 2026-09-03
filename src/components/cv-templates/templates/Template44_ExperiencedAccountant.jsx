/**
 * 44 — ATS ADVANCED
 * Pure machine-parser compliant resume. Zero icons, zero sidebars, semantic hierarchy, standard margins.
 * 100% ATS Friendly.
 */
export default function Template44_ExperiencedAccountant({ cv }) {
  return (
    <div className="w-full bg-white text-black font-sans text-[11px] leading-normal select-text min-h-[1050px] p-8 sm:p-10 text-left">
      <div className="pb-3 border-b border-black mb-4">
        <h1 className="text-xl font-bold uppercase tracking-wide text-black">{cv.fullName}</h1>
        <div className="text-xs font-semibold text-gray-800 mt-0.5">
          {[cv.ftsBatch, cv.crn, cv.targetRole || 'Audit & Assurance Specialist'].filter(Boolean).join(' | ')}
        </div>
        <div className="text-[10px] text-gray-700 flex flex-wrap gap-x-4 gap-y-0.5 pt-1">
          {cv.phone && <span>Phone: {cv.phone}</span>}
          {cv.email && <span>Email: {cv.email}</span>}
          {cv.address && <span>Address: {cv.address}</span>}
          {cv.linkedin && <span>LinkedIn: {cv.linkedin}</span>}
        </div>
      </div>

      <div className="space-y-3.5">
        {cv.personalStatement && (
          <section>
            <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1">
              SUMMARY
            </h2>
            <p className="text-[10.5px] text-gray-900 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1">
              EXPERIENCE
            </h2>
            <ul className="list-disc pl-5 space-y-0.5 text-[10px] text-gray-900">
              {cv.experience.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          </section>
        )}

        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1.5">
              PROFESSIONAL QUALIFICATIONS
            </h2>
            <div className="space-y-1 text-[10.5px]">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="flex justify-between">
                  <span><strong>{pq.title}</strong> — {pq.details}</span>
                  {pq.dateInfo && <span>({pq.dateInfo})</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.academics && cv.academics.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1.5">
              EDUCATION
            </h2>
            <div className="space-y-1 text-[10.5px]">
              {cv.academics.map((acad, idx) => (
                <div key={idx} className="flex justify-between">
                  <div>
                    <strong>{acad.level}</strong>, {acad.discipline} — {acad.institute}
                  </div>
                  <div>{acad.year} ({acad.score})</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.skills && cv.skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1">
              SKILLS
            </h2>
            <p className="text-[10px] text-gray-900">{cv.skills.join(' • ')}</p>
          </section>
        )}

        <div className="grid grid-cols-2 gap-4">
          {cv.certifications && cv.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1">
                CERTIFICATIONS
              </h2>
              <ul className="list-disc pl-5 space-y-0.5 text-[9.5px] text-gray-900">
                {cv.certifications.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </section>
          )}

          {cv.achievements && cv.achievements.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1">
                HONORS
              </h2>
              <ul className="list-disc pl-5 space-y-0.5 text-[9.5px] text-gray-900">
                {cv.achievements.map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="pt-2 border-t border-black flex justify-between text-[9.5px] text-gray-700">
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
