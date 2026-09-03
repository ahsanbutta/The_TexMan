import { Phone, Mail, MapPin, Globe } from 'lucide-react';

/**
 * 04 — RIGHT SIDEBAR
 * Asymmetric inverted structure: Main content on Left (65%), Information & Credentials Sidebar on Right (35%).
 */
export default function Template04_Big4Executive({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[11px] leading-tight select-text min-h-[1050px] text-left">
      <div className="grid grid-cols-12 min-h-[1050px]">
        {/* Main Content Area Left (8 Cols - 67%) */}
        <div className="col-span-8 p-7 space-y-4 border-r border-zinc-200">
          <div className="border-b-2 border-black pb-3">
            <h1 className="text-2xl font-black text-black tracking-tight">{cv.fullName}</h1>
            <div className="text-xs font-bold text-zinc-700 mt-0.5">
              {[cv.ftsBatch, cv.crn, cv.targetRole || 'Audit Senior & Advisory Specialist'].filter(Boolean).join(' • ')}
            </div>
          </div>

          {cv.personalStatement && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-zinc-300 pb-0.5 mb-1.5">
                Executive Profile
              </h2>
              <p className="text-[10.5px] text-zinc-700 leading-relaxed text-justify">{cv.personalStatement}</p>
            </section>
          )}

          {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-zinc-300 pb-0.5 mb-1.5">
                Professional Qualifications
              </h2>
              <div className="space-y-1.5">
                {cv.professionalQualifications.map((pq, idx) => (
                  <div key={idx} className="p-2 bg-zinc-50 rounded border-l-3 border-black flex justify-between items-baseline text-[10.5px]">
                    <div>
                      <strong className="text-zinc-950">{pq.title}</strong>
                      <span className="text-zinc-600 ml-2">({pq.details})</span>
                    </div>
                    {pq.dateInfo && <span className="text-[10px] font-semibold text-zinc-800">{pq.dateInfo}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {cv.experience && cv.experience.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-zinc-300 pb-0.5 mb-1.5">
                Practical Experience & Client Engagements
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
              <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-zinc-300 pb-0.5 mb-1.5">
                Academic Background
              </h2>
              <div className="space-y-1.5">
                {cv.academics.map((acad, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[10.5px] border-b border-zinc-100 pb-1">
                    <div>
                      <strong>{acad.level}</strong> — <span className="text-zinc-700">{acad.discipline}</span> ({acad.institute})
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-black">{acad.year}</span> | <span className="font-semibold">{acad.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Information Sidebar Right (4 Cols - 33%) */}
        <div className="col-span-4 bg-zinc-50 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            {cv.profileImage && (
              <div className="flex justify-center pt-2">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-zinc-800 shadow">
                  <img src={cv.profileImage} alt={cv.fullName} className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            <div className="space-y-1.5 text-[10px] text-zinc-700 border-b border-zinc-200 pb-3">
              <h3 className="text-xs font-black uppercase text-black mb-1">Contact Details</h3>
              {cv.phone && <div>📞 {cv.phone}</div>}
              {cv.email && <div className="break-all">✉️ {cv.email}</div>}
              {cv.address && <div>📍 {cv.address}</div>}
              {cv.linkedin && <div className="text-blue-700 underline break-all text-[9.5px]">🔗 {cv.linkedin}</div>}
            </div>

            {cv.skills && cv.skills.length > 0 && (
              <div className="space-y-1">
                <h3 className="text-xs font-black uppercase text-black">Skills & ERP</h3>
                <div className="flex flex-wrap gap-1">
                  {cv.skills.map((s, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 bg-white text-zinc-900 rounded text-[9px] border border-zinc-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {cv.certifications && cv.certifications.length > 0 && (
              <div className="space-y-1 border-t border-zinc-200 pt-3">
                <h3 className="text-xs font-black uppercase text-black">Certifications</h3>
                <ul className="list-disc pl-3 text-[9.5px] text-zinc-700 space-y-0.5">
                  {cv.certifications.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {cv.languages && cv.languages.length > 0 && (
              <div className="space-y-1 border-t border-zinc-200 pt-3">
                <h3 className="text-xs font-black uppercase text-black">Languages</h3>
                <div className="text-[10px] text-zinc-700">{cv.languages.join(' • ')}</div>
              </div>
            )}
          </div>

          {cv.reference && cv.reference.name && (
            <div className="border-t border-zinc-200 pt-3 space-y-0.5 text-[9.5px] text-zinc-700">
              <h3 className="text-xs font-black uppercase text-black mb-0.5">Reference</h3>
              <div className="font-bold text-zinc-900 text-[10px]">{cv.reference.name}</div>
              <div>{cv.reference.designation}</div>
              <div className="text-blue-700">{cv.reference.email}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
