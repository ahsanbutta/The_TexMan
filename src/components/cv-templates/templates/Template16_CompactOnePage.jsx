import { Phone, Mail, MapPin, Globe } from 'lucide-react';

/**
 * 16 — GRADUATE
 * Fresh Graduate focused layout: Education & Academic Honors appear FIRST before experience.
 */
export default function Template16_CompactOnePage({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[11px] leading-tight select-text min-h-[1050px] p-7 text-left">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-2xl mb-4 flex justify-between items-center">
        <div className="space-y-1">
          <span className="text-[9.5px] font-bold text-indigo-300 uppercase tracking-widest">Fresh Graduate & Trainee Applicant</span>
          <h1 className="text-2xl font-black text-white">{cv.fullName}</h1>
          <div className="text-xs text-indigo-200 font-semibold">
            {[cv.ftsBatch, cv.crn, cv.targetRole || 'Audit & Assurance Trainee'].filter(Boolean).join(' • ')}
          </div>
        </div>
        <div className="text-right text-[10px] text-indigo-200 space-y-0.5">
          {cv.phone && <div>📞 {cv.phone}</div>}
          {cv.email && <div>✉️ {cv.email}</div>}
          {cv.address && <div>📍 {cv.address}</div>}
        </div>
      </div>

      <div className="space-y-4">
        {cv.personalStatement && (
          <section className="bg-indigo-50/40 p-3 rounded-xl border border-indigo-100">
            <h2 className="text-xs font-black uppercase text-indigo-950 mb-1">Career Aspiration</h2>
            <p className="text-[10px] text-zinc-700 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {/* 1. Education FIRST */}
        {cv.academics && cv.academics.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-indigo-950 border-b-2 border-indigo-600 pb-0.5 mb-1.5">
              1. Education & Academic Background
            </h2>
            <div className="space-y-1.5">
              {cv.academics.map((acad, idx) => (
                <div key={idx} className="flex justify-between items-center text-[10px] border-b border-zinc-100 pb-1">
                  <div>
                    <strong>{acad.level}</strong> — <span className="text-zinc-700">{acad.discipline}</span> ({acad.institute})
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-indigo-900">{acad.year}</span> | <span className="font-semibold text-emerald-700">{acad.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2. Professional Qualifications */}
        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-indigo-950 border-b-2 border-indigo-600 pb-0.5 mb-1.5">
              2. Professional Qualifications (ICAP / ACCA)
            </h2>
            <div className="space-y-1.5">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="p-2 bg-indigo-50/60 rounded border-l-3 border-indigo-700 flex justify-between items-baseline text-[10.5px]">
                  <div>
                    <span className="font-bold text-zinc-950">{pq.title}</span>
                    <span className="text-zinc-600 ml-2">({pq.details})</span>
                  </div>
                  {pq.dateInfo && <span className="text-[10px] font-semibold text-indigo-800">{pq.dateInfo}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. Skills */}
        {cv.skills && cv.skills.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-indigo-950 border-b-2 border-indigo-600 pb-0.5 mb-1">
              3. Core Competencies & Tools
            </h2>
            <div className="flex flex-wrap gap-1">
              {cv.skills.map((s, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-indigo-50 text-indigo-900 font-semibold text-[9px] rounded border border-indigo-200">{s}</span>
              ))}
            </div>
          </section>
        )}

        {/* 4. Experience / Internships */}
        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-indigo-950 border-b-2 border-indigo-600 pb-0.5 mb-1">
              4. Internships & Academic Project Work
            </h2>
            <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-zinc-700">
              {cv.experience.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          </section>
        )}

        <div className="grid grid-cols-2 gap-4">
          {cv.certifications && cv.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-indigo-950 border-b-2 border-indigo-600 pb-0.5 mb-1">
                Certifications
              </h2>
              <ul className="list-disc pl-4 space-y-0.5 text-[9.5px] text-zinc-700">
                {cv.certifications.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </section>
          )}

          {cv.achievements && cv.achievements.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-indigo-950 border-b-2 border-indigo-600 pb-0.5 mb-1">
                Honors & Extra-curriculars
              </h2>
              <ul className="list-disc pl-4 space-y-0.5 text-[9.5px] text-zinc-700">
                {cv.achievements.map((a, idx) => (
                  <li key={idx}>{a}</li>
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
