/**
 * 31 — ASYMMETRIC
 * Modern asymmetric layout with 35% Left / 65% Right structural division and clean typography.
 * 100% ATS Friendly.
 */
export default function Template31_CorporateMinimal({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[11px] leading-tight select-text min-h-[1050px] p-7 text-left">
      <div className="grid grid-cols-12 gap-6 min-h-[950px]">
        {/* Left Column (4 Cols - 33%) */}
        <div className="col-span-4 space-y-4 border-r border-zinc-200 pr-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-black leading-tight">{cv.fullName}</h1>
            <div className="text-xs font-bold text-zinc-600">
              {[cv.ftsBatch, cv.crn, cv.targetRole || 'Audit Specialist'].filter(Boolean).join(' • ')}
            </div>
          </div>

          <div className="space-y-1 text-[10px] text-zinc-700 border-t border-zinc-200 pt-3">
            <h3 className="text-xs font-black uppercase text-black mb-1">Contact</h3>
            {cv.phone && <div>📞 {cv.phone}</div>}
            {cv.email && <div className="break-all">✉️ {cv.email}</div>}
            {cv.address && <div>📍 {cv.address}</div>}
            {cv.linkedin && <div className="text-blue-700 underline break-all text-[9.5px]">🔗 {cv.linkedin}</div>}
          </div>

          {cv.skills && cv.skills.length > 0 && (
            <div className="space-y-1 border-t border-zinc-200 pt-3">
              <h3 className="text-xs font-black uppercase text-black mb-1">Competencies</h3>
              <div className="flex flex-wrap gap-1">
                {cv.skills.map((s, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 bg-zinc-100 text-zinc-800 rounded text-[9px] font-medium border border-zinc-200">{s}</span>
                ))}
              </div>
            </div>
          )}

          {cv.certifications && cv.certifications.length > 0 && (
            <div className="space-y-1 border-t border-zinc-200 pt-3">
              <h3 className="text-xs font-black uppercase text-black mb-1">Certifications</h3>
              <ul className="list-disc pl-4 space-y-0.5 text-[9px] text-zinc-600">
                {cv.certifications.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t border-zinc-200 pt-3 text-[9px] text-zinc-600 space-y-0.5">
            <div><strong>Languages:</strong> {cv.languages?.join(', ')}</div>
            {cv.reference && cv.reference.name && (
              <div><strong>Ref:</strong> {cv.reference.name}</div>
            )}
          </div>
        </div>

        {/* Right Main Column (8 Cols - 67%) */}
        <div className="col-span-8 space-y-4">
          {cv.personalStatement && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-black border-b border-zinc-300 pb-0.5 mb-1">
                Executive Profile
              </h2>
              <p className="text-[10.5px] text-zinc-700 leading-relaxed text-justify">{cv.personalStatement}</p>
            </section>
          )}

          {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-black border-b border-zinc-300 pb-0.5 mb-1.5">
                Professional Qualifications
              </h2>
              <div className="space-y-1.5 text-[10.5px]">
                {cv.professionalQualifications.map((pq, idx) => (
                  <div key={idx} className="p-2 bg-zinc-50 rounded border-l-3 border-black flex justify-between items-baseline">
                    <div>
                      <strong className="text-zinc-950">{pq.title}</strong>
                      <span className="text-zinc-600 ml-2">({pq.details})</span>
                    </div>
                    {pq.dateInfo && <span className="text-[10px] font-semibold text-zinc-800">{pq.dateInfo}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {cv.experience && cv.experience.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-black border-b border-zinc-300 pb-0.5 mb-1">
                Practice Experience
              </h2>
              <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-zinc-700">
                {cv.experience.map((e, idx) => (
                  <li key={idx}>{e}</li>
                ))}
              </ul>
            </section>
          )}

          {cv.academics && cv.academics.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-black border-b border-zinc-300 pb-0.5 mb-1.5">
                Academic Background
              </h2>
              <div className="space-y-1.5 text-[10px]">
                {cv.academics.map((acad, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-zinc-100 pb-1">
                    <div>
                      <strong>{acad.level}</strong> — <span className="text-zinc-700">{acad.discipline}</span> ({acad.institute})
                    </div>
                    <div className="text-right font-semibold text-zinc-800">{acad.year} | {acad.score}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
