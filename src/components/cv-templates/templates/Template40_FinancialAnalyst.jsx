import { Phone, Mail, MapPin, Globe, User } from 'lucide-react';

/**
 * 40 — PHOTO MODERN
 * Photo plays a meaningful structural role: Asymmetric floating portrait card on left anchoring the entire modern layout.
 */
export default function Template40_FinancialAnalyst({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[11px] leading-tight select-text min-h-[1050px] p-7 text-left">
      {/* Modern Asymmetric Header with Large Portrait Card */}
      <div className="grid grid-cols-12 gap-5 mb-5 pb-5 border-b-2 border-zinc-900 items-center">
        <div className="col-span-3 flex justify-center">
          <div className="w-28 h-32 rounded-3xl overflow-hidden border-2 border-zinc-900 shadow-md bg-zinc-100 flex items-center justify-center">
            {cv.profileImage ? (
              <img src={cv.profileImage} alt={cv.fullName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-14 h-14 text-zinc-400" />
            )}
          </div>
        </div>

        <div className="col-span-9 space-y-1.5">
          <span className="px-2.5 py-0.5 bg-zinc-900 text-white font-bold text-[9px] rounded-full uppercase tracking-wider">
            Audit & Professional Accounting
          </span>
          <h1 className="text-2xl font-black text-black tracking-tight">{cv.fullName}</h1>
          <div className="text-xs font-semibold text-zinc-700">
            {[cv.ftsBatch, cv.crn, cv.targetRole || 'Audit & Assurance Trainee'].filter(Boolean).join(' • ')}
          </div>
          <div className="text-[10px] text-zinc-600 flex flex-wrap gap-x-4 gap-y-0.5 pt-1">
            {cv.phone && <span>📞 {cv.phone}</span>}
            {cv.email && <span>✉️ {cv.email}</span>}
            {cv.address && <span>📍 {cv.address}</span>}
            {cv.linkedin && <span className="underline">🔗 {cv.linkedin}</span>}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {cv.personalStatement && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-black border-b border-zinc-200 pb-0.5 mb-1">
              Professional Profile
            </h2>
            <p className="text-[10.5px] text-zinc-700 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-black border-b border-zinc-200 pb-0.5 mb-1.5">
              Professional Qualifications & Accreditations
            </h2>
            <div className="space-y-1.5">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="p-2 bg-zinc-50 rounded-xl border border-zinc-200 flex justify-between items-baseline text-[10.5px]">
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
            <h2 className="text-xs font-black uppercase tracking-wider text-black border-b border-zinc-200 pb-0.5 mb-1">
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
            <h2 className="text-xs font-black uppercase tracking-wider text-black border-b border-zinc-200 pb-0.5 mb-1.5">
              Academic Background
            </h2>
            <div className="space-y-1.5 text-[10px]">
              {cv.academics.map((acad, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-zinc-100 pb-1">
                  <div>
                    <strong>{acad.level}</strong> — <span className="text-zinc-700">{acad.discipline}</span> ({acad.institute})
                  </div>
                  <div className="text-right font-semibold text-zinc-800">{acad.year} | {acad.score}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-5">
          {cv.skills && cv.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-black border-b border-zinc-200 pb-0.5 mb-1">
                Core Competencies
              </h2>
              <div className="flex flex-wrap gap-1">
                {cv.skills.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-zinc-100 text-zinc-800 rounded font-medium text-[9px] border border-zinc-200">{s}</span>
                ))}
              </div>
            </section>
          )}

          {cv.certifications && cv.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-black border-b border-zinc-200 pb-0.5 mb-1">
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
