import { Phone, Mail, MapPin, Globe } from 'lucide-react';

/**
 * 23 — CENTERED PROFILE
 * Centered profile header: Centered photo, large centered name/tagline, centered contact line, centered section titles.
 */
export default function Template23_FinanceExecutive({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[11px] leading-tight select-text min-h-[1050px] p-8 sm:p-10 text-center">
      {/* Centered Profile Header */}
      <div className="flex flex-col items-center border-b-2 border-zinc-900 pb-5 mb-5 space-y-2">
        {cv.profileImage && (
          <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-zinc-900 shadow-md">
            <img src={cv.profileImage} alt={cv.fullName} className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-2xl font-black uppercase tracking-tight text-zinc-950 font-serif">{cv.fullName}</h1>
        <div className="text-xs font-semibold text-zinc-700 tracking-wider uppercase">
          {[cv.ftsBatch, cv.crn, cv.targetRole || 'Audit & Finance Specialist'].filter(Boolean).join('  •  ')}
        </div>
        <div className="text-[10px] text-zinc-600 flex justify-center flex-wrap gap-x-4 gap-y-0.5 pt-1">
          {cv.phone && <span>📞 {cv.phone}</span>}
          {cv.email && <span>✉️ {cv.email}</span>}
          {cv.address && <span>📍 {cv.address}</span>}
          {cv.linkedin && <span className="underline">🔗 {cv.linkedin}</span>}
        </div>
      </div>

      <div className="space-y-4 text-left">
        {cv.personalStatement && (
          <section>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-zinc-950 text-center border-b border-zinc-300 pb-1 mb-1.5">
              Professional Summary
            </h2>
            <p className="text-[10.5px] text-zinc-700 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-zinc-950 text-center border-b border-zinc-300 pb-1 mb-2">
              Professional Qualifications & Accreditations
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="p-2 bg-zinc-50 rounded border border-zinc-200 text-center">
                  <strong className="text-zinc-950 block text-[10.5px]">{pq.title}</strong>
                  <span className="text-zinc-600 text-[10px]">{pq.details} {pq.dateInfo && `(${pq.dateInfo})`}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-zinc-950 text-center border-b border-zinc-300 pb-1 mb-2">
              Professional Experience
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-[10px] text-zinc-700">
              {cv.experience.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          </section>
        )}

        {cv.academics && cv.academics.length > 0 && (
          <section>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-zinc-950 text-center border-b border-zinc-300 pb-1 mb-2">
              Academic Background
            </h2>
            <div className="space-y-1.5 text-[10.5px]">
              {cv.academics.map((acad, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-zinc-100 pb-1">
                  <div>
                    <strong>{acad.level}</strong> — {acad.discipline} ({acad.institute})
                  </div>
                  <div className="font-semibold text-zinc-800">{acad.year} | {acad.score}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-5 pt-1">
          {cv.skills && cv.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-zinc-950 text-center border-b border-zinc-300 pb-1 mb-1.5">
                Core Competencies
              </h2>
              <p className="text-[10px] text-zinc-800 text-center leading-relaxed">{cv.skills.join('  •  ')}</p>
            </section>
          )}

          {cv.certifications && cv.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-zinc-950 text-center border-b border-zinc-300 pb-1 mb-1.5">
                Certifications
              </h2>
              <ul className="list-disc pl-4 space-y-0.5 text-[9.5px] text-zinc-700">
                {cv.certifications.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="pt-3 border-t border-zinc-300 flex justify-between text-[9.5px] text-zinc-600">
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
