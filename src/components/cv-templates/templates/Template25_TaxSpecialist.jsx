import { Phone, Mail, MapPin, Globe } from 'lucide-react';

/**
 * 25 — COMPACT PROFESSIONAL
 * Highly compact, space-efficient 2-column layout designed for experienced candidates with multiple credentials.
 */
export default function Template25_TaxSpecialist({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[10px] leading-tight select-text min-h-[1050px] p-6 text-left">
      <div className="border-b-2 border-zinc-900 pb-2 mb-3 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-black text-black uppercase tracking-tight">{cv.fullName}</h1>
          <div className="text-[10.5px] font-bold text-zinc-700">
            {[cv.ftsBatch, cv.crn, cv.targetRole || 'Senior Accounting & Tax Specialist'].filter(Boolean).join(' • ')}
          </div>
        </div>
        <div className="text-right text-[9px] text-zinc-600 space-y-0.5">
          {cv.phone && <span>Tel: {cv.phone} | </span>}
          {cv.email && <span>Email: {cv.email} | </span>}
          {cv.address && <span>{cv.address}</span>}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Left Column (7 Cols) */}
        <div className="col-span-7 space-y-3">
          {cv.personalStatement && (
            <section>
              <h2 className="text-[10.5px] font-black uppercase tracking-wider text-black border-b border-zinc-300 pb-0.5 mb-1">
                Executive Profile
              </h2>
              <p className="text-[9.5px] text-zinc-700 leading-snug text-justify">{cv.personalStatement}</p>
            </section>
          )}

          {cv.experience && cv.experience.length > 0 && (
            <section>
              <h2 className="text-[10.5px] font-black uppercase tracking-wider text-black border-b border-zinc-300 pb-0.5 mb-1">
                Professional Experience
              </h2>
              <ul className="list-disc pl-4 space-y-0.5 text-[9.5px] text-zinc-700">
                {cv.experience.map((e, idx) => (
                  <li key={idx}>{e}</li>
                ))}
              </ul>
            </section>
          )}

          {cv.academics && cv.academics.length > 0 && (
            <section>
              <h2 className="text-[10.5px] font-black uppercase tracking-wider text-black border-b border-zinc-300 pb-0.5 mb-1">
                Education
              </h2>
              <div className="space-y-1">
                {cv.academics.map((acad, idx) => (
                  <div key={idx} className="flex justify-between text-[9.5px]">
                    <div><strong>{acad.level}</strong> — {acad.institute}</div>
                    <span>{acad.year} ({acad.score})</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column (5 Cols) */}
        <div className="col-span-5 space-y-3 bg-zinc-50 p-3 rounded-lg border border-zinc-200">
          {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
            <section>
              <h2 className="text-[10.5px] font-black uppercase tracking-wider text-black border-b border-zinc-300 pb-0.5 mb-1">
                Qualifications
              </h2>
              <div className="space-y-1 text-[9.5px]">
                {cv.professionalQualifications.map((pq, idx) => (
                  <div key={idx} className="p-1.5 bg-white rounded border border-zinc-200">
                    <div className="font-bold text-black">{pq.title}</div>
                    <div className="text-zinc-600 text-[9px]">{pq.details} {pq.dateInfo && `(${pq.dateInfo})`}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {cv.skills && cv.skills.length > 0 && (
            <section>
              <h2 className="text-[10.5px] font-black uppercase tracking-wider text-black border-b border-zinc-300 pb-0.5 mb-1">
                Core Competencies
              </h2>
              <div className="flex flex-wrap gap-1">
                {cv.skills.map((s, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 bg-white text-zinc-900 rounded text-[8.5px] border border-zinc-300">
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {cv.certifications && cv.certifications.length > 0 && (
            <section>
              <h2 className="text-[10.5px] font-black uppercase tracking-wider text-black border-b border-zinc-300 pb-0.5 mb-1">
                Certifications
              </h2>
              <ul className="list-disc pl-3 text-[9px] text-zinc-700 space-y-0.5">
                {cv.certifications.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </section>
          )}

          <div className="border-t border-zinc-200 pt-2 text-[8.5px] text-zinc-600 space-y-0.5">
            <div><strong>Languages:</strong> {cv.languages?.join(', ')}</div>
            {cv.reference && cv.reference.name && (
              <div><strong>Ref:</strong> {cv.reference.name}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
