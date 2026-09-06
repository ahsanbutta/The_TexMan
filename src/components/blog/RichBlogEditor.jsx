import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  ExternalLink,
  Code,
  Minus,
  Eye,
  Edit3,
  Sparkles,
  X
} from 'lucide-react';

/**
 * Enhanced markdown/content parser for preview & rendering
 */
export function renderRichContent(content = '', theme = 'light') {
  const isLight = theme === 'light';

  if (!content) {
    return <p className={`italic text-sm ${isLight ? 'text-gray-400' : 'text-gray-400'}`}>No content yet...</p>;
  }

  // Parse inline tokens: [link](url), **bold**, *italic*, `code`
  const parseInline = (text) => {
    if (!text) return text;

    // Tokenize links: [label](url)
    const linkRegex = /\[(.*?)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const label = match[1] || match[2];
      const url = match[2];
      parts.push({ type: 'link', label, url });
      lastIndex = linkRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    // Process bold, italic, code for each text part
    return parts.map((part, pIdx) => {
      if (typeof part === 'object' && part.type === 'link') {
        return (
          <a
            key={pIdx}
            href={part.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`${isLight ? 'text-brandGreen hover:text-brandGreen-dark' : 'text-brandGreen hover:text-emerald-300'} underline underline-offset-4 font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer mx-0.5`}
          >
            <span>{part.label}</span>
            <ExternalLink className="w-3 h-3 inline-block opacity-75" />
          </a>
        );
      }

      // Plain string: parse **bold**, *italic*, `code`
      const raw = String(part);
      // Split on **bold**
      const boldSegments = raw.split(/\*\*(.*?)\*\*/g);
      return boldSegments.map((seg, sIdx) => {
        if (sIdx % 2 === 1) {
          return <strong key={`${pIdx}-${sIdx}`} className={`font-bold ${isLight ? 'text-navy' : 'text-white'}`}>{seg}</strong>;
        }
        // Split on *italic*
        const italicSegments = seg.split(/\*(.*?)\*/g);
        return italicSegments.map((it, iIdx) => {
          if (iIdx % 2 === 1) {
            return <em key={`${pIdx}-${sIdx}-${iIdx}`} className={`italic ${isLight ? 'text-gray-600' : 'text-gray-200'}`}>{it}</em>;
          }
          // Split on `code`
          const codeSegments = it.split(/`(.*?)`/g);
          return codeSegments.map((c, cIdx) => {
            if (cIdx % 2 === 1) {
              return (
                <code key={`${pIdx}-${sIdx}-${iIdx}-${cIdx}`} className={`px-1.5 py-0.5 rounded text-xs font-mono ${isLight ? 'bg-gray-100 text-brandGreen-dark border border-gray-200' : 'bg-black/40 text-emerald-300'}`}>
                  {c}
                </code>
              );
            }
            return c;
          });
        });
      });
    });
  };

  // Split into lines and parse blocks accurately
  const rawLines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let currentParagraph = [];
  let currentList = null; // { type: 'ul' | 'ol', items: [] }
  let currentQuote = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      blocks.push({
        type: 'p',
        text: currentParagraph.join(' ')
      });
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList) {
      blocks.push(currentList);
      currentList = null;
    }
  };

  const flushQuote = () => {
    if (currentQuote.length > 0) {
      blocks.push({
        type: 'quote',
        text: currentQuote.join('\n')
      });
      currentQuote = [];
    }
  };

  const flushAll = () => {
    flushParagraph();
    flushList();
    flushQuote();
  };

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushAll();
      continue;
    }

    // Heading 1 (# ...)
    if (trimmed.startsWith('# ') && !trimmed.startsWith('## ')) {
      flushAll();
      blocks.push({ type: 'h1', text: trimmed.replace(/^#\s+/, '') });
      continue;
    }

    // Heading 2 (## ...)
    if (trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
      flushAll();
      blocks.push({ type: 'h2', text: trimmed.replace(/^##\s+/, '') });
      continue;
    }

    // Heading 3 (### ...)
    if (trimmed.startsWith('### ')) {
      flushAll();
      blocks.push({ type: 'h3', text: trimmed.replace(/^###\s+/, '') });
      continue;
    }

    // Divider
    if (trimmed === '---' || trimmed === '***') {
      flushAll();
      blocks.push({ type: 'hr' });
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      flushParagraph();
      flushList();
      currentQuote.push(trimmed.replace(/^>\s?/, ''));
      continue;
    }

    // Bullet list
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      flushParagraph();
      flushQuote();
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(trimmed.replace(/^[-*]\s+/, ''));
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(trimmed)) {
      flushParagraph();
      flushQuote();
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(trimmed.replace(/^\d+\.\s+/, ''));
      continue;
    }

    // Regular paragraph line
    flushList();
    flushQuote();
    currentParagraph.push(trimmed);
  }

  flushAll();

  return (
    <div className={`space-y-4 text-sm sm:text-base leading-relaxed font-normal ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
      {blocks.map((block, idx) => {
        if (block.type === 'h1') {
          return (
            <h1 key={idx} className={`text-2xl sm:text-3xl font-black pt-6 pb-2 border-b font-['Outfit',sans-serif] ${isLight ? 'text-navy border-gray-100' : 'text-white border-white/10'}`}>
              {parseInline(block.text)}
            </h1>
          );
        }
        if (block.type === 'h2') {
          return (
            <h2 key={idx} className={`text-xl sm:text-2xl font-extrabold pt-5 pb-1 border-b font-['Outfit',sans-serif] ${isLight ? 'text-navy border-gray-100' : 'text-white border-white/10'}`}>
              {parseInline(block.text)}
            </h2>
          );
        }
        if (block.type === 'h3') {
          return (
            <h3 key={idx} className="text-base sm:text-lg font-bold text-brandGreen pt-4 pb-0.5 font-['Outfit',sans-serif]">
              {parseInline(block.text)}
            </h3>
          );
        }
        if (block.type === 'hr') {
          return <hr key={idx} className={`my-6 ${isLight ? 'border-gray-200' : 'border-white/10'}`} />;
        }
        if (block.type === 'quote') {
          return (
            <div key={idx} className={`p-4 sm:p-5 rounded-2xl border-l-4 border-brandGreen italic my-3 ${isLight ? 'bg-emerald-50/70 text-gray-700' : 'bg-brandGreen/10 text-gray-200'}`}>
              {parseInline(block.text)}
            </div>
          );
        }
        if (block.type === 'ul') {
          return (
            <ul key={idx} className={`list-disc pl-6 space-y-1.5 my-2 ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
              {block.items.map((item, iIdx) => (
                <li key={iIdx} className="leading-relaxed font-normal">{parseInline(item)}</li>
              ))}
            </ul>
          );
        }
        if (block.type === 'ol') {
          return (
            <ol key={idx} className={`list-decimal pl-6 space-y-2 my-2 ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
              {block.items.map((item, iIdx) => (
                <li key={iIdx} className="leading-relaxed font-normal">{parseInline(item)}</li>
              ))}
            </ol>
          );
        }
        if (block.type === 'p') {
          return (
            <p key={idx} className={`leading-relaxed font-normal ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
              {parseInline(block.text)}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
}

export default function RichBlogEditor({ value = '', onChange, onReadTimeChange }) {
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const textareaRef = useRef(null);

  // Calculate word count & estimated read time
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const estimatedMins = Math.max(1, Math.ceil(wordCount / 200));

  // Insert or wrap text in textarea
  const insertText = (before, after = '', defaultPlaceholder = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    const textToWrap = selected || defaultPlaceholder;

    const newText = textarea.value.substring(0, start) + before + textToWrap + after + textarea.value.substring(end);
    onChange(newText);

    if (onReadTimeChange) {
      const words = newText.trim().split(/\s+/).length;
      onReadTimeChange(`${Math.max(1, Math.ceil(words / 200))} min read`);
    }

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + textToWrap.length
      );
    }, 10);
  };

  // Open Link Dialog with current selection prefilled
  const handleOpenLinkDialog = () => {
    const textarea = textareaRef.current;
    const selected = textarea ? textarea.value.substring(textarea.selectionStart, textarea.selectionEnd) : '';
    setLinkText(selected || '');
    setLinkUrl('');
    setLinkModalOpen(true);
  };

  const handleApplyLink = (e) => {
    e.preventDefault();
    if (!linkUrl) return;

    const validUrl = linkUrl.startsWith('http://') || linkUrl.startsWith('https://') || linkUrl.startsWith('/')
      ? linkUrl
      : `https://${linkUrl}`;
    const label = linkText.trim() || validUrl;
    const markdownLink = `[${label}](${validUrl})`;

    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = textarea.value.substring(0, start) + markdownLink + textarea.value.substring(end);
      onChange(newText);
    } else {
      onChange(value + (value ? ' ' : '') + markdownLink);
    }

    setLinkModalOpen(false);
    setLinkText('');
    setLinkUrl('');
  };

  // Quick insertion templates
  const handleInsertTemplate = (type) => {
    let template = '';
    if (type === 'resources') {
      template = `\n\n## Official Resources & Reference Links\n- [ICAP Official Portal](https://icap.org.pk) - Trainee inductions & examination syllabus\n- [PwC Pakistan Careers](https://www.pwc.com.pk) - Articleship recruitment dates\n- [KPMG Pakistan Insights](https://home.kpmg/pk) - Advisory & audit positions\n- [The TaxMan's Capital Mentorship](/career-tools) - Interview prep & mock sessions\n`;
    } else if (type === 'callout') {
      template = `\n\n> **Expert Mentor Tip:** Always verify eligibility criteria directly on the firm's recruitment portal before submitting your application.\n`;
    } else if (type === 'steps') {
      template = `\n\n## Action Plan & Roadmap\n1. Review all conceptual foundations and past paper summaries.\n2. Apply with ATS-optimized resume emphasizing your first-attempt achievements.\n3. Complete mock interviews focused on technical IFRS and behavioral questions.\n`;
    }
    onChange(value + template);
  };

  return (
    <div className="flex flex-col border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#071326] shadow-sm">
      {/* ── Top Bar: Mode Switcher & Stats ── */}
      <div className="flex flex-wrap items-center justify-between px-3.5 py-2.5 bg-gray-50 dark:bg-white/[0.03] border-b border-gray-200 dark:border-white/10 gap-2">
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'write'
                ? 'bg-brandGreen text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-white/10'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Write (WordPress Editor)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-brandGreen text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-white/10'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Article Preview</span>
          </button>
        </div>

        {/* Word count & Read time badge */}
        <div className="flex items-center space-x-3 text-[11px] text-gray-500 dark:text-gray-400 font-medium">
          <span>{wordCount} words</span>
          <span>•</span>
          <span className="text-brandGreen font-bold">{estimatedMins} min read</span>
        </div>
      </div>

      {/* ── Formatting Toolbar (Active in Write Mode) ── */}
      {activeTab === 'write' && (
        <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-100/70 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/10">
          {/* Headings */}
          <div className="flex items-center space-x-0.5 pr-2 border-r border-gray-300 dark:border-white/10">
            <button
              type="button"
              onClick={() => insertText('\n\n# ', '\n', 'Heading 1 Title')}
              title="Heading 1 (H1)"
              className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('\n\n## ', '\n', 'Heading 2 Title')}
              title="Heading 2 (H2)"
              className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('\n\n### ', '\n', 'Heading 3 Title')}
              title="Heading 3 (H3)"
              className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Heading3 className="w-4 h-4" />
            </button>
          </div>

          {/* Styling */}
          <div className="flex items-center space-x-0.5 px-2 border-r border-gray-300 dark:border-white/10">
            <button
              type="button"
              onClick={() => insertText('**', '**', 'bold text')}
              title="Bold (**text**)"
              className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Bold className="w-4 h-4 font-bold" />
            </button>
            <button
              type="button"
              onClick={() => insertText('*', '*', 'italic text')}
              title="Italic (*text*)"
              className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('~~', '~~', 'strikethrough')}
              title="Strikethrough"
              className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('`', '`', 'code')}
              title="Inline Code"
              className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Code className="w-4 h-4" />
            </button>
          </div>

          {/* Link Tool (WordPress style hyperlink) */}
          <div className="flex items-center space-x-0.5 px-2 border-r border-gray-300 dark:border-white/10">
            <button
              type="button"
              onClick={handleOpenLinkDialog}
              title="Insert Clickable Hyperlink [text](url)"
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-brandGreen text-brandGreen hover:text-white border border-brandGreen/30 text-xs font-bold transition-all cursor-pointer"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Insert Link</span>
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center space-x-0.5 px-2 border-r border-gray-300 dark:border-white/10">
            <button
              type="button"
              onClick={() => insertText('\n- ', '', 'Bullet list item')}
              title="Bullet List"
              className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('\n1. ', '', 'Numbered list item')}
              title="Numbered List"
              className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

          {/* Quote & Divider */}
          <div className="flex items-center space-x-0.5 px-2 border-r border-gray-300 dark:border-white/10">
            <button
              type="button"
              onClick={() => insertText('\n> ', '', 'Important note or quote here...')}
              title="Blockquote / Callout"
              className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('\n\n---\n\n', '', '')}
              title="Horizontal Divider"
              className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Insert Dropdown / Presets */}
          <div className="flex items-center space-x-1.5 pl-2 ml-auto">
            <span className="text-[10px] text-gray-400 font-semibold hidden sm:inline">Templates:</span>
            <button
              type="button"
              onClick={() => handleInsertTemplate('callout')}
              className="px-2 py-0.5 rounded-md bg-gray-200 dark:bg-white/5 hover:bg-brandGreen/20 text-[10px] font-bold text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              + Tip Callout
            </button>
            <button
              type="button"
              onClick={() => handleInsertTemplate('resources')}
              className="px-2 py-0.5 rounded-md bg-gray-200 dark:bg-white/5 hover:bg-brandGreen/20 text-[10px] font-bold text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              + Resource Links
            </button>
          </div>
        </div>
      )}

      {/* ── Main Canvas ── */}
      <div className="relative min-h-[360px] max-h-[500px] overflow-y-auto">
        {activeTab === 'write' ? (
          <textarea
            ref={textareaRef}
            rows={14}
            required
            placeholder="Write your blog post here... Use the toolbar above to add Headings, Hyperlinks [text](url), Quotes, Lists, and Bold text."
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              if (onReadTimeChange) {
                const words = e.target.value.trim().split(/\s+/).length;
                onReadTimeChange(`${Math.max(1, Math.ceil(words / 200))} min read`);
              }
            }}
            className="w-full h-full p-4 font-mono text-xs sm:text-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-[#071326] focus:outline-none resize-none leading-relaxed"
          />
        ) : (
          <div className="p-6 bg-white text-gray-800 min-h-[360px] rounded-b-2xl border-t border-gray-100">
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 text-xs text-gray-500">
                <span className="flex items-center space-x-1.5 text-brandGreen font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive Public View Preview</span>
                </span>
                <span>Links are clickable in preview</span>
              </div>
              {renderRichContent(value, 'light')}
            </div>
          </div>
        )}
      </div>

      {/* ── WordPress-style Link Dialog Modal ── */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-[#091528] rounded-2xl p-5 border border-gray-200 dark:border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <h4 className="text-sm font-black text-gray-900 dark:text-white flex items-center space-x-2">
                <LinkIcon className="w-4 h-4 text-brandGreen" />
                <span>Insert Hyperlink</span>
              </h4>
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplyLink} className="space-y-3.5 text-xs">
              <div className="flex flex-col space-y-1">
                <label className="font-bold text-gray-700 dark:text-gray-300">Display Text (Anchor)</label>
                <input
                  type="text"
                  placeholder="e.g. ICAP Official Exam Guidelines"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="p-2.5 border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-brandGreen"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-bold text-gray-700 dark:text-gray-300">Target Web URL *</label>
                <input
                  type="text"
                  required
                  placeholder="https://icap.org.pk or /career-tools"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="p-2.5 border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-brandGreen font-mono"
                />
              </div>

              <div className="p-3 bg-brandGreen/10 border border-brandGreen/20 rounded-xl text-[11px] text-gray-600 dark:text-gray-300 space-y-1">
                <p className="font-bold text-brandGreen flex items-center space-x-1">
                  <ExternalLink className="w-3 h-3" />
                  <span>WordPress-style Link Handling:</span>
                </p>
                <p>This will be rendered as a clickable link that opens safely in a new browser tab with external link indicators.</p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setLinkModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brandGreen hover:bg-brandGreen-dark text-white font-black shadow-md cursor-pointer"
                >
                  Add Hyperlink
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
