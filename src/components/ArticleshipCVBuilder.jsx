import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  FileText,
  Printer,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Award,
  BookOpen,
  User,
  Phone,
  Mail,
  MapPin,
  Globe,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  LayoutGrid,
  Shuffle,
  ShieldCheck,
  Image as ImageIcon,
  Save,
  Download,
  Share2,
  Eye,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize2,
  AlertCircle,
  HelpCircle,
  Sliders,
  Palette,
  Type,
  Layers
} from 'lucide-react';

import {
  DEFAULT_CV_DATA,
  DUMMY_AVATARS,
  normalizeCVData
} from './cv-templates/cvDataModel';

import {
  CV_TEMPLATES,
  getTemplateById,
  getRecommendedTemplate,
  getRandomTemplate
} from './cv-templates/templateRegistry';

import TemplateSelectorModal from './cv-templates/TemplateSelectorModal';

export const HAFIZ_NUMAN_CV_DATA = DEFAULT_CV_DATA;

// Step Navigation Definitions
const CV_STEPS = [
  { id: 'personal', number: 1, label: 'Personal', icon: User, desc: 'Contact & Profile' },
  { id: 'qualifications', number: 2, label: 'CA / ACCA', icon: Award, desc: 'CRN & Exam Status' },
  { id: 'academics', number: 3, label: 'Education', icon: GraduationCap, desc: 'Matric / Inter / Degrees' },
  { id: 'summary', number: 4, label: 'Summary', icon: FileText, desc: 'Articleship Objective' },
  { id: 'experience', number: 5, label: 'Experience', icon: Briefcase, desc: 'Practical & Training' },
  { id: 'certifications', number: 6, label: 'Courses', icon: BookOpen, desc: 'SKANS, Excel, Tools' },
  { id: 'skills', number: 7, label: 'Skills', icon: Sparkles, desc: 'IFRS, ISA, Technical' },
  { id: 'achievements', number: 8, label: 'Achievements', icon: Award, desc: 'Merits & Scholarships' },
  { id: 'sidebar', number: 9, label: 'References', icon: ShieldCheck, desc: 'Ref & Extracurriculars' },
  { id: 'appearance', number: 10, label: 'Appearance', icon: Palette, desc: 'Color & Typography' }
];

