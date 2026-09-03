/**
 * 26 — PREMIUM MONOCHROME
 * High-contrast Swiss Black & White typography masterpiece. Zero color, pure typographic elegance.
 * 100% ATS Friendly.
 */
export default function Template26_BigFourProfessional({ cv }) {
  return (
    <div className="w-full bg-white text-black font-sans text-[11px] leading-tight select-text min-h-[1050px] p-8 sm:p-10 text-left">
      {/* Swiss Black Header */}
      <div className="bg-black text-white p-7 mb-5">
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">{cv.fullName}</h1>
        <div className="text-xs font-semibold text-zinc-300 uppercase tracking-widest mt-1">
          {[cv.ftsBatch, cv.crn, cv.targetRole || 'Audit & Corporate Advisory Senior'].filter(Boolean).join('  |  ')}
        </div>
        <div className="text-[10px] text-zinc-400 flex flex-wrap gap-x-4 gap-y-0.5 pt-2 border-t border-zinc-800 mt-2">
          {cv.phone && <span>Tel: {cv.phone}</span>}
          {cv.email && <span>Email: {cv.email}</span>}
          {cv.address && <span>Address: {cv.address}</span>}
          {cv.linkedin && <span>LinkedIn: {cv.linkedin}</span>}
        </div>
      </div>

      <div className="space-y-4">
        {cv.personalStatement && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-0.5 mb-1">
              Executive Profile
            </h2>
            <p className="text-[10.5px] text-zinc-800 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-0.5 mb-1.5">
              Professional Credentials
            </h2>
            <div className="space-y-1 text-[10.5px]">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="flex justify-between border-b border-zinc-100 pb-1">
                  <span><strong>{pq.title}</strong> — {pq.details}</span>
                  {pq.dateInfo && <span className="text-zinc-600 font-semibold">{pq.dateInfo}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-0.5 mb-1">
              Practice Experience
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
            <h2 className="text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-0.5 mb-1.5">
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

        <div className="grid grid-cols-2 gap-5">
          {cv.skills && cv.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-0.5 mb-1">
                Competencies
              </h2>
              <p className="text-[10px] text-zinc-800 leading-relaxed">{cv.skills.join('  •  ')}</p>
            </section>
          )}

          {cv.certifications && cv.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-widest text-black border-b-2 border-black pb-0.5 mb-1">
                Certifications
              </h2>
              <ul className="list-disc pl-4 space-y-0.5 text-[9.5px] text-zinc-800">
                {cv.certifications.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="pt-2 border-t border-black flex justify-between text-[9.5px] text-zinc-700">
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
