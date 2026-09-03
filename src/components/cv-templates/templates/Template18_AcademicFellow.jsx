import { Phone, Mail, MapPin, Globe } from 'lucide-react';

/**
 * 18 — ACCA STUDENT
 * Designed specifically for ACCA students & affiliates: Highlights Applied Skills / Strategic Professional papers, Oxford Brookes degree, and ethics module.
 */
export default function Template18_AcademicFellow({ cv }) {
  return (
    <div className="w-full bg-white text-zinc-900 font-sans text-[11px] leading-tight select-text min-h-[1050px] p-7 text-left">
      <div className="border-b-3 border-[#c00000] pb-4 mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {cv.profileImage && (
            <div className="w-18 h-18 rounded-xl overflow-hidden border-2 border-[#c00000] flex-shrink-0 shadow-sm">
              <img src={cv.profileImage} alt={cv.fullName} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <span className="px-2 py-0.5 bg-[#c00000] text-white font-bold text-[9px] rounded uppercase">
              ACCA Student / Affiliate
            </span>
            <h1 className="text-2xl font-black text-black font-['Outfit',sans-serif] mt-1">{cv.fullName}</h1>
            <div className="text-xs text-zinc-600 font-semibold">
              {[cv.ftsBatch, cv.crn, cv.targetRole || 'ACCA Trainee / Graduate'].filter(Boolean).join(' • ')}
            </div>
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
            <h2 className="text-xs font-black uppercase tracking-wider text-[#c00000] border-b border-zinc-200 pb-0.5 mb-1">
              Career Statement
            </h2>
            <p className="text-[10.5px] text-zinc-700 leading-relaxed text-justify">{cv.personalStatement}</p>
          </section>
        )}

        {/* ACCA Exam Progress */}
        {cv.professionalQualifications && cv.professionalQualifications.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-[#c00000] border-b border-zinc-200 pb-0.5 mb-1.5">
              ACCA Exam & Qualification Record
            </h2>
            <div className="space-y-1.5">
              {cv.professionalQualifications.map((pq, idx) => (
                <div key={idx} className="p-2 bg-red-50/40 rounded border-l-3 border-[#c00000] flex justify-between items-baseline text-[10.5px]">
                  <div>
                    <span className="font-bold text-zinc-950">{pq.title}</span>
                    <span className="text-zinc-600 ml-2">({pq.details})</span>
                  </div>
                  {pq.dateInfo && <span className="text-[10px] font-semibold text-[#c00000]">{pq.dateInfo}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {cv.academics && cv.academics.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-[#c00000] border-b border-zinc-200 pb-0.5 mb-1.5">
              Academic Background
            </h2>
            <div className="space-y-1.5">
              {cv.academics.map((acad, idx) => (
                <div key={idx} className="flex justify-between items-center text-[10.5px] border-b border-zinc-100 pb-1">
                  <div>
                    <strong>{acad.level}</strong> — <span className="text-zinc-700">{acad.discipline}</span> ({acad.institute})
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#c00000]">{acad.year}</span> | <span className="font-semibold">{acad.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-5">
          {cv.skills && cv.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#c00000] border-b border-zinc-200 pb-0.5 mb-1">
                Technical Expertise (IFRS / UK GAAP)
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
              <h2 className="text-xs font-black uppercase tracking-wider text-[#c00000] border-b border-zinc-200 pb-0.5 mb-1">
                Certifications & Diplomas
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
            <h2 className="text-xs font-black uppercase tracking-wider text-[#c00000] border-b border-zinc-200 pb-0.5 mb-1">
              Practical Experience
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
