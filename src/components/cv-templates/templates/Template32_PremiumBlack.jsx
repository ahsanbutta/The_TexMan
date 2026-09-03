import { Phone, Mail, MapPin, Globe } from 'lucide-react';

/**
 * 32 — CREATIVE PROFESSIONAL
 * Modern Fintech / Tech-Accounting format with rounded tag capsules, dark accents, and contemporary layout.
 */
export default function Template32_PremiumBlack({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[11px] leading-tight select-text min-h-[1050px] p-7 text-left">
      <div className="bg-[#111827] text-white p-6 rounded-3xl mb-4 flex justify-between items-center shadow-md">
        <div className="space-y-1.5">
          <span className="px-2.5 py-0.5 bg-violet-500/20 text-violet-300 font-bold text-[9px] rounded-full uppercase border border-violet-500/30">
            Fintech & Modern Accounting
          </span>
          <h1 className="text-2xl font-black text-white">{cv.fullName}</h1>
          <div className="text-xs text-zinc-300 font-semibold">
            {[cv.ftsBatch, cv.crn, cv.targetRole || 'Audit & Financial Analyst'].filter(Boolean).join(' • ')}
          </div>
        </div>
        <div className="text-right text-[10px] text-zinc-300 space-y-0.5">
          {cv.phone && <div>📞 {cv.phone}</div>}
          {cv.email && <div>✉️ {cv.email}</div>}
          {cv.address && <div>📍 {cv.address}</div>}
        </div>
      </div>

      <div className="space-y-4">
        {cv.personalStatement && (
          <section className="bg-violet-50/40 p-3.5 rounded-2xl border border-violet-100">
            <h2 className="text-xs font-black uppercase text-[#111827] mb-1">Professional Profile</h2>
            <p className="text-[10px] text-zinc-700 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-[#111827] border-b-2 border-violet-500 pb-0.5 mb-1.5">
              Professional Qualifications & Accreditations
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-[10.5px]">
                  <div className="font-bold text-zinc-950">{pq.title}</div>
                  <div className="text-violet-900 text-[10px]">{pq.details} {pq.dateInfo && `(${pq.dateInfo})`}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-[#111827] border-b-2 border-violet-500 pb-0.5 mb-1">
              Work Experience & Projects
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
            <h2 className="text-xs font-black uppercase tracking-wider text-[#111827] border-b-2 border-violet-500 pb-0.5 mb-1.5">
              Academic Background
            </h2>
            <div className="space-y-1.5 text-[10px]">
              {cv.academics.map((acad, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-zinc-100 pb-1">
                  <div><strong>{acad.level}</strong> — {acad.discipline} ({acad.institute})</div>
                  <span className="font-semibold text-violet-900">{acad.year} | {acad.score}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-5">
          {cv.skills && cv.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#111827] border-b-2 border-violet-500 pb-0.5 mb-1">
                Competencies & Tech Stack
              </h2>
              <div className="flex flex-wrap gap-1">
                {cv.skills.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-zinc-100 text-zinc-800 rounded-full font-medium text-[9px] border border-zinc-200">{s}</span>
                ))}
              </div>
            </section>
          )}

          {cv.certifications && cv.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#111827] border-b-2 border-violet-500 pb-0.5 mb-1">
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

        <div className="pt-2 border-t border-zinc-200 flex justify-between text-[9.5px] text-zinc-600">
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
