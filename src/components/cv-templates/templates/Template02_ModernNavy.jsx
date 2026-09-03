import { Phone, Mail, MapPin, Globe, CheckCircle2 } from 'lucide-react';

/**
 * 02 — MODERN TWO COLUMN
 * Two-column balanced structure (40% Left / 60% Right).
 * Large header banner, distinct background on left column, timeline/linear layout on right.
 */
export default function Template02_ModernNavy({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[11px] leading-tight select-text min-h-[1050px] text-left">
      {/* Top Header Banner */}
      <div className="bg-[#0f172a] text-white p-7 flex justify-between items-center">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">Chartered Accountancy & Finance</span>
          <h1 className="text-2xl font-black text-white tracking-tight">{cv.fullName}</h1>
          <div className="text-xs text-sky-200 font-semibold">
            {[cv.ftsBatch, cv.crn, cv.targetRole || 'Audit & Assurance Trainee'].filter(Boolean).join(' • ')}
          </div>
        </div>
        {cv.profileImage && (
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-sky-400 shadow-md flex-shrink-0">
            <img src={cv.profileImage} alt={cv.fullName} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-12 min-h-[900px]">
        {/* Left Column (5 Cols) - Tinted Slate */}
        <div className="col-span-5 bg-slate-50 p-6 space-y-4 border-r border-slate-200">
          <div className="space-y-1.5 text-[10px] text-slate-700">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Contact Details
            </h3>
            {cv.phone && <div>📞 {cv.phone}</div>}
            {cv.email && <div className="break-all">✉️ {cv.email}</div>}
            {cv.address && <div>📍 {cv.address}</div>}
            {cv.linkedin && <div className="text-sky-700 underline break-all">🔗 {cv.linkedin}</div>}
          </div>

          {cv.skills && cv.skills.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                Core Competencies
              </h3>
              <div className="space-y-1">
                {cv.skills.map((s, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5 text-[10px] text-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cv.certifications && cv.certifications.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                Certifications
              </h3>
              <ul className="list-disc pl-4 space-y-1 text-[9.5px] text-slate-700">
                {cv.certifications.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {cv.languages && cv.languages.length > 0 && (
            <div className="space-y-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-1">
                Languages
              </h3>
              <p className="text-[10px] text-slate-700">{cv.languages.join(' • ')}</p>
            </div>
          )}

          {cv.reference && cv.reference.name && (
            <div className="space-y-0.5 text-[9.5px] text-slate-600 border-t border-slate-200 pt-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1">Reference</h3>
              <div className="font-bold text-slate-900">{cv.reference.name}</div>
              <div>{cv.reference.designation}</div>
              <div className="text-sky-700">{cv.reference.email}</div>
            </div>
          )}
        </div>

        {/* Right Column (7 Cols) - White */}
        <div className="col-span-7 p-6 space-y-4">
          {cv.personalStatement && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#0f172a] border-b-2 border-sky-600 pb-0.5 mb-1.5">
                Executive Profile
              </h3>
              <p className="text-[10px] text-zinc-700 leading-relaxed text-justify">{cv.personalStatement}</p>
            </section>
          )}

          {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#0f172a] border-b-2 border-sky-600 pb-0.5 mb-1.5">
                Accounting Qualifications
              </h3>
              <div className="space-y-1.5">
                {cv.professionalQualifications.map((pq, idx) => (
                  <div key={idx} className="p-2 bg-slate-50 rounded border-l-2 border-sky-600 text-[10px]">
                    <div className="font-bold text-zinc-950">{pq.title}</div>
                    <div className="text-slate-600">{pq.details} {pq.dateInfo && `(${pq.dateInfo})`}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {cv.experience && cv.experience.length > 0 && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#0f172a] border-b-2 border-sky-600 pb-0.5 mb-1.5">
                Practical Experience
              </h3>
              <ul className="list-disc pl-4 space-y-1 text-[10px] text-zinc-700">
                {cv.experience.map((e, idx) => (
                  <li key={idx}>{e}</li>
                ))}
              </ul>
            </section>
          )}

          {cv.academics && cv.academics.length > 0 && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#0f172a] border-b-2 border-sky-600 pb-0.5 mb-1.5">
                Education
              </h3>
              <div className="space-y-1.5">
                {cv.academics.map((acad, idx) => (
                  <div key={idx} className="flex justify-between text-[10px]">
                    <div>
                      <strong>{acad.level}</strong> ({acad.discipline}) — {acad.institute}
                    </div>
                    <span className="font-semibold text-slate-700">{acad.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
