import { Phone, Mail, MapPin, Globe } from 'lucide-react';

/**
 * 22 — SPLIT HEADER
 * Header divided into two distinct visual areas: Left side has Name & Subtitle on charcoal block, Right side has Contact Matrix.
 */
export default function Template22_GoldPrestige({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[11px] leading-tight select-text min-h-[1050px] p-7 text-left">
      {/* Split Header (50% Charcoal Left / 50% Slate Right) */}
      <div className="grid grid-cols-12 rounded-2xl overflow-hidden mb-5 border border-zinc-300">
        {/* Left Half */}
        <div className="col-span-7 bg-[#1c1917] text-white p-5 flex flex-col justify-center">
          <span className="text-[9.5px] font-bold text-amber-400 uppercase tracking-widest">Chartered Accounting</span>
          <h1 className="text-2xl font-black tracking-tight text-white font-serif">{cv.fullName}</h1>
          <div className="text-xs text-stone-300 font-semibold mt-0.5">
            {[cv.ftsBatch, cv.crn, cv.targetRole || 'Audit & Financial Advisory'].filter(Boolean).join(' • ')}
          </div>
        </div>

        {/* Right Half */}
        <div className="col-span-5 bg-stone-100 p-5 flex flex-col justify-center text-[10px] text-zinc-700 space-y-1 border-l border-zinc-300">
          {cv.phone && <div>📞 {cv.phone}</div>}
          {cv.email && <div className="break-all">✉️ {cv.email}</div>}
          {cv.address && <div>📍 {cv.address}</div>}
          {cv.linkedin && <div className="text-amber-800 underline break-all">🔗 {cv.linkedin}</div>}
        </div>
      </div>

      <div className="space-y-4">
        {cv.personalStatement && (
          <section>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-[#1c1917] border-b border-amber-600 pb-0.5 mb-1">
              Executive Profile
            </h2>
            <p className="text-[10.5px] text-zinc-700 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-[#1c1917] border-b border-amber-600 pb-0.5 mb-1.5">
              Professional Qualifications & Accreditations
            </h2>
            <div className="space-y-1.5">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="p-2 rounded bg-stone-50 border-l-3 border-amber-600 flex justify-between items-baseline text-[10.5px]">
                  <div>
                    <strong className="text-zinc-950">{pq.title}</strong>
                    <span className="text-stone-600 ml-2">({pq.details})</span>
                  </div>
                  {pq.dateInfo && <span className="text-[10px] font-semibold text-amber-800">{pq.dateInfo}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-[#1c1917] border-b border-amber-600 pb-0.5 mb-1">
              Professional Experience
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
            <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-[#1c1917] border-b border-amber-600 pb-0.5 mb-1.5">
              Academic Background
            </h2>
            <div className="space-y-1.5">
              {cv.academics.map((acad, idx) => (
                <div key={idx} className="flex justify-between items-center text-[10.5px] border-b border-stone-100 pb-1">
                  <div>
                    <strong>{acad.level}</strong> — <span className="text-zinc-700">{acad.discipline}</span> ({acad.institute})
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-amber-900">{acad.year}</span> | <span className="font-semibold">{acad.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-5">
          {cv.skills && cv.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-[#1c1917] border-b border-amber-600 pb-0.5 mb-1">
                Competencies
              </h2>
              <div className="flex flex-wrap gap-1">
                {cv.skills.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-stone-100 text-stone-900 font-semibold text-[9.5px] rounded border border-stone-200">
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {cv.certifications && cv.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-[#1c1917] border-b border-amber-600 pb-0.5 mb-1">
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

        <div className="pt-2 border-t border-stone-200 flex justify-between text-[9.5px] text-stone-600 font-serif">
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
