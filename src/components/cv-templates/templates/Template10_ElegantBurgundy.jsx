import { Phone, Mail, MapPin, Globe } from 'lucide-react';

/**
 * 10 — AUDIT PROFESSIONAL
 * Audit & assurance-oriented design with structured ISA testing assertions and practical audit timeline.
 */
export default function Template10_ElegantBurgundy({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[11px] leading-tight select-text min-h-[1050px] p-7 text-left">
      <div className="border-b-2 border-[#1e3a5f] pb-4 mb-4 flex justify-between items-center">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#1e3a5f] uppercase tracking-widest">Statutory Audit & Assurance Practice</span>
          <h1 className="text-2xl font-black text-black">{cv.fullName}</h1>
          <div className="text-xs text-[#1e3a5f] font-semibold">
            {[cv.ftsBatch, cv.crn, cv.targetRole || 'Statutory Audit Senior'].filter(Boolean).join(' • ')}
          </div>
        </div>
        <div className="text-right text-[10px] text-zinc-600 space-y-0.5">
          {cv.phone && <div>📞 {cv.phone}</div>}
          {cv.email && <div>✉️ {cv.email}</div>}
          {cv.address && <div>📍 {cv.address}</div>}
        </div>
      </div>

      <div className="space-y-4">
        {cv.personalStatement && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-[#1e3a5f] border-b border-zinc-200 pb-0.5 mb-1">
              Audit & Assurance Profile
            </h2>
            <p className="text-[10.5px] text-zinc-700 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-[#1e3a5f] border-b border-zinc-200 pb-0.5 mb-1.5">
              Professional Qualifications (ICAP / ACCA)
            </h2>
            <div className="space-y-1.5">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="p-2 bg-sky-50/50 rounded border-l-3 border-[#1e3a5f] flex justify-between items-baseline text-[10.5px]">
                  <div>
                    <span className="font-bold text-zinc-950">{pq.title}</span>
                    <span className="text-zinc-600 ml-2">({pq.details})</span>
                  </div>
                  {pq.dateInfo && <span className="text-[10px] font-semibold text-[#1e3a5f]">{pq.dateInfo}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-[#1e3a5f] border-b border-zinc-200 pb-0.5 mb-1">
              Audit Engagements & Field Execution
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
            <h2 className="text-xs font-black uppercase tracking-wider text-[#1e3a5f] border-b border-zinc-200 pb-0.5 mb-1.5">
              Academic Background
            </h2>
            <div className="space-y-1.5">
              {cv.academics.map((acad, idx) => (
                <div key={idx} className="flex justify-between items-center text-[10.5px] border-b border-zinc-100 pb-1">
                  <div>
                    <strong>{acad.level}</strong> — <span className="text-zinc-700">{acad.discipline}</span> ({acad.institute})
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#1e3a5f]">{acad.year}</span> | <span className="font-semibold">{acad.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-5">
          {cv.skills && cv.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#1e3a5f] border-b border-zinc-200 pb-0.5 mb-1">
                Audit Methodologies & ISA
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
              <h2 className="text-xs font-black uppercase tracking-wider text-[#1e3a5f] border-b border-zinc-200 pb-0.5 mb-1">
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
