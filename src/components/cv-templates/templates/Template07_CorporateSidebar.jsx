import { Phone, Mail, MapPin, Globe } from 'lucide-react';

/**
 * 07 — EXECUTIVE
 * Executive-level CV: large bold serif typography, generous margins, editorial quote box, partner/director feel.
 */
export default function Template07_CorporateSidebar({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-serif text-[11px] leading-relaxed select-text min-h-[1050px] p-9 sm:p-11 text-left">
      {/* Executive Header */}
      <div className="border-b-4 border-zinc-950 pb-5 mb-5 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <span className="text-[10px] font-sans font-extrabold uppercase tracking-widest text-zinc-500">Executive Profile</span>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 font-serif mt-0.5">{cv.fullName}</h1>
          <div className="text-sm font-sans font-bold text-zinc-800 mt-1">
            {[cv.ftsBatch, cv.crn, cv.targetRole || 'Chief Financial Officer / Partner Track'].filter(Boolean).join('  •  ')}
          </div>
        </div>

        <div className="text-right font-sans text-[10px] text-zinc-600 space-y-0.5">
          {cv.phone && <div>Tel: {cv.phone}</div>}
          {cv.email && <div>Email: {cv.email}</div>}
          {cv.address && <div>Location: {cv.address}</div>}
          {cv.linkedin && <div className="text-zinc-950 underline">{cv.linkedin}</div>}
        </div>
      </div>

      {/* Executive Statement Quote Box */}
      {cv.personalStatement && (
        <div className="bg-stone-50 border-l-4 border-zinc-950 p-4 rounded-r-xl mb-5">
          <h2 className="text-[10px] font-sans font-bold uppercase tracking-widest text-zinc-500 mb-1">
            Executive Summary & Board Leadership
          </h2>
          <p className="text-[11px] font-serif text-zinc-800 leading-relaxed text-justify italic">
            "{cv.personalStatement}"
          </p>
        </div>
      )}

      {/* Main Sections */}
      <div className="space-y-4 font-sans">
        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-1 mb-2">
              Professional Qualifications & Accreditations
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="p-2.5 rounded bg-zinc-50 border border-zinc-200">
                  <div className="font-bold text-zinc-950 text-[10.5px]">{pq.title}</div>
                  <div className="text-zinc-600 text-[10px]">{pq.details} {pq.dateInfo && `(${pq.dateInfo})`}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-1 mb-2">
              Executive Leadership & Strategic Experience
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-[10.5px] text-zinc-800">
              {cv.experience.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          </section>
        )}

        {cv.academics && cv.academics.length > 0 && (
          <section>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-1 mb-2">
              Academic Background
            </h2>
            <div className="space-y-1.5 text-[10.5px]">
              {cv.academics.map((acad, idx) => (
                <div key={idx} className="flex justify-between">
                  <div>
                    <strong className="text-zinc-950">{acad.level}</strong>, {acad.discipline} — {acad.institute}
                  </div>
                  <div className="text-zinc-600 font-semibold">{acad.year} ({acad.score})</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-6 pt-1">
          {cv.skills && cv.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-1 mb-1.5">
                Executive Competencies
              </h2>
              <p className="text-[10px] text-zinc-800 leading-relaxed">{cv.skills.join('  •  ')}</p>
            </section>
          )}

          {cv.certifications && cv.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-300 pb-1 mb-1.5">
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

        <div className="pt-3 border-t border-zinc-300 flex justify-between text-[10px] text-zinc-600 font-serif">
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
