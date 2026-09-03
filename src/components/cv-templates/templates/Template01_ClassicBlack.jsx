import { Phone, Mail, MapPin, Globe } from 'lucide-react';

/**
 * 01 — CLASSIC CORPORATE
 * Traditional single-column professional CV.
 * Name at top, clean horizontal separators, conservative typography, no heavy graphics.
 * 100% ATS Friendly.
 */
export default function Template01_ClassicBlack({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-serif text-[11px] leading-relaxed select-text min-h-[1050px] p-8 sm:p-10 text-left">
      {/* Top Header */}
      <div className="text-center pb-4 mb-4 border-b-2 border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 uppercase font-serif">{cv.fullName}</h1>
        <div className="text-xs font-sans font-semibold text-zinc-700 tracking-wider uppercase mt-1">
          {[cv.ftsBatch, cv.crn, cv.targetRole || 'Audit & Assurance Professional'].filter(Boolean).join('  |  ')}
        </div>
        <div className="text-[10px] font-sans text-zinc-600 flex justify-center flex-wrap gap-x-4 gap-y-1 mt-2">
          {cv.phone && <span>Tel: {cv.phone}</span>}
          {cv.email && <span>Email: {cv.email}</span>}
          {cv.address && <span>Address: {cv.address}</span>}
          {cv.linkedin && <span>LinkedIn: {cv.linkedin}</span>}
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4 font-sans">
        {cv.personalStatement && (
          <section>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-0.5 mb-1.5">
              Professional Summary
            </h2>
            <p className="text-[10.5px] text-zinc-800 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-0.5 mb-2">
              Professional Qualifications & Accreditations
            </h2>
            <div className="space-y-1.5">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="flex justify-between items-baseline text-[10.5px]">
                  <div>
                    <strong className="text-zinc-950">{pq.title}</strong>
                    <span className="text-zinc-700 ml-2">— {pq.details}</span>
                  </div>
                  {pq.dateInfo && <span className="text-[10px] italic text-zinc-600 font-serif">{pq.dateInfo}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.academics && cv.academics.length > 0 && (
          <section>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-0.5 mb-2">
              Academic Background
            </h2>
            <div className="space-y-1.5">
              {cv.academics.map((acad, idx) => (
                <div key={idx} className="flex justify-between items-center text-[10.5px]">
                  <div>
                    <strong className="text-zinc-950">{acad.level}</strong>, {acad.discipline} — <span className="text-zinc-700">{acad.institute}</span>
                  </div>
                  <div className="text-[10px] text-zinc-700">
                    <span className="font-semibold">{acad.year}</span> | Score: {acad.score}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-0.5 mb-1.5">
              Work & Practical Experience
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-[10.5px] text-zinc-800">
              {cv.experience.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          </section>
        )}

        {cv.skills && cv.skills.length > 0 && (
          <section>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-0.5 mb-1">
              Core Competencies & Technical Skills
            </h2>
            <p className="text-[10.5px] text-zinc-800 leading-relaxed">{cv.skills.join('  •  ')}</p>
          </section>
        )}

        <div className="grid grid-cols-2 gap-6 pt-1">
          {cv.certifications && cv.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-0.5 mb-1.5">
                Certifications
              </h2>
              <ul className="list-disc pl-5 space-y-0.5 text-[10px] text-zinc-700">
                {cv.certifications.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </section>
          )}

          {cv.achievements && cv.achievements.length > 0 && (
            <section>
              <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-0.5 mb-1.5">
                Honors & Achievements
              </h2>
              <ul className="list-disc pl-5 space-y-0.5 text-[10px] text-zinc-700">
                {cv.achievements.map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="pt-3 border-t border-zinc-300 flex justify-between text-[10px] text-zinc-600">
          <div><strong>Languages:</strong> {cv.languages?.join(', ')}</div>
          <div><strong>Activities:</strong> {cv.extraCurricular?.slice(0, 2).join(' • ')}</div>
          {cv.reference && cv.reference.name && (
            <div><strong>Reference:</strong> {cv.reference.name} ({cv.reference.email})</div>
          )}
        </div>
      </div>
    </div>
  );
}
