/**
 * 35 — MODERN MINIMAL
 * Ultra-clean typography, generous whitespace, understated elegance, zero clutter.
 * 100% ATS Friendly.
 */
export default function Template35_InternationalProfessional({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[11px] leading-relaxed select-text min-h-[1050px] p-9 sm:p-11 text-left">
      <div className="border-b border-zinc-200 pb-4 mb-5">
        <h1 className="text-2xl font-light tracking-wide text-zinc-950 uppercase">{cv.fullName}</h1>
        <div className="text-xs font-normal text-zinc-500 uppercase tracking-widest mt-1">
          {[cv.ftsBatch, cv.crn, cv.targetRole || 'Audit & Finance Professional'].filter(Boolean).join('   /   ')}
        </div>
        <div className="text-[10px] text-zinc-400 flex flex-wrap gap-x-5 gap-y-0.5 pt-2">
          {cv.phone && <span>{cv.phone}</span>}
          {cv.email && <span>{cv.email}</span>}
          {cv.address && <span>{cv.address}</span>}
          {cv.linkedin && <span className="text-zinc-600 underline">{cv.linkedin}</span>}
        </div>
      </div>

      <div className="space-y-4">
        {cv.personalStatement && (
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
              About
            </h2>
            <p className="text-[10.5px] text-zinc-700 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 border-b border-zinc-100 pb-0.5">
              Qualifications
            </h2>
            <div className="space-y-1 text-[10.5px]">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="flex justify-between">
                  <span><strong className="font-semibold text-zinc-900">{pq.title}</strong> — {pq.details}</span>
                  {pq.dateInfo && <span className="text-zinc-400 font-normal">{pq.dateInfo}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 border-b border-zinc-100 pb-0.5">
              Experience
            </h2>
            <ul className="list-disc pl-5 space-y-0.5 text-[10px] text-zinc-700">
              {cv.experience.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          </section>
        )}

        {cv.academics && cv.academics.length > 0 && (
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 border-b border-zinc-100 pb-0.5">
              Education
            </h2>
            <div className="space-y-1 text-[10.5px]">
              {cv.academics.map((acad, idx) => (
                <div key={idx} className="flex justify-between">
                  <div>
                    <strong className="font-semibold text-zinc-900">{acad.level}</strong>, {acad.discipline} — {acad.institute}
                  </div>
                  <div className="text-zinc-400">{acad.year} ({acad.score})</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-6 pt-1">
          {cv.skills && cv.skills.length > 0 && (
            <section>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1 border-b border-zinc-100 pb-0.5">
                Skills
              </h2>
              <p className="text-[10px] text-zinc-700 leading-relaxed">{cv.skills.join('  •  ')}</p>
            </section>
          )}

          {cv.certifications && cv.certifications.length > 0 && (
            <section>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1 border-b border-zinc-100 pb-0.5">
                Certifications
              </h2>
              <ul className="list-disc pl-4 space-y-0.5 text-[9.5px] text-zinc-600">
                {cv.certifications.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="pt-3 border-t border-zinc-200 flex justify-between text-[9.5px] text-zinc-400">
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
