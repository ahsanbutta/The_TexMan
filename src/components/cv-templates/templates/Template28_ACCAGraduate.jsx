import { Phone, Mail, MapPin, Globe } from 'lucide-react';

/**
 * 28 — TOP BAND
 * Large bold header band with integrated contact pill chips and photo badge, transitioning into a clean 2-column body.
 */
export default function Template28_ACCAGraduate({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[11px] leading-tight select-text min-h-[1050px] text-left">
      {/* Top Header Band */}
      <div className="bg-[#0f2a4a] text-white p-7 space-y-3">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-[9.5px] font-bold text-sky-400 uppercase tracking-widest">
              Audit & Professional Accounting
            </span>
            <h1 className="text-2xl font-black text-white">{cv.fullName}</h1>
            <div className="text-xs text-sky-200 font-semibold">
              {[cv.ftsBatch, cv.crn, cv.targetRole || 'Audit & Assurance Trainee'].filter(Boolean).join(' • ')}
            </div>
          </div>
          {cv.profileImage && (
            <div className="w-18 h-18 rounded-full overflow-hidden border-2 border-sky-400 flex-shrink-0 shadow">
              <img src={cv.profileImage} alt={cv.fullName} className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Integrated Contact Pills in Top Band */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-sky-900 text-[10px] text-sky-100">
          {cv.phone && <span className="px-2.5 py-1 bg-white/10 rounded-full">📞 {cv.phone}</span>}
          {cv.email && <span className="px-2.5 py-1 bg-white/10 rounded-full">✉️ {cv.email}</span>}
          {cv.address && <span className="px-2.5 py-1 bg-white/10 rounded-full">📍 {cv.address}</span>}
          {cv.linkedin && <span className="px-2.5 py-1 bg-white/10 rounded-full underline">🔗 {cv.linkedin}</span>}
        </div>
      </div>

      {/* Main Body */}
      <div className="p-7 space-y-4">
        {cv.personalStatement && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-[#0f2a4a] border-b border-zinc-200 pb-0.5 mb-1">
              Executive Profile
            </h2>
            <p className="text-[10.5px] text-zinc-700 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-[#0f2a4a] border-b border-zinc-200 pb-0.5 mb-1.5">
              Professional Qualifications & Accreditations
            </h2>
            <div className="space-y-1.5">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="p-2 bg-sky-50/50 rounded border-l-3 border-sky-600 flex justify-between items-baseline text-[10.5px]">
                  <div>
                    <span className="font-bold text-zinc-950">{pq.title}</span>
                    <span className="text-zinc-600 ml-2">({pq.details})</span>
                  </div>
                  {pq.dateInfo && <span className="text-[10px] font-semibold text-sky-800">{pq.dateInfo}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.experience && cv.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-[#0f2a4a] border-b border-zinc-200 pb-0.5 mb-1">
              Practical Experience
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
            <h2 className="text-xs font-black uppercase tracking-wider text-[#0f2a4a] border-b border-zinc-200 pb-0.5 mb-1.5">
              Academic Background
            </h2>
            <div className="space-y-1.5">
              {cv.academics.map((acad, idx) => (
                <div key={idx} className="flex justify-between items-center text-[10.5px] border-b border-zinc-100 pb-1">
                  <div>
                    <strong>{acad.level}</strong> — <span className="text-zinc-700">{acad.discipline}</span> ({acad.institute})
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#0f2a4a]">{acad.year}</span> | <span className="font-semibold">{acad.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-5">
          {cv.skills && cv.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#0f2a4a] border-b border-zinc-200 pb-0.5 mb-1">
                Core Competencies
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
              <h2 className="text-xs font-black uppercase tracking-wider text-[#0f2a4a] border-b border-zinc-200 pb-0.5 mb-1">
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
