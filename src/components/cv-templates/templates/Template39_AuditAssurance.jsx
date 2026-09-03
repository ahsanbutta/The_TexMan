import { Phone, Mail, MapPin, Globe } from 'lucide-react';

/**
 * 39 — SENIOR FINANCE
 * CFO / Head of Finance format: Corporate governance, capital structure, and multi-entity consolidation prioritized.
 */
export default function Template39_AuditAssurance({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-serif text-[11px] leading-tight select-text min-h-[1050px] p-8 text-left">
      <div className="border-b-4 border-slate-900 pb-4 mb-4 flex justify-between items-end">
        <div>
          <span className="text-[10px] font-sans font-bold text-slate-600 uppercase tracking-widest">Head of Finance & Corporate Strategy</span>
          <h1 className="text-2xl font-bold text-black uppercase tracking-tight font-serif mt-0.5">{cv.fullName}</h1>
          <div className="text-xs font-sans text-slate-800 font-semibold">
            {[cv.ftsBatch, cv.crn, cv.targetRole || 'Chief Financial Officer / Director'].filter(Boolean).join('  |  ')}
          </div>
        </div>
        <div className="text-right text-[10px] font-sans text-zinc-600 space-y-0.5">
          {cv.phone && <div>Tel: {cv.phone}</div>}
          {cv.email && <div>Email: {cv.email}</div>}
          {cv.address && <div>Location: {cv.address}</div>}
        </div>
      </div>

      <div className="space-y-4 font-sans">
        {cv.personalStatement && (
          <section className="bg-slate-50 p-3.5 rounded-lg border-l-4 border-slate-900">
            <h2 className="text-xs font-bold uppercase text-slate-900 mb-1 font-serif">Executive Leadership</h2>
            <p className="text-[10.5px] text-zinc-800 leading-relaxed text-justify font-serif italic">{cv.personalStatement}</p>
          </section>
        )}

        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-900 border-b border-zinc-300 pb-0.5 mb-1.5">
              Financial Strategy & Leadership Experience
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-[10.5px] text-zinc-800">
              {cv.experience.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          </section>
        )}

        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-900 border-b border-zinc-300 pb-0.5 mb-1.5">
              Chartered & Board Accreditations
            </h2>
            <div className="space-y-1 text-[10.5px]">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="flex justify-between">
                  <span><strong>{pq.title}</strong> — {pq.details}</span>
                  {pq.dateInfo && <span className="text-slate-600 italic font-serif">{pq.dateInfo}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-5">
          {cv.skills && cv.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-900 border-b border-zinc-300 pb-0.5 mb-1">
                Strategic Competencies
              </h2>
              <p className="text-[10px] text-zinc-800 leading-relaxed">{cv.skills.join('  •  ')}</p>
            </section>
          )}

          {cv.academics && cv.academics.length > 0 && (
            <section>
              <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-900 border-b border-zinc-300 pb-0.5 mb-1">
                Academic Background
              </h2>
              <div className="space-y-1 text-[10px]">
                {cv.academics.map((acad, idx) => (
                  <div key={idx}>
                    <strong>{acad.level}</strong> — {acad.institute} ({acad.year})
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="pt-2 border-t border-zinc-300 flex justify-between text-[9.5px] text-zinc-600 font-serif">
          <div><strong>Languages:</strong> {cv.languages?.join(', ')}</div>
          <div><strong>Certifications:</strong> {cv.certifications?.slice(0, 2).join(' • ')}</div>
          {cv.reference && cv.reference.name && (
            <div><strong>Reference:</strong> {cv.reference.name}</div>
          )}
        </div>
      </div>
    </div>
  );
}
