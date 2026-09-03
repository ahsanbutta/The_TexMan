/**
 * 06 — MODERN ATS
 * Single-column ATS layout with large modern header, subtle section dividers, and compact spacing.
 * 100% ATS Friendly.
 */
export default function Template06_CleanSingleColumn({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[11px] leading-normal select-text min-h-[1050px] p-8 sm:p-9 text-left">
      <div className="border-b-2 border-zinc-900 pb-3 mb-4">
        <h1 className="text-2xl font-extrabold tracking-tight uppercase text-zinc-950">{cv.fullName}</h1>
        <div className="text-xs font-semibold text-zinc-700 mt-0.5">
          {[cv.ftsBatch, cv.crn, cv.targetRole || 'Audit & Corporate Advisory Trainee'].filter(Boolean).join('  |  ')}
        </div>
        <div className="text-[10px] text-zinc-600 flex flex-wrap gap-x-4 gap-y-0.5 pt-1.5">
          {cv.phone && <span>📞 {cv.phone}</span>}
          {cv.email && <span>✉️ {cv.email}</span>}
          {cv.address && <span>📍 {cv.address}</span>}
          {cv.linkedin && <span>🔗 {cv.linkedin}</span>}
        </div>
      </div>

      <div className="space-y-3.5">
        {cv.personalStatement && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-200 pb-0.5 mb-1">
              Professional Summary
            </h2>
            <p className="text-[10.5px] text-zinc-800 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-200 pb-0.5 mb-1.5">
              Professional Qualifications & Accreditations
            </h2>
            <div className="space-y-1 text-[10.5px]">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="flex justify-between">
                  <span><strong>{pq.title}</strong> — {pq.details}</span>
                  {pq.dateInfo && <span className="text-zinc-600 font-semibold">{pq.dateInfo}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.academics && cv.academics.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-200 pb-0.5 mb-1.5">
              Academic Background
            </h2>
            <div className="space-y-1 text-[10.5px]">
              {cv.academics.map((acad, idx) => (
                <div key={idx} className="flex justify-between">
                  <div>
                    <strong>{acad.level}</strong>, {acad.discipline} — {acad.institute}
                  </div>
                  <div className="font-semibold text-zinc-700">{acad.year} ({acad.score})</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-200 pb-0.5 mb-1">
              Professional Experience
            </h2>
            <ul className="list-disc pl-5 space-y-0.5 text-[10px] text-zinc-800">
              {cv.experience.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          </section>
        )}

        {cv.skills && cv.skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-200 pb-0.5 mb-1">
              Core Skills & Tools
            </h2>
            <p className="text-[10.5px] text-zinc-800">{cv.skills.join(' • ')}</p>
          </section>
        )}

        <div className="grid grid-cols-2 gap-4">
          {cv.certifications && cv.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-200 pb-0.5 mb-1">
                Certifications
              </h2>
              <ul className="list-disc pl-5 space-y-0.5 text-[9.5px] text-zinc-800">
                {cv.certifications.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </section>
          )}

          {cv.achievements && cv.achievements.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-200 pb-0.5 mb-1">
                Honors & Activities
              </h2>
              <ul className="list-disc pl-5 space-y-0.5 text-[9.5px] text-zinc-800">
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