export default function ArticleshipCVBuilder() {
  // Initialize CV data from localStorage if available, otherwise default
  const [cv, setCv] = useState(() => {
    try {
      const saved = localStorage.getItem('texman_cv_data');
      if (saved) {
        return normalizeCVData(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to parse saved CV from localStorage', e);
    }
    return DEFAULT_CV_DATA;
  });

  const [activeTemplateId, setActiveTemplateId] = useState(() => {
    try {
      const savedTpl = localStorage.getItem('texman_selected_template_id');
      if (savedTpl && getTemplateById(savedTpl)) {
        return savedTpl;
      }
    } catch (e) {
      console.warn(e);
    }
    return cv.templateId || 'classic-black';
  });

  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(1); // 0.75 | 0.9 | 1 | 1.1
  const [mobileViewTab, setMobileViewTab] = useState('editor'); // 'editor' | 'preview'
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saving' | 'saved'
  const [lastSavedTime, setLastSavedTime] = useState('just now');
  const [surpriseToast, setSurpriseToast] = useState(null);

  const fileInputRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  const stepTabsRef = useRef(null);

  // Auto-scroll active tab into center view smoothly when navigating
  useEffect(() => {
    if (stepTabsRef.current) {
      const activeEl = stepTabsRef.current.querySelector(`[data-step-idx="${activeStepIdx}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeStepIdx]);

  // Auto-sync CV data and template to localStorage with subtle debounced indicator
  useEffect(() => {
    setSaveStatus('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem('texman_cv_data', JSON.stringify(cv));
        localStorage.setItem('texman_selected_template_id', activeTemplateId);
        setSaveStatus('saved');
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch (e) {
        console.warn('Failed to save CV data to localStorage', e);
      }
    }, 400);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [cv, activeTemplateId]);

  // Normalized CV data passed to the template component
  const normalizedCV = useMemo(() => {
    return normalizeCVData({ ...cv, templateId: activeTemplateId });
  }, [cv, activeTemplateId]);

  // Get active template config
  const activeTemplate = useMemo(() => {
    return getTemplateById(activeTemplateId) || CV_TEMPLATES[0];
  }, [activeTemplateId]);

  // Active Template Component
  const ActiveTemplateComponent = activeTemplate.component;

  // Real-Time Dynamic Completion Score Calculation
  const completionAnalysis = useMemo(() => {
    let score = 0;
    const missing = [];

    // 1. Personal & Contact (20%)
    if (cv.fullName && cv.fullName.trim().length > 2 && cv.fullName !== 'Your Full Name') score += 5;
    else missing.push({ label: 'Full Name', stepIdx: 0 });

    if (cv.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cv.email)) score += 5;
    else missing.push({ label: 'Valid Email', stepIdx: 0 });

    if (cv.phone && cv.phone.trim().length > 6) score += 5;
    else missing.push({ label: 'Phone Number', stepIdx: 0 });

    if (cv.address || cv.linkedin) score += 5;
    else missing.push({ label: 'Address / LinkedIn', stepIdx: 0 });

    // 2. CA/ACCA Qualifications (15%)
    if (cv.professionalQualifications && cv.professionalQualifications.length > 0) {
      score += 15;
    } else {
      missing.push({ label: 'CA / ACCA Stage', stepIdx: 1 });
    }

    // 3. Academic Education (15%)
    if (cv.academics && cv.academics.length > 0 && cv.academics[0].institute) {
      score += 15;
    } else {
      missing.push({ label: 'Academics (Matric/Inter)', stepIdx: 2 });
    }

    // 4. Personal Statement (15%)
    if (cv.personalStatement && cv.personalStatement.trim().length > 30) {
      score += 15;
    } else {
      missing.push({ label: 'Articleship Objective Summary', stepIdx: 3 });
    }

    // 5. Experience (10%)
    if (cv.experience && cv.experience.length > 0) {
      score += 10;
    } else {
      missing.push({ label: 'Experience / Tutoring', stepIdx: 4 });
    }

    // 6. Certifications (5%)
    if (cv.certifications && cv.certifications.length > 0) {
      score += 5;
    } else {
      missing.push({ label: 'Courses / IT Skills', stepIdx: 5 });
    }

    // 7. Skills (10%)
    if (cv.skills && cv.skills.length >= 3) {
      score += 10;
    } else {
      missing.push({ label: 'Add 3+ Technical Skills', stepIdx: 6 });
    }

    // 8. Achievements / Ref (10%)
    if (cv.achievements && cv.achievements.length > 0) score += 5;
    if (cv.reference && cv.reference.name) score += 5;
    if (!cv.reference?.name && (!cv.achievements || cv.achievements.length === 0)) {
      missing.push({ label: 'Achievements or Mentor Reference', stepIdx: 7 });
    }

    return {
      percentage: Math.min(100, Math.round(score)),
      missing
    };
  }, [cv]);

  // Handle Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCv((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Select Dummy Avatar
  const handleSelectDummyAvatar = (avatarSrc) => {
    setCv((prev) => ({ ...prev, profileImage: avatarSrc }));
    setIsAvatarModalOpen(false);
  };

  // Generic List Modifier Helpers
  const handleListChange = (field, index, value) => {
    setCv((prev) => {
      const updated = [...(prev[field] || [])];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const handleAddListItem = (field, defaultValue = '') => {
    setCv((prev) => ({ ...prev, [field]: [...(prev[field] || []), defaultValue] }));
  };

  const handleRemoveListItem = (field, index) => {
    setCv((prev) => ({ ...prev, [field]: (prev[field] || []).filter((_, i) => i !== index) }));
  };

  // Print & PDF Export Trigger
  const handlePrint = () => {
    window.print();
  };

  // Reset to Sample CV
  const handleReset = () => {
    if (confirm('Load standard Hafiz Muhammad Numan sample CA CV template?')) {
      setCv(DEFAULT_CV_DATA);
      setActiveTemplateId('classic-black');
      setActiveStepIdx(0);
    }
  };

  // Surprise Me Template Randomizer
  const handleSurpriseMe = () => {
    const random = getRandomTemplate(activeTemplateId);
    setActiveTemplateId(random.id);
    setSurpriseToast(`Applied Template: ${random.name} (T-${random.number})`);
    setTimeout(() => setSurpriseToast(null), 3500);
  };

  const currentStep = CV_STEPS[activeStepIdx];

  return (
    <div className="space-y-6 select-none font-sans">
      
      {/* ── TOP HERO STUDIO BANNER & CONTROLS ── */}
      <div className="bg-[#021B3A] p-5 sm:p-7 rounded-3xl border border-white/10 shadow-2xl space-y-5 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-brandGreen/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-2xl text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-brandGreen/20 text-emerald-400 font-black text-[10px] rounded-full border border-brandGreen/30 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brandGreen animate-pulse" />
                <span>Professional CV Studio</span>
              </span>
              <span className="text-xs text-gray-300 font-medium flex items-center space-x-1">
                <span>{CV_TEMPLATES.length} Verified CA / ACCA Templates</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit',sans-serif] tracking-tight">
              Build Your Articleship & Finance CV
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Create once, customize dynamically, and switch between 47 professional layouts with 100% data preservation and pixel-perfect A4 single-page PDF output.
            </p>

            {/* Feature Checkmark Badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-[11px] text-gray-300">
              <span className="inline-flex items-center space-x-1 text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-brandGreen" />
                <span>ATS-Friendly Layouts</span>
              </span>
              <span className="inline-flex items-center space-x-1 text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-brandGreen" />
                <span>Instant Live Preview</span>
              </span>
              <span className="inline-flex items-center space-x-1 text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-brandGreen" />
                <span>Zero Blank Page Print Guarantee</span>
              </span>
            </div>
          </div>

          {/* Global Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* Change Template Button */}
            <button
              onClick={() => setIsTemplateModalOpen(true)}
              type="button"
              className="flex-1 sm:flex-none px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-black font-black rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all cursor-pointer"
            >
              <LayoutGrid className="w-4 h-4 text-black" />
              <span>Change Template (T-{activeTemplate.number})</span>
            </button>

            {/* Surprise Me Button */}
            <button
              onClick={handleSurpriseMe}
              type="button"
              title="Randomly switch to another distinct template"
              className="px-3.5 py-3 bg-purple-600/25 hover:bg-purple-600/40 text-purple-200 border border-purple-500/30 font-extrabold rounded-2xl text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5 text-purple-300" />
              <span className="hidden sm:inline">Surprise Me</span>
            </button>

            {/* Reset Sample CV */}
            <button
              onClick={handleReset}
              type="button"
              className="p-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-2xl transition-colors cursor-pointer border border-white/10"
              title="Reset to Hafiz Numan sample CV"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Export PDF / Print Button */}
            <button
              onClick={handlePrint}
              type="button"
              className="px-5 py-3 bg-brandGreen text-black font-black rounded-2xl text-xs flex items-center space-x-2 shadow-md hover:bg-brandGreen-light transition-all cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Export PDF / Print</span>
            </button>
          </div>
        </div>

        {/* Dynamic CV Completion Bar & Autosave Status */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1.5 w-full sm:w-auto flex-1 max-w-lg">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-gray-300 uppercase tracking-wider">CV Strength & Completeness:</span>
              <span className={`font-black ${completionAnalysis.percentage >= 80 ? 'text-emerald-400' : completionAnalysis.percentage >= 50 ? 'text-blue-400' : 'text-amber-400'}`}>
                {completionAnalysis.percentage}% Complete
              </span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  completionAnalysis.percentage >= 80
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : completionAnalysis.percentage >= 50
                    ? 'bg-gradient-to-r from-blue-500 to-emerald-400'
                    : 'bg-gradient-to-r from-amber-500 to-amber-400'
                }`}
                style={{ width: `${completionAnalysis.percentage}%` }}
              />
            </div>
          </div>

          {/* Missing Fields Checklist Shortcuts */}
          {completionAnalysis.missing.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-gray-400 font-bold uppercase mr-1">Recommended:</span>
              {completionAnalysis.missing.slice(0, 2).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStepIdx(item.stepIdx)}
                  className="px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:text-white hover:bg-amber-500/30 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center space-x-1"
                >
                  <span>+ {item.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-emerald-400 font-bold text-[11px]">
              <CheckCircle2 className="w-4 h-4" />
              <span>All essential CV fields completed!</span>
            </div>
          )}

          {/* Autosave Status Pill */}
          <div className="text-[10px] text-gray-400 flex items-center space-x-1.5 flex-shrink-0">
            <span className={`w-2 h-2 rounded-full ${saveStatus === 'saving' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            <span>{saveStatus === 'saving' ? 'Autosaving...' : `Saved (${lastSavedTime})`}</span>
          </div>
        </div>

        {/* Surprise Toast Notification */}
        {surpriseToast && (
          <div className="p-3 bg-purple-500/20 border border-purple-500/40 text-purple-200 rounded-2xl text-xs font-bold flex items-center justify-between animate-scaleUp">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span>{surpriseToast}</span>
            </div>
            <span className="text-[10px] text-gray-400">100% Data Preserved</span>
          </div>
        )}
      </div>

      {/* ── MOBILE VIEW TAB SWITCHER (EDITOR vs PREVIEW) ── */}
      <div className="flex xl:hidden items-center justify-center p-1.5 bg-[#021B3A] rounded-2xl border border-white/10 text-xs font-extrabold space-x-2">
        <button
          onClick={() => setMobileViewTab('editor')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
            mobileViewTab === 'editor' ? 'bg-brandGreen text-black shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Edit Form</span>
        </button>
        <button
          onClick={() => setMobileViewTab('preview')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
            mobileViewTab === 'preview' ? 'bg-brandGreen text-black shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live A4 Preview</span>
        </button>
      </div>

      {/* ── TWO-PANE MAIN WORKSPACE (EDITOR LEFT + LIVE PREVIEW RIGHT) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* ==================================================== */}
        {/* LEFT COLUMN: 10-STEP VISUAL CV FORM EDITOR           */}
        {/* ==================================================== */}
        <div className={`xl:col-span-5 bg-[#021B3A] p-5 sm:p-6 rounded-3xl border border-white/10 shadow-2xl space-y-5 text-left ${
          mobileViewTab === 'preview' ? 'hidden xl:block' : 'block'
        }`}>
          
          {/* Active Template Status Card */}
          <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-1 bg-black/60 text-emerald-400 font-black text-xs rounded-lg border border-brandGreen/30">
                T-{activeTemplate.number}
              </span>
              <div>
                <div className="text-xs font-black text-white leading-tight">
                  {activeTemplate.name}
                </div>
                <div className="text-[10px] text-gray-400 flex items-center space-x-1.5 mt-0.5">
                  <span>{activeTemplate.category}</span>
                  {activeTemplate.isATSFriendly && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold flex items-center space-x-0.5">
                        <ShieldCheck className="w-3 h-3" />
                        <span>ATS Optimized</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsTemplateModalOpen(true)}
              type="button"
              className="text-xs font-bold text-brandGreen hover:underline cursor-pointer flex items-center space-x-1"
            >
              <span>Browse All (47)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Animated The CA Hub Style Responsive Step Navigation Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-extrabold text-white flex items-center space-x-2">
                <currentStep.icon className="w-4 h-4 text-brandGreen" />
                <span className="text-sm font-black text-white">{currentStep.label}</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-400 bg-brandGreen/15 px-2.5 py-0.5 rounded-full border border-brandGreen/30">
                {currentStep.desc}
              </span>
            </div>

            {/* Responsive Scrollable Pill Container */}
            <div className="relative group">
              <div
                ref={stepTabsRef}
                className="flex items-center space-x-2 overflow-x-auto scrollbar-none p-1.5 bg-black/40 rounded-2xl border border-white/10 scroll-smooth"
              >
                {CV_STEPS.map((step, idx) => {
                  const isCurrent = activeStepIdx === idx;
                  const Icon = step.icon;

                  return (
                    <button
                      key={step.id}
                      data-step-idx={idx}
                      onClick={() => setActiveStepIdx(idx)}
                      type="button"
                      className={`px-3.5 py-2.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center space-x-2 flex-shrink-0 ${
                        isCurrent
                          ? 'bg-brandGreen text-black shadow-lg shadow-brandGreen/30 scale-[1.02] font-black'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-black' : 'text-gray-400'}`} />
                      <span>{step.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── STEP 1: PERSONAL & CONTACT INFORMATION ── */}
          {activeStepIdx === 0 && (
            <div className="space-y-4 animate-fadeIn text-xs">
              
              {/* Profile Photo Controls */}
              <div className="space-y-2 p-4 bg-white/5 rounded-2xl border border-white/10">
                <label className="block text-gray-300 font-bold">Profile Photo / Avatar</label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brandGreen bg-black/40 flex items-center justify-center flex-shrink-0 shadow-md">
                    {cv.profileImage ? (
                      <img src={cv.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-gray-500" />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[11px] font-bold flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-brandGreen" />
                        <span>Upload Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsAvatarModalOpen(true)}
                        className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-[11px] font-bold flex items-center space-x-1.5 cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Dummy Portraits</span>
                      </button>

                      {cv.profileImage && (
                        <button
                          type="button"
                          onClick={() => setCv((prev) => ({ ...prev, profileImage: '' }))}
                          className="px-2.5 py-1.5 text-red-400 hover:text-red-300 rounded-xl text-[11px] font-bold cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Upload clean portrait headshot or pick from 6 CA/ACCA dummy avatars.
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Personal Details Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-400 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={cv.fullName}
                    onChange={(e) => setCv({ ...cv, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brandGreen select-text"
                    placeholder="e.g. Hafiz Muhammad Numan"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 font-semibold mb-1">Target Role / Sub-title *</label>
                  <input
                    type="text"
                    value={cv.targetRole}
                    onChange={(e) => setCv({ ...cv, targetRole: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brandGreen select-text"
                    placeholder="e.g. Chartered Accountant Trainee"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={cv.email}
                    onChange={(e) => setCv({ ...cv, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brandGreen select-text"
                    placeholder="e.g. numan.ca@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 font-semibold mb-1">Phone / WhatsApp *</label>
                  <input
                    type="text"
                    value={cv.phone}
                    onChange={(e) => setCv({ ...cv, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brandGreen select-text"
                    placeholder="e.g. 0310 4383648"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-gray-400 font-semibold mb-1">Residential Address / City</label>
                  <input
                    type="text"
                    value={cv.address}
                    onChange={(e) => setCv({ ...cv, address: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brandGreen select-text"
                    placeholder="e.g. House no 328/J Walton Road, Lahore"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 font-semibold mb-1">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    value={cv.linkedin}
                    onChange={(e) => setCv({ ...cv, linkedin: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brandGreen select-text"
                    placeholder="e.g. linkedin.com/in/numan-mughal"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 font-semibold mb-1">Portfolio / Website (Optional)</label>
                  <input
                    type="text"
                    value={cv.website}
                    onChange={(e) => setCv({ ...cv, website: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brandGreen select-text"
                    placeholder="e.g. numan-audit.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: CA / ACCA QUALIFICATIONS ── */}
          {activeStepIdx === 1 && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-white/5 rounded-2xl border border-white/10">
                <div>
                  <label className="block text-[11px] text-gray-400 font-semibold mb-1">FTS Batch No.</label>
                  <input
                    type="text"
                    value={cv.ftsBatch}
                    onChange={(e) => setCv({ ...cv, ftsBatch: e.target.value })}
                    className="w-full px-3 py-2 bg-navy border border-white/10 rounded-xl text-white focus:outline-none focus:border-brandGreen select-text"
                    placeholder="e.g. FTS – 35"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 font-semibold mb-1">ICAP CRN / Roll No.</label>
                  <input
                    type="text"
                    value={cv.crn}
                    onChange={(e) => setCv({ ...cv, crn: e.target.value })}
                    className="w-full px-3 py-2 bg-navy border border-white/10 rounded-xl text-white focus:outline-none focus:border-brandGreen select-text"
                    placeholder="e.g. CRN - 129144"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-gray-300 font-bold">Qualification Stages (AFC, CAF, ACCA)</label>
                  <button
                    type="button"
                    onClick={() =>
                      setCv((prev) => ({
                        ...prev,
                        professionalQualifications: [
                          ...prev.professionalQualifications,
                          { title: 'New Stage', details: 'in 1 attempt', dateInfo: '(Year)' }
                        ]
                      }))
                    }
                    className="px-2.5 py-1 bg-brandGreen/20 text-emerald-400 hover:bg-brandGreen text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Stage</span>
                  </button>
                </div>

                {cv.professionalQualifications.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2 relative group">
                    <button
                      type="button"
                      onClick={() =>
                        setCv((prev) => ({
                          ...prev,
                          professionalQualifications: prev.professionalQualifications.filter((_, i) => i !== idx)
                        }))
                      }
                      className="absolute top-2.5 right-2.5 text-gray-500 hover:text-red-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...cv.professionalQualifications];
                          updated[idx].title = e.target.value;
                          setCv({ ...cv, professionalQualifications: updated });
                        }}
                        className="px-2.5 py-1.5 bg-navy border border-white/10 rounded-lg text-white text-xs select-text"
                        placeholder="Stage Title"
                      />
                      <input
                        type="text"
                        value={item.details}
                        onChange={(e) => {
                          const updated = [...cv.professionalQualifications];
                          updated[idx].details = e.target.value;
                          setCv({ ...cv, professionalQualifications: updated });
                        }}
                        className="px-2.5 py-1.5 bg-navy border border-white/10 rounded-lg text-white text-xs select-text"
                        placeholder="e.g. in 1 attempt"
                      />
                      <input
                        type="text"
                        value={item.dateInfo}
                        onChange={(e) => {
                          const updated = [...cv.professionalQualifications];
                          updated[idx].dateInfo = e.target.value;
                          setCv({ ...cv, professionalQualifications: updated });
                        }}
                        className="px-2.5 py-1.5 bg-navy border border-white/10 rounded-lg text-white text-xs select-text"
                        placeholder="e.g. (June 2021)"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 3: ACADEMIC EDUCATION ── */}
          {activeStepIdx === 2 && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className="flex items-center justify-between">
                <label className="text-gray-300 font-bold">Academic Degrees (Inter, Matric, Graduation)</label>
                <button
                  type="button"
                  onClick={() =>
                    setCv((prev) => ({
                      ...prev,
                      academics: [
                        ...prev.academics,
                        {
                          level: 'BACHELORS',
                          year: '(2023)',
                          discipline: 'Commerce / Accounting',
                          institute: 'University Name',
                          score: '3.8 CGPA'
                        }
                      ]
                    }))
                  }
                  className="px-2.5 py-1 bg-brandGreen/20 text-emerald-400 hover:bg-brandGreen text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Degree</span>
                </button>
              </div>

              {cv.academics.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-white/5 border border-white/10 rounded-2xl space-y-2.5 relative">
                  <button
                    type="button"
                    onClick={() =>
                      setCv((prev) => ({
                        ...prev,
                        academics: prev.academics.filter((_, i) => i !== idx)
                      }))
                    }
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-400 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={item.level}
                      onChange={(e) => {
                        const updated = [...cv.academics];
                        updated[idx].level = e.target.value;
                        setCv({ ...cv, academics: updated });
                      }}
                      className="px-2.5 py-1.5 bg-navy border border-white/10 rounded-lg text-white font-bold select-text"
                      placeholder="e.g. INTERMEDIATE"
                    />
                    <input
                      type="text"
                      value={item.year}
                      onChange={(e) => {
                        const updated = [...cv.academics];
                        updated[idx].year = e.target.value;
                        setCv({ ...cv, academics: updated });
                      }}
                      className="px-2.5 py-1.5 bg-navy border border-white/10 rounded-lg text-white select-text"
                      placeholder="e.g. (2020)"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={item.discipline}
                      onChange={(e) => {
                        const updated = [...cv.academics];
                        updated[idx].discipline = e.target.value;
                        setCv({ ...cv, academics: updated });
                      }}
                      className="px-2.5 py-1.5 bg-navy border border-white/10 rounded-lg text-white select-text"
                      placeholder="Discipline (e.g. FSC Pre-Medical)"
                    />
                    <input
                      type="text"
                      value={item.score}
                      onChange={(e) => {
                        const updated = [...cv.academics];
                        updated[idx].score = e.target.value;
                        setCv({ ...cv, academics: updated });
                      }}
                      className="px-2.5 py-1.5 bg-navy border border-white/10 rounded-lg text-white select-text"
                      placeholder="Score (e.g. 76.27% (A))"
                    />
                  </div>

                  <input
                    type="text"
                    value={item.institute}
                    onChange={(e) => {
                      const updated = [...cv.academics];
                      updated[idx].institute = e.target.value;
                      setCv({ ...cv, academics: updated });
                    }}
                    className="w-full px-2.5 py-1.5 bg-navy border border-white/10 rounded-lg text-white select-text"
                    placeholder="Institute / College Name"
                  />
                </div>
              ))}
            </div>
          )}

          {/* ── STEP 4: PROFESSIONAL SUMMARY & OBJECTIVE ── */}
          {activeStepIdx === 3 && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <label className="block text-gray-300 font-bold">Articleship Career Objective & Profile Summary</label>
              <textarea
                rows="6"
                value={cv.personalStatement}
                onChange={(e) => setCv({ ...cv, personalStatement: e.target.value })}
                className="w-full p-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-brandGreen leading-relaxed select-text"
                placeholder="Write your targeted career objective highlighting integrity, analytical mindset, and motivation to excel in CA Articleship..."
              />

              <div className="p-3 bg-brandGreen/10 border border-brandGreen/20 rounded-xl space-y-1 text-emerald-300 text-[11px]">
                <strong className="block font-bold">💡 Big 4 Partner Tip:</strong>
                <span>Keep your objective focused on practical accounting, audit mechanics, adaptability, and high professional skepticism.</span>
              </div>
            </div>
          )}

          {/* ── STEP 5: PRACTICAL EXPERIENCE & TRAINING ── */}
          {activeStepIdx === 4 && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className="flex items-center justify-between">
                <label className="text-gray-300 font-bold">Practical Experience & Articleship Exposure</label>
                <button
                  type="button"
                  onClick={() => handleAddListItem('experience', 'New Practical Role / Freelance Accounting')}
                  className="px-2.5 py-1 bg-brandGreen/20 text-emerald-400 hover:bg-brandGreen text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Experience</span>
                </button>
              </div>

              {cv.experience.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleListChange('experience', idx, e.target.value)}
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white select-text"
                    placeholder="e.g. Teaching Experience in Accounting & Business Mathematics"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveListItem('experience', idx)}
                    className="p-2 text-gray-500 hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── STEP 6: COURSES & IT CERTIFICATIONS ── */}
          {activeStepIdx === 5 && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className="flex items-center justify-between">
                <label className="text-gray-300 font-bold">Courses & IT Certifications (SKANS, MS Office, Power BI)</label>
                <button
                  type="button"
                  onClick={() => handleAddListItem('certifications', 'Course Title (Institute)')}
                  className="px-2.5 py-1 bg-brandGreen/20 text-emerald-400 hover:bg-brandGreen text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Course</span>
                </button>
              </div>

              {cv.certifications.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleListChange('certifications', idx, e.target.value)}
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white select-text"
                    placeholder="e.g. Ms. Office (SKANS Lahore)"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveListItem('certifications', idx)}
                    className="p-2 text-gray-500 hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── STEP 7: TECHNICAL & SOFT SKILLS ── */}
          {activeStepIdx === 6 && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className="flex items-center justify-between">
                <label className="text-gray-300 font-bold">Core Skills (IFRS, ISA, Excel, ERP)</label>
                <button
                  type="button"
                  onClick={() => handleAddListItem('skills', 'New Technical Skill')}
                  className="px-2.5 py-1 bg-brandGreen/20 text-emerald-400 hover:bg-brandGreen text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>
              </div>

              {/* Quick Add Suggestions */}
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">One-Click Suggestions:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'IFRS 15 & 16 Application',
                    'ISA 315 Risk Assessment',
                    'Advanced MS Excel (XLOOKUP)',
                    'Withholding Tax ITO 2001',
                    'QuickBooks Accounting',
                    'Financial Modeling'
                  ].map((sugg, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        if (!cv.skills.includes(sugg)) {
                          setCv((prev) => ({ ...prev, skills: [...prev.skills, sugg] }));
                        }
                      }}
                      className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-[10px] font-semibold cursor-pointer transition-all"
                    >
                      + {sugg}
                    </button>
                  ))}
                </div>
              </div>

              {cv.skills.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleListChange('skills', idx, e.target.value)}
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white select-text"
                    placeholder="e.g. Audit Sampling & Risk Assessment"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveListItem('skills', idx)}
                    className="p-2 text-gray-500 hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── STEP 8: ACHIEVEMENTS & SCHOLARSHIPS ── */}
          {activeStepIdx === 7 && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className="flex items-center justify-between">
                <label className="text-gray-300 font-bold">Key Achievements & Distinctions</label>
                <button
                  type="button"
                  onClick={() => handleAddListItem('achievements', 'New Academic Distinction / Award')}
                  className="px-2.5 py-1 bg-brandGreen/20 text-emerald-400 hover:bg-brandGreen text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Achievement</span>
                </button>
              </div>

              {cv.achievements.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleListChange('achievements', idx, e.target.value)}
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white select-text"
                    placeholder="e.g. 75% scholarship for Intermediate"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveListItem('achievements', idx)}
                    className="p-2 text-gray-500 hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── STEP 9: REFERENCES & EXTRACURRICULARS ── */}
          {activeStepIdx === 8 && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                <label className="block text-gray-300 font-bold">Academic / Professional Reference</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={cv.reference?.name || ''}
                    onChange={(e) =>
                      setCv({ ...cv, reference: { ...cv.reference, name: e.target.value } })
                    }
                    className="px-3 py-2 bg-navy border border-white/10 rounded-xl text-white select-text"
                    placeholder="Mentor Name (e.g. Ali Imran ACA)"
                  />
                  <input
                    type="text"
                    value={cv.reference?.designation || ''}
                    onChange={(e) =>
                      setCv({ ...cv, reference: { ...cv.reference, designation: e.target.value } })
                    }
                    className="px-3 py-2 bg-navy border border-white/10 rounded-xl text-white select-text"
                    placeholder="Designation / Institute"
                  />
                  <input
                    type="text"
                    value={cv.reference?.email || ''}
                    onChange={(e) =>
                      setCv({ ...cv, reference: { ...cv.reference, email: e.target.value } })
                    }
                    className="px-3 py-2 bg-navy border border-white/10 rounded-xl text-white select-text"
                    placeholder="Email Address"
                  />
                  <input
                    type="text"
                    value={cv.reference?.phone || ''}
                    onChange={(e) =>
                      setCv({ ...cv, reference: { ...cv.reference, phone: e.target.value } })
                    }
                    className="px-3 py-2 bg-navy border border-white/10 rounded-xl text-white select-text"
                    placeholder="Phone / Contact"
                  />
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-2 p-3.5 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-gray-300 font-bold">Spoken Languages</label>
                  <button
                    type="button"
                    onClick={() => handleAddListItem('languages', 'Language')}
                    className="px-2 py-0.5 bg-brandGreen/20 text-emerald-400 text-[10px] font-bold rounded-md"
                  >
                    + Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cv.languages.map((lang, idx) => (
                    <div key={idx} className="flex items-center space-x-1 bg-navy px-2.5 py-1 rounded-lg border border-white/10">
                      <input
                        type="text"
                        value={lang}
                        onChange={(e) => handleListChange('languages', idx, e.target.value)}
                        className="bg-transparent text-white text-xs w-20 focus:outline-none select-text"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveListItem('languages', idx)}
                        className="text-gray-500 hover:text-red-400"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 10: APPEARANCE & STYLING ── */}
          {activeStepIdx === 9 && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                <label className="block text-gray-300 font-bold flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-emerald-400" />
                  <span>Choose Template Layout ({CV_TEMPLATES.length} Designs)</span>
                </label>
                <p className="text-gray-400 text-[11px]">
                  You are currently using <strong>{activeTemplate.name}</strong> (T-{activeTemplate.number}).
                </p>
                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(true)}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-black font-black rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                >
                  <LayoutGrid className="w-4 h-4 text-black" />
                  <span>Open Interactive Template Gallery</span>
                </button>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2 text-gray-300">
                <span className="font-bold block text-white flex items-center space-x-1.5">
                  <Printer className="w-4 h-4 text-brandGreen" />
                  <span>Print & PDF Perfection</span>
                </span>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  The TaxMan's Capital print engine isolates purely the A4 paper. No navigation bars, no side panels, and no trailing empty pages are printed.
                </p>
              </div>
            </div>
          )}

          {/* ── STEP FORWARD / BACKWARD NAVIGATION FOOTER ── */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setActiveStepIdx((prev) => Math.max(0, prev - 1))}
              disabled={activeStepIdx === 0}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl font-bold flex items-center space-x-1.5 transition-all disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>

            <span className="text-[11px] font-bold text-gray-400">
              {activeStepIdx + 1} of {CV_STEPS.length}
            </span>

            {activeStepIdx < CV_STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setActiveStepIdx((prev) => Math.min(CV_STEPS.length - 1, prev + 1))}
                className="px-5 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl font-black flex items-center space-x-1.5 transition-all shadow-md shadow-brandGreen/25 cursor-pointer"
              >
                <span>Next: {CV_STEPS[activeStepIdx + 1].label}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-black font-black rounded-xl flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Export PDF / Print</span>
              </button>
            )}
          </div>

        </div>

        {/* ==================================================== */}
        {/* RIGHT COLUMN: STICKY LIVE A4 CV PREVIEW               */}
        {/* ==================================================== */}
        <div className={`xl:col-span-7 space-y-4 ${
          mobileViewTab === 'editor' ? 'hidden xl:block' : 'block'
        }`}>
          
          {/* Preview Control Header */}
          <div className="bg-[#021B3A] p-3.5 rounded-2xl border border-white/10 shadow-lg flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-black text-white uppercase text-[11px]">Live Reactive A4 Preview</span>
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-gray-300 text-[10px] font-bold">
                T-{activeTemplate.number} • {activeTemplate.name}
              </span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-1.5 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setPreviewZoom((z) => Math.max(0.75, Number((z - 0.1).toFixed(2))))}
                className="text-gray-400 hover:text-white p-1 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-bold text-white min-w-[36px] text-center">
                {Math.round(previewZoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setPreviewZoom((z) => Math.min(1.15, Number((z + 0.1).toFixed(2))))}
                className="text-gray-400 hover:text-white p-1 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Real-time A4 Paper Viewport Container */}
          <div className="bg-slate-950/70 p-3 sm:p-6 rounded-3xl border border-white/10 shadow-2xl overflow-x-auto flex justify-center scrollbar-thin">
            <div
              className="origin-top transition-transform duration-200 shadow-2xl bg-white text-black"
              style={{
                transform: `scale(${previewZoom})`,
                width: '794px',
                minHeight: '1123px'
              }}
            >
              <ActiveTemplateComponent cv={normalizedCV} />
            </div>
          </div>

        </div>

      </div>

      {/* ── ISOLATED PRINT PORTAL (RENDERED DIRECTLY IN BODY FOR CLEAN SINGLE-PAGE PRINTING) ── */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div id="cv-print-portal">
            <ActiveTemplateComponent cv={normalizedCV} />
          </div>,
          document.body
        )}

      {/* ── MULTI-TEMPLATE SELECTION MODAL ── */}
      <TemplateSelectorModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        selectedTemplateId={activeTemplateId}
        onSelectTemplate={(newId) => {
          setActiveTemplateId(newId);
          setIsTemplateModalOpen(false);
        }}
        cvData={normalizedCV}
      />

      {/* ── DUMMY AVATAR SELECTOR MODAL ── */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#021B3A] border border-white/20 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Select Professional Dummy Avatar</h3>
                <p className="text-xs text-gray-400">Choose a high-resolution placeholder portrait for your CV.</p>
              </div>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {DUMMY_AVATARS.map((avatar) => (
                <div
                  key={avatar.id}
                  onClick={() => handleSelectDummyAvatar(avatar.src)}
                  className="p-3 bg-white/5 hover:bg-brandGreen/20 border border-white/10 hover:border-brandGreen/40 rounded-2xl transition-all cursor-pointer text-center space-y-2 group"
                >
                  <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-white/20 group-hover:border-brandGreen shadow-md">
                    <img src={avatar.src} alt={avatar.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] font-bold text-white block leading-tight">{avatar.name}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
