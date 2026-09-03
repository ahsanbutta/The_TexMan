import { Phone, Mail, MapPin, Globe } from 'lucide-react';

/**
 * 27 — COLOR BLOCK
 * Uses an architectural structural color block spanning the left corner and header, altering page composition.
 */
export default function Template27_CAGraduate({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[11px] leading-tight select-text min-h-[1050px] text-left relative overflow-hidden">
      {/* Structural Color Block (Deep Indigo Block on Top Left) */}
      <div className="bg-[#1e1b4b] text-white p-7 pb-8 rounded-br-3xl shadow-md">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[9.5px] font-bold text-indigo-300 uppercase tracking-widest">
              Professional Curriculum Vitae
            </span>
            <h1 className="text-2xl font-black text-white">{cv.fullName}</h1>
            <div className="text-xs text-indigo-200 font-semibold">
              {[cv.ftsBatch, cv.crn, cv.targetRole || 'Audit & Financial Analyst'].filter(Boolean).join(' • ')}
            </div>
          </div>

          <div className="text-right text-[10px] text-indigo-200 space-y-0.5">
            {cv.phone && <div>📞 {cv.phone}</div>}
            {cv.email && <div>✉️ {cv.email}</div>}
            {cv.address && <div>📍 {cv.address}</div>}
            {cv.linkedin && <div className="text-indigo-300 underline text-[9.5px]">🔗 {cv.linkedin}</div>}
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-7 space-y-4">
        {cv.personalStatement && (
          <section className="bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100">
            <h2 className="text-xs font-black uppercase text-[#1e1b4b] mb-1">Career Profile</h2>
            <p className="text-[10px] text-zinc-700 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-[#1e1b4b] border-b-2 border-indigo-600 pb-0.5 mb-1.5">
              Professional Qualifications & Stages Passed
            </h2>
            <div className="space-y-1.5">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="p-2 bg-zinc-50 rounded border-l-3 border-[#1e1b4b] flex justify-between items-baseline text-[10.5px]">
                  <div>
                    <strong className="text-zinc-950">{pq.title}</strong>
                    <span className="text-zinc-600 ml-2">({pq.details})</span>
                  </div>
                  {pq.dateInfo && <span className="text-[10px] font-semibold text-indigo-900">{pq.dateInfo}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-[#1e1b4b] border-b-2 border-indigo-600 pb-0.5 mb-1">
              Professional Practice & Engagements
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
            <h2 className="text-xs font-black uppercase tracking-wider text-[#1e1b4b] border-b-2 border-indigo-600 pb-0.5 mb-1.5">
              Academic Background
            </h2>
            <div className="space-y-1.5">
              {cv.academics.map((acad, idx) => (
                <div key={idx} className="flex justify-between items-center text-[10.5px] border-b border-zinc-100 pb-1">
                  <div>
                    <strong>{acad.level}</strong> — <span className="text-zinc-700">{acad.discipline}</span> ({acad.institute})
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#1e1b4b]">{acad.year}</span> | <span className="font-semibold text-indigo-900">{acad.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-5">
          {cv.skills && cv.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#1e1b4b] border-b-2 border-indigo-600 pb-0.5 mb-1">
                Core Competencies
              </h2>
              <div className="flex flex-wrap gap-1">
                {cv.skills.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-indigo-50 text-indigo-950 font-semibold text-[9px] rounded border border-indigo-200">{s}</span>
                ))}
              </div>
            </section>
          )}

          {cv.certifications && cv.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#1e1b4b] border-b-2 border-indigo-600 pb-0.5 mb-1">
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
