import { User, Phone, Mail, MapPin, Globe } from 'lucide-react';

/**
 * 03 — LEFT SIDEBAR
 * Strong dark left sidebar (30% width) with centered avatar, white main content body (70% width).
 */
export default function Template03_ATSMinimal({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[11px] leading-tight select-text min-h-[1050px] text-left">
      <div className="grid grid-cols-12 min-h-[1050px]">
        {/* Dark Left Sidebar (4 Cols) */}
        <div className="col-span-4 bg-[#1e293b] text-slate-100 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Top Photo in Sidebar */}
            <div className="flex justify-center pt-2">
              <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-emerald-400 bg-slate-700 flex items-center justify-center shadow-lg">
                {cv.profileImage ? (
                  <img src={cv.profileImage} alt={cv.fullName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-slate-400" />
                )}
              </div>
            </div>

            <div className="text-center space-y-0.5">
              <h1 className="text-base font-black text-white">{cv.fullName}</h1>
              <div className="text-xs font-semibold text-emerald-400">{cv.targetRole || 'Audit & Tax Specialist'}</div>
              <div className="text-[10px] text-slate-400">{[cv.ftsBatch, cv.crn].filter(Boolean).join(' • ')}</div>
            </div>

            {/* Contact Details in Sidebar */}
            <div className="space-y-1.5 text-[10px] text-slate-300 border-t border-slate-700 pt-3">
              <h3 className="text-[11px] font-black uppercase tracking-wider text-emerald-400 mb-1">Contact</h3>
              {cv.phone && <div>📞 {cv.phone}</div>}
              {cv.email && <div className="break-all">✉️ {cv.email}</div>}
              {cv.address && <div>📍 {cv.address}</div>}
              {cv.linkedin && <div className="text-emerald-400 underline break-all text-[9.5px]">🔗 {cv.linkedin}</div>}
            </div>

            {/* Skills in Sidebar */}
            {cv.skills && cv.skills.length > 0 && (
              <div className="space-y-1.5 border-t border-slate-700 pt-3">
                <h3 className="text-[11px] font-black uppercase tracking-wider text-emerald-400 mb-1">Competencies</h3>
                <div className="flex flex-wrap gap-1">
                  {cv.skills.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-800 text-slate-200 rounded text-[9px] border border-slate-600">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages in Sidebar */}
            {cv.languages && cv.languages.length > 0 && (
              <div className="space-y-1 border-t border-slate-700 pt-3">
                <h3 className="text-[11px] font-black uppercase tracking-wider text-emerald-400 mb-1">Languages</h3>
                <div className="text-[10px] text-slate-300">{cv.languages.join(' • ')}</div>
              </div>
            )}
          </div>

          {cv.reference && cv.reference.name && (
            <div className="border-t border-slate-700 pt-3 text-[9.5px] text-slate-400">
              <div className="font-bold text-white text-[10px]">{cv.reference.name}</div>
              <div>{cv.reference.designation}</div>
              <div className="text-emerald-400 break-all">{cv.reference.email}</div>
            </div>
          )}
        </div>

        {/* Main Body Right (8 Cols) */}
        <div className="col-span-8 p-6 sm:p-7 space-y-4">
          {cv.personalStatement && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-emerald-500 pb-0.5 mb-1.5">
                Professional Profile
              </h2>
              <p className="text-[10.5px] text-zinc-700 leading-relaxed text-justify">{cv.personalStatement}</p>
            </section>
          )}

          {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-emerald-500 pb-0.5 mb-1.5">
                Accounting Qualifications
              </h2>
              <div className="space-y-1.5">
                {cv.professionalQualifications.map((pq, idx) => (
                  <div key={idx} className="p-2 bg-emerald-50/40 rounded border-l-3 border-emerald-600 flex justify-between items-baseline text-[10.5px]">
                    <div>
                      <span className="font-bold text-zinc-950">{pq.title}</span>
                      <span className="text-zinc-600 ml-2">({pq.details})</span>
                    </div>
                    {pq.dateInfo && <span className="text-[10px] font-semibold text-emerald-700">{pq.dateInfo}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {cv.academics && cv.academics.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-emerald-500 pb-0.5 mb-1.5">
                Education
              </h2>
              <div className="space-y-1.5">
                {cv.academics.map((acad, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[10.5px] border-b border-zinc-100 pb-1">
                    <div>
                      <span className="font-bold text-zinc-950">{acad.level}</span> — <span className="text-zinc-700">{acad.discipline}</span> ({acad.institute})
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">{acad.year}</span> | <span className="font-semibold text-emerald-700">{acad.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {cv.experience && cv.experience.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-emerald-500 pb-0.5 mb-1">
                Practical Experience
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
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-emerald-500 pb-0.5 mb-1">
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
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-emerald-500 pb-0.5 mb-1">
                  Key Honors
                </h2>
                <ul className="list-disc pl-4 space-y-0.5 text-[9.5px] text-zinc-700">
                  {cv.achievements.map((a, idx) => (
                    <li key={idx}>{a}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
