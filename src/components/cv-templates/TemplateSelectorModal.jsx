import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  CV_TEMPLATES, 
  TEMPLATE_CATEGORIES, 
  getRecommendedTemplate, 
  getRandomTemplate 
} from './templateRegistry';
import { normalizeCVData, DEFAULT_CV_DATA } from './cvDataModel';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Shuffle, 
  X, 
  Check, 
  ArrowRight,
  Filter,
  Layers,
  RefreshCw
} from 'lucide-react';

/**
 * Robust Error Boundary to isolate individual template preview failures
 */
class TemplateErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMsg: error?.message || 'Rendering error' };
  }

  componentDidCatch(error, errorInfo) {
    console.warn(`Template [${this.props.templateId}] render error:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-300 p-4 text-center select-none">
          <span className="text-xl mb-1">⚠️</span>
          <p className="text-xs font-bold text-amber-400">Preview Unavailable</p>
          <p className="text-[10px] text-zinc-500 line-clamp-2 mt-0.5">{this.state.errorMsg}</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-semibold transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Real scaled miniature CV preview component
 */
function TemplateRealMiniaturePreview({ template, cvData }) {
  const Component = template.component;
  if (!Component) return null;

  return (
    <TemplateErrorBoundary templateId={template.id}>
      <div className="w-full h-[370px] overflow-hidden relative bg-slate-900/60 select-none pointer-events-none flex justify-center border-b border-white/10">
        <div
          className="absolute top-0 origin-top bg-white shadow-lg"
          style={{
            width: '794px',
            minHeight: '1123px',
            transform: 'scale(0.35)',
            transformOrigin: 'top center'
          }}
        >
          <Component cv={cvData} />
        </div>
      </div>
    </TemplateErrorBoundary>
  );
}

/**
 * Canva-Style Multi-Template Selector Modal with 47 Professional Templates
 * Uses React Portal to mount directly into document.body, eliminating parent layout/animation clipping
 */
export default function TemplateSelectorModal({
  isOpen,
  onClose,
  selectedTemplateId,
  onSelectTemplate,
  cvData
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [atsOnly, setAtsOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(16); // Progressive loading initial batch
  const scrollContainerRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Safe normalized CV data for live rendering in miniatures
  const safeCV = useMemo(() => {
    return normalizeCVData(cvData || DEFAULT_CV_DATA);
  }, [cvData]);

  // Recommended template calculation
  const recommended = useMemo(() => {
    return getRecommendedTemplate(safeCV);
  }, [safeCV]);

  // Filter & Search Logic across 47 templates
  const filteredTemplates = useMemo(() => {
    return CV_TEMPLATES.filter(tpl => {
      // ATS Filter
      if (atsOnly && !tpl.isATSFriendly) return false;

      // Category Filter
      if (selectedCategory !== 'All') {
        const matchesMain = tpl.category === selectedCategory;
        const matchesSecondary = tpl.secondaryCategories?.includes(selectedCategory);
        if (!matchesMain && !matchesSecondary) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = tpl.name.toLowerCase().includes(q);
        const catMatch = tpl.category.toLowerCase().includes(q);
        const descMatch = tpl.description.toLowerCase().includes(q);
        const numMatch = tpl.number.includes(q);
        const recMatch = tpl.recommendedFor?.some(r => r.toLowerCase().includes(q));

        if (!nameMatch && !catMatch && !descMatch && !numMatch && !recMatch) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, atsOnly]);

  // Progressive scroll handler
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 400) {
      setVisibleCount(prev => Math.min(prev + 12, filteredTemplates.length));
    }
  };

  // Reset visible count and scroll to top when filter or modal state changes
  useEffect(() => {
    setVisibleCount(16);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [searchQuery, selectedCategory, atsOnly, isOpen]);

  // Keyboard shortcut ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Manage body overflow safely without locking permanently
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  // Surprise Me Handler
  const handleSurpriseMe = () => {
    const randomTpl = getRandomTemplate(selectedTemplateId);
    if (randomTpl) {
      onSelectTemplate(randomTpl.id);
      onClose();
    }
  };

  // Recommended Handler
  const handleSelectRecommended = () => {
    if (recommended) {
      onSelectTemplate(recommended.id);
      onClose();
    }
  };

  const displayedTemplates = filteredTemplates.slice(0, visibleCount);

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* ── MODAL CONTAINER ── */}
      <div className="relative w-full max-w-7xl h-[94vh] max-h-[94vh] bg-[#02142B] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        
        {/* ── MODAL HEADER ── */}
        <div className="p-4 sm:px-6 bg-[#021B3A] border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-brandGreen/20 text-brandGreen">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                    Choose Your CV Template
                  </h2>
                  <span className="px-2 py-0.5 bg-brandGreen/20 text-brandGreen border border-brandGreen/30 rounded-full text-[11px] font-bold">
                    {CV_TEMPLATES.length} Templates
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Pick from 47 genuine Canva-style professional templates. Your data is preserved automatically.
                </p>
              </div>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center space-x-2.5 flex-wrap">
            {/* Recommended Button */}
            {recommended && (
              <button
                type="button"
                onClick={handleSelectRecommended}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
                title={`Recommended for your profile: ${recommended.name}`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Recommended ({recommended.number})</span>
              </button>
            )}

            {/* Surprise Me Button */}
            <button
              type="button"
              onClick={handleSurpriseMe}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
              title="Switch to a random professional design"
            >
              <Shuffle className="w-3.5 h-3.5 text-indigo-400" />
              <span>Surprise Me</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── CONTROLS & FILTERS BAR ── */}
        <div className="p-4 sm:px-6 bg-[#021B3A]/90 border-b border-white/10 space-y-3 flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates, roles, or styles..."
                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-brandGreen transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* ATS Friendly Filter Toggle */}
            <button
              type="button"
              onClick={() => setAtsOnly(prev => !prev)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 border transition-all cursor-pointer ${
                atsOnly
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ATS Friendly Only</span>
              {atsOnly && <Check className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {TEMPLATE_CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-brandGreen text-black shadow-md'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── TEMPLATES SCROLLABLE GALLERY ── */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 sm:p-6"
        >
          {filteredTemplates.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <Filter className="w-10 h-10 text-gray-500 mb-2" />
              <h3 className="text-sm font-bold text-gray-300">No templates match your filters</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">
                Try clearing your search query or selecting "All" categories to view all {CV_TEMPLATES.length} templates.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setAtsOnly(false);
                }}
                className="mt-3 px-4 py-1.5 bg-brandGreen text-black font-bold text-xs rounded-xl cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedTemplates.map(tpl => {
                const isSelected = tpl.id === selectedTemplateId;
                const isRec = recommended?.id === tpl.id;

                return (
                  <div
                    key={tpl.id}
                    className={`group relative rounded-2xl overflow-hidden border transition-all flex flex-col justify-between bg-white/5 hover:bg-white/10 ${
                      isSelected
                        ? 'border-brandGreen ring-2 ring-brandGreen/50 shadow-[0_0_25px_rgba(0,200,83,0.25)]'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    {/* Active Template Badge */}
                    {isSelected && (
                      <div className="absolute top-2 left-2 z-20 px-2.5 py-1 bg-brandGreen text-black rounded-lg text-[10px] font-black uppercase flex items-center space-x-1 shadow-lg">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Active Template</span>
                      </div>
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-2 right-2 z-20 flex items-center space-x-1">
                      {tpl.isATSFriendly && (
                        <span className="px-2 py-0.5 bg-emerald-500/90 text-white rounded-md text-[9px] font-extrabold flex items-center space-x-1 shadow-xs">
                          <ShieldCheck className="w-3 h-3" />
                          <span>ATS</span>
                        </span>
                      )}
                      {isRec && (
                        <span className="px-2 py-0.5 bg-amber-500/95 text-black rounded-md text-[9px] font-black flex items-center space-x-0.5 shadow-xs">
                          <Sparkles className="w-3 h-3" />
                          <span>Match</span>
                        </span>
                      )}
                    </div>

                    {/* REAL MINIATURE CV PREVIEW */}
                    <TemplateRealMiniaturePreview template={tpl} cvData={safeCV} />

                    {/* Template Card Details & Action */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between bg-[#021731]/95">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-gray-400">
                            T-{tpl.number}
                          </span>
                          <span className="text-[10px] font-semibold text-brandGreen">
                            {tpl.category}
                          </span>
                        </div>

                        <h3 className="text-sm font-extrabold text-white mt-0.5 line-clamp-1 group-hover:text-brandGreen transition-colors">
                          {tpl.name}
                        </h3>

                        <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                          {tpl.description}
                        </p>
                      </div>

                      {/* Action Button */}
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTemplate(tpl.id);
                          onClose();
                        }}
                        className={`w-full py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-brandGreen text-black shadow-[0_0_15px_rgba(0,200,83,0.3)]'
                            : 'bg-white/10 text-white hover:bg-brandGreen hover:text-black'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-4 h-4 stroke-[2.5]" />
                            <span>Current Design</span>
                          </>
                        ) : (
                          <>
                            <span>Use Template</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Loading indicator when progressive scrolling */}
          {visibleCount < filteredTemplates.length && (
            <div className="py-6 flex justify-center items-center text-xs text-gray-400 space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin text-brandGreen" />
              <span>Scroll down to see more templates ({visibleCount} of {filteredTemplates.length} loaded)...</span>
            </div>
          )}
        </div>

        {/* ── MODAL FOOTER ── */}
        <div className="p-3.5 sm:px-6 bg-[#011126] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-brandGreen"></span>
            <span>All 47 templates auto-sync your data instantly without data loss.</span>
          </div>

          <div className="text-[11px] text-gray-400">
            Showing <strong className="text-white">{Math.min(visibleCount, filteredTemplates.length)}</strong> of <strong className="text-white">{filteredTemplates.length}</strong> available templates
          </div>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
