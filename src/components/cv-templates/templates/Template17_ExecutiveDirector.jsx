import { User, Phone, Mail, MapPin, Globe } from 'lucide-react';

/**
 * 17 — CA STUDENT
 * Designed specifically for ICAP CA students: Highlights PRC/CAF stages passed, attempts, FTS/CRN, and articleship readiness.
 */
export default function Template17_ExecutiveDirector({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[11px] leading-tight select-text min-h-[1050px] p-7 text-left">
      {/* ICAP CA Badge Banner */}
      <div className="bg-[#022c22] text-white p-5 rounded-2xl mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {cv.profileImage && (
            <div className="w-18 h-18 rounded-full overflow-hidden border-2 border-emerald-400 bg-white/10 flex-shrink-0">
              <img src={cv.profileImage} alt={cv.fullName} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <div className="inline-block px-2 py-0.5 bg-emerald-400/20 text-emerald-300 font-bold text-[9px] rounded uppercase mb-0.5">
              ICAP / CA Articleship Candidate
            </div>
            <h1 className="text-2xl font-black text-white">{cv.fullName}</h1>
            <div className="text-xs text-emerald-200">
              {[cv.ftsBatch, cv.crn, cv.targetRole || 'Audit Trainee (Articleship)'].filter(Boolean).join(' • ')}
            </div>
          </div>
        </div>
        <div className="text-right text-[10px] text-emerald-100 space-y-0.5">
          {cv.phone && <div>📞 {cv.phone}</div>}
          {cv.email && <div>✉️ {cv.email}</div>}
          {cv.address && <div>📍 {cv.address}</div>}
        </div>
      </div>

      <div className="space-y-4">
        {cv.personalStatement && (
          <section className="bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
            <h2 className="text-xs font-black uppercase text-[#022c22] mb-1">Career Objective</h2>
            <p className="text-[10px] text-zinc-700 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {/* ICAP Paper Progress Breakdown */}
        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-[#022c22] border-b-2 border-emerald-600 pb-0.5 mb-1.5">
              ICAP Examination Record & Papers Passed
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-[10.5px]">
                  <div className="font-bold text-[#022c22]">{pq.title}</div>
                  <div className="text-emerald-800 font-medium">{pq.details} {pq.dateInfo && <span>({pq.dateInfo})</span>}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.academics && cv.academics.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-[#022c22] border-b-2 border-emerald-600 pb-0.5 mb-1.5">
              Academic Background
            </h2>
            <div className="space-y-1.5">
              {cv.academics.map((acad, idx) => (
                <div key={idx} className="flex justify-between items-center text-[10px] border-b border-zinc-100 pb-1">
                  <div>
                    <strong>{acad.level}</strong> — <span className="text-zinc-700">{acad.discipline}</span> ({acad.institute})
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#022c22]">{acad.year}</span> | <span className="font-semibold text-emerald-700">{acad.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-4">
          {cv.skills && cv.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#022c22] border-b-2 border-emerald-600 pb-0.5 mb-1">
                Technical Skills (IFRS / ISA / Excel)
              </h2>
              <div className="flex flex-wrap gap-1">
                {cv.skills.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-zinc-100 text-zinc-800 font-medium text-[9px] rounded border border-zinc-200">{s}</span>
                ))}
              </div>
            </section>
          )}

          {cv.certifications && cv.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#022c22] border-b-2 border-emerald-600 pb-0.5 mb-1">
                Certifications & Directives
              </h2>
              <ul className="list-disc pl-4 space-y-0.5 text-[9.5px] text-zinc-700">
                {cv.certifications.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-[#022c22] border-b-2 border-emerald-600 pb-0.5 mb-1">
              Articleship Experience & Projects
            </h2>
            <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-zinc-700">
              {cv.experience.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          </section>
        )}

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
