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
    <div className="w-full bg-bgLight min-h-screen pb-16">
      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5 border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-xs">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-navy hover:text-brandGreen text-xs font-bold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleShare}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold text-navy hover:text-brandGreen transition-colors cursor-pointer"
            title="Share Article"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{copiedShare ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${bookmarked
                ? 'bg-brandGreen/10 border-brandGreen text-brandGreen'
                : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-navy'
              }`}
            title="Bookmark"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Article Body ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <article className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 lg:p-12 space-y-7">
          {/* Category & Meta */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-500">
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
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy leading-tight font-['Outfit',sans-serif]">
            {blog.title}
          </h1>

          {/* Author Bio */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-full bg-emerald-100 border border-brandGreen/30 flex items-center justify-center font-black text-sm text-brandGreen-dark">
                {blog.author?.name ? blog.author.name.charAt(0) : 'S'}
              </div>
              <div>
                <h5 className="text-sm font-bold text-navy">{blog.author?.name || 'Saboor Ahmad CA'}</h5>
                <p className="text-xs text-gray-500">{blog.author?.role || 'Founder & Lead Career Mentor'}</p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center space-x-1 text-[11px] font-bold text-brandGreen bg-emerald-50 px-3 py-1 rounded-full border border-brandGreen/20">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified Mentor Article</span>
            </span>
          </div>

          {/* Cover Image */}
          {blog.coverImage && (
            <div className="w-full h-64 sm:h-80 lg:h-[420px] rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-md">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Summary Lead */}
          <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50/70 border-l-4 border-brandGreen text-sm sm:text-base text-gray-700 italic leading-relaxed">
            "{blog.summary}"
          </div>

          {/* Content Body */}
          <div className="font-normal text-gray-700">
            {renderRichContent(blog.content, 'light')}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="pt-6 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5 text-brandGreen" />
                <span>Related Topic Tags:</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-gray-50 border border-gray-200 text-xs text-navy font-semibold hover:border-brandGreen hover:text-brandGreen transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Mentorship CTA */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-navy to-[#052347] text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <div className="text-center sm:text-left">
              <h4 className="text-base sm:text-lg font-bold text-white">Need Personalized Career Mentorship?</h4>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
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
    </div>
  );
}
