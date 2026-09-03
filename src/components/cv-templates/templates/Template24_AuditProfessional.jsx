import { Phone, Mail, MapPin, Globe } from 'lucide-react';

/**
 * 24 — EDITORIAL
 * Magazine/journal editorial typography: Prominent serif display headline, generous whitespace, stylized quotes.
 */
export default function Template24_AuditProfessional({ cv }) {
  return (
    <div className="w-full bg-[#fcfbf9] text-zinc-900 font-serif text-[11px] leading-relaxed select-text min-h-[1050px] p-9 sm:p-11 text-left">
      {/* Editorial Title */}
      <div className="border-b-2 border-stone-800 pb-5 mb-5 flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="max-w-xl">
          <div className="text-[10px] font-sans font-bold tracking-widest text-stone-500 uppercase">Curriculum Vitae</div>
          <h1 className="text-3xl font-normal tracking-tight text-stone-950 font-serif mt-1">{cv.fullName}</h1>
          <div className="text-xs font-sans font-semibold text-stone-700 tracking-wider uppercase mt-1">
            {[cv.ftsBatch, cv.crn, cv.targetRole || 'Audit & Assurance Professional'].filter(Boolean).join('  |  ')}
          </div>
        </div>

        <div className="text-right font-sans text-[10px] text-stone-600 space-y-0.5">
          {cv.phone && <div>{cv.phone}</div>}
          {cv.email && <div>{cv.email}</div>}
          {cv.address && <div>{cv.address}</div>}
          {cv.linkedin && <div className="text-stone-900 underline">{cv.linkedin}</div>}
        </div>
      </div>

      <div className="space-y-4 font-sans">
        {cv.personalStatement && (
          <section>
            <h2 className="text-xs font-serif italic text-stone-600 uppercase tracking-widest mb-1">
              — Executive Summary
            </h2>
            <p className="text-[11px] font-serif text-stone-800 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-xs font-serif italic text-stone-600 uppercase tracking-widest mb-1.5 border-b border-stone-300 pb-0.5">
              — Professional Qualifications
            </h2>
            <div className="space-y-1.5 text-[10.5px]">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="flex justify-between items-baseline">
                  <div>
                    <strong className="text-stone-950 font-serif">{pq.title}</strong>
                    <span className="text-stone-600 ml-2 font-sans">({pq.details})</span>
                  </div>
                  {pq.dateInfo && <span className="text-[10px] italic font-serif text-stone-500">{pq.dateInfo}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-serif italic text-stone-600 uppercase tracking-widest mb-1.5 border-b border-stone-300 pb-0.5">
              — Practice & Client Engagements
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-[10.5px] text-stone-800">
              {cv.experience.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          </section>
        )}

        {cv.academics && cv.academics.length > 0 && (
          <section>
            <h2 className="text-xs font-serif italic text-stone-600 uppercase tracking-widest mb-1.5 border-b border-stone-300 pb-0.5">
              — Academic Background
            </h2>
            <div className="space-y-1 text-[10.5px]">
              {cv.academics.map((acad, idx) => (
                <div key={idx} className="flex justify-between">
                  <div>
                    <strong className="text-stone-950 font-serif">{acad.level}</strong>, {acad.discipline} — {acad.institute}
                  </div>
                  <div className="text-stone-600 font-serif">{acad.year} ({acad.score})</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-6 pt-1">
          {cv.skills && cv.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-serif italic text-stone-600 uppercase tracking-widest mb-1 border-b border-stone-300 pb-0.5">
                — Key Competencies
              </h2>
              <p className="text-[10px] text-stone-800 leading-relaxed font-sans">{cv.skills.join('  •  ')}</p>
            </section>
          )}

          {cv.certifications && cv.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-serif italic text-stone-600 uppercase tracking-widest mb-1 border-b border-stone-300 pb-0.5">
                — Certifications
              </h2>
              <ul className="list-disc pl-4 space-y-0.5 text-[9.5px] text-stone-700">
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
