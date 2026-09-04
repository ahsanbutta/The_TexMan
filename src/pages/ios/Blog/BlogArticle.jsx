import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Calendar,
  Clock,
  Eye,
  Tag,
  CheckCircle2,
  X
} from 'lucide-react';
import { renderRichContent } from '../../../components/blog/RichBlogEditor';

/**
 * BlogArticle – full-page, no-modal article reader.
 *
 * Props:
 *   blog          – the blog object to render (required)
 *   onBack        – callback to return to the blog list
 *   onNavigateTab – callback(tabName) to navigate to another tab (e.g. 'Counseling')
 */
export default function BlogArticle({ blog, onBack, onNavigateTab }) {
  const [copiedShare, setCopiedShare] = useState(false);
  const [bookmarked, setBookmarked] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('thetaxman_bookmarked_blogs') || '[]');
      return saved.includes(blog?._id || blog?.id);
    } catch {
      return false;
    }
  });

  if (!blog) return null;

  const blogId = blog._id || blog.id;

  const toggleBookmark = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('thetaxman_bookmarked_blogs') || '[]');
      const updated = bookmarked
        ? saved.filter((id) => id !== blogId)
        : [...saved, blogId];
      localStorage.setItem('thetaxman_bookmarked_blogs', JSON.stringify(updated));
      setBookmarked(!bookmarked);
    } catch (err) {
      console.warn('Bookmark error:', err);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/blog/${blog.slug || blogId}`;
    const text = `${blog.title} – Read on The TaxMan's Capital: ${url}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2500);
      });
    }
  };

  return (
    <div className="w-full bg-[#021B3A] text-white">
      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5 border-b border-white/10 bg-[#021B3A]/95 backdrop-blur-md">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleShare}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
            title="Share Article"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{copiedShare ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${bookmarked
                ? 'bg-brandGreen/20 border-brandGreen text-brandGreen'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
            title="Bookmark"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Article Body ── */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 space-y-7">
        {/* Category & Meta */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-400">
          <span className="px-3 py-1 bg-brandGreen text-white font-extrabold rounded-lg uppercase tracking-wider text-[11px]">
            {blog.category}
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-brandGreen" />
            <span>
              {new Date(blog.createdAt || Date.now()).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-brandGreen" />
            <span>{blog.readTime || '5 min read'}</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Eye className="w-3.5 h-3.5 text-brandGreen" />
            <span>{blog.views || 0} readers</span>
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight font-['Outfit',sans-serif]">
          {blog.title}
        </h1>

        {/* Author Bio */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-full bg-emerald-500/20 border border-brandGreen/40 flex items-center justify-center font-black text-sm text-brandGreen">
              {blog.author?.name ? blog.author.name.charAt(0) : 'S'}
            </div>
            <div>
              <h5 className="text-sm font-bold text-white">{blog.author?.name || 'Saboor Ahmad CA'}</h5>
              <p className="text-xs text-gray-400">{blog.author?.role || 'Founder & Lead Career Mentor'}</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center space-x-1 text-[11px] font-bold text-brandGreen bg-emerald-500/10 px-3 py-1 rounded-full border border-brandGreen/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>Verified Mentor Article</span>
          </span>
        </div>

        {/* Cover Image */}
        {blog.coverImage && (
          <div className="w-full h-64 sm:h-80 lg:h-[420px] rounded-2xl overflow-hidden bg-navy-dark shadow-xl">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Summary Lead */}
        <div className="p-4 sm:p-5 rounded-2xl bg-brandGreen/10 border-l-4 border-brandGreen text-sm sm:text-base text-gray-200 italic leading-relaxed">
          "{blog.summary}"
        </div>

        {/* Content Body */}
        <div className="font-normal text-gray-200">
          {renderRichContent(blog.content)}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="pt-6 border-t border-white/10">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
              <Tag className="w-3.5 h-3.5 text-brandGreen" />
              <span>Related Topic Tags:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 font-semibold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Mentorship CTA */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-brandGreen/30 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 mb-2">
          <div className="text-center sm:text-left">
            <h4 className="text-base font-bold text-white">Need Personalized Career Mentorship?</h4>
            <p className="text-xs text-gray-300 mt-1">
              Book a 1-on-1 counseling session, resume review, or mock interview with Saboor Ahmad CA.
            </p>
          </div>
          <button
            onClick={() => {
              onBack();
              if (onNavigateTab) onNavigateTab('Counseling');
            }}
            className="px-5 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap cursor-pointer"
          >
            Book Mentorship Session →
          </button>
        </div>
      </article>
    </div>
  );
}
