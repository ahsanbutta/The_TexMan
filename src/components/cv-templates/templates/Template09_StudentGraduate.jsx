import { Phone, Mail, MapPin, Globe } from 'lucide-react';

/**
 * 09 — ACCOUNTING PROFESSIONAL
 * Certification-focused layout with ICAP/ACCA credentials prominently pinned at the top.
 */
export default function Template09_StudentGraduate({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[11px] leading-tight select-text min-h-[1050px] p-7 text-left">
      {/* Top Header */}
      <div className="border-b-3 border-[#047857] pb-4 mb-4 flex justify-between items-center">
        <div className="space-y-1">
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[9px] uppercase tracking-wider">
            Public Accounting & Statutory Reporting
          </span>
          <h1 className="text-2xl font-black text-zinc-950 tracking-tight">{cv.fullName}</h1>
          <div className="text-xs font-semibold text-emerald-700">
            {[cv.ftsBatch, cv.crn, cv.targetRole || 'Audit & Accounting Senior'].filter(Boolean).join(' • ')}
          </div>
        </div>
        <div className="text-right text-[10px] text-zinc-600 space-y-0.5">
          {cv.phone && <div>📞 {cv.phone}</div>}
          {cv.email && <div>✉️ {cv.email}</div>}
          {cv.address && <div>📍 {cv.address}</div>}
          {cv.linkedin && <div className="text-emerald-700 underline text-[9.5px]">🔗 {cv.linkedin}</div>}
        </div>
      </div>

      {/* Prominently Pinned Credentials Banner */}
      {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
        <section className="mb-4 bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200">
          <h2 className="text-xs font-black uppercase tracking-wider text-[#047857] mb-2">
            Primary Professional Credentials
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {cv.professionalQualifications.map((pq, idx) => (
              <div key={idx} className="bg-white p-2 rounded-lg border border-emerald-100 shadow-xs">
                <div className="font-bold text-zinc-950 text-[10.5px]">{pq.title}</div>
                <div className="text-emerald-800 text-[10px]">{pq.details} {pq.dateInfo && `(${pq.dateInfo})`}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="space-y-4">
        {cv.personalStatement && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-[#047857] border-b border-zinc-200 pb-0.5 mb-1">
              Professional Profile
            </h2>
            <p className="text-[10.5px] text-zinc-700 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-[#047857] border-b border-zinc-200 pb-0.5 mb-1">
              Accounting & Audit Practice Experience
            </h2>
            <ul className="list-disc pl-4 space-y-1 text-[10px] text-zinc-700">
              {cv.experience.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          </section>
        )}

        {cv.academics && cv.academics.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-[#047857] border-b border-zinc-200 pb-0.5 mb-1.5">
              Academic Background
            </h2>
            <div className="space-y-1.5">
              {cv.academics.map((acad, idx) => (
                <div key={idx} className="flex justify-between items-center text-[10.5px] border-b border-zinc-100 pb-1">
                  <div>
                    <strong>{acad.level}</strong> — <span className="text-zinc-700">{acad.discipline}</span> ({acad.institute})
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-800">{acad.year}</span> | <span className="font-semibold">{acad.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-5">
          {cv.skills && cv.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#047857] border-b border-zinc-200 pb-0.5 mb-1">
                Technical Skills & Tools
              </h2>
              <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-zinc-700">
                {cv.skills.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </section>
          )}

          {cv.certifications && cv.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#047857] border-b border-zinc-200 pb-0.5 mb-1">
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
