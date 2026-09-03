import { useState, useRef, useEffect } from 'react';
import {
  Send,
  BookOpen,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  PlusCircle,
  HelpCircle,
  Lightbulb,
  FileText,
  Calculator,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Layers,
  GraduationCap,
  MessageSquare,
  Volume2,
  VolumeX,
  Zap,
  Trash2
} from 'lucide-react';
import { api } from '../../services/api';

const PAPERS = [
  { id: 'CAF-1', name: 'CAF-1: Financial Accounting & Reporting I', group: 'ICAP CAF' },
  { id: 'CAF-2', name: 'CAF-2: Tax Practices (Income Tax & Sales Tax)', group: 'ICAP CAF' },
  { id: 'CAF-3', name: 'CAF-3: Cost & Management Accounting', group: 'ICAP CAF' },
  { id: 'CAF-4', name: 'CAF-4: Business Law (Companies Act 2017)', group: 'ICAP CAF' },
  { id: 'CAF-5', name: 'CAF-5: Financial Accounting & Reporting II', group: 'ICAP CAF' },
  { id: 'CAF-6', name: 'CAF-6: Managerial & Financial Analysis (MFA)', group: 'ICAP CAF' },
  { id: 'CAF-7', name: 'CAF-7: Company Law', group: 'ICAP CAF' },
  { id: 'CAF-8', name: 'CAF-8: Audit & Assurance (ISA)', group: 'ICAP CAF' },
  { id: 'CFAP-1', name: 'CFAP-1: Advanced Accounting & Financial Reporting', group: 'ICAP CFAP' },
  { id: 'CFAP-2', name: 'CFAP-2: Advanced Corporate Laws & Practices', group: 'ICAP CFAP' },
  { id: 'CFAP-3', name: 'CFAP-3: Strategy & Performance Measurement', group: 'ICAP CFAP' },
  { id: 'CFAP-4', name: 'CFAP-4: Business Finance Decisions', group: 'ICAP CFAP' },
  { id: 'CFAP-5', name: 'CFAP-5: Tax Planning & Practices', group: 'ICAP CFAP' },
  { id: 'CFAP-6', name: 'CFAP-6: Audit, Assurance & Related Services', group: 'ICAP CFAP' },
  { id: 'ACCA-FA', name: 'ACCA Financial Accounting (FA / F3)', group: 'ACCA' },
  { id: 'ACCA-PM', name: 'ACCA Performance Management (PM / F5)', group: 'ACCA' },
  { id: 'ACCA-TX', name: 'ACCA Taxation (TX / F6)', group: 'ACCA' },
  { id: 'ACCA-FR', name: 'ACCA Financial Reporting (FR / F7)', group: 'ACCA' },
  { id: 'ACCA-AA', name: 'ACCA Audit and Assurance (AA / F8)', group: 'ACCA' },
  { id: 'ACCA-FM', name: 'ACCA Financial Management (FM / F9)', group: 'ACCA' },
  { id: 'ACCA-SBR', name: 'ACCA Strategic Business Reporting (SBR)', group: 'ACCA Professional' },
  { id: 'ACCA-SBL', name: 'ACCA Strategic Business Leader (SBL)', group: 'ACCA Professional' },
  { id: 'ACCA-AFM', name: 'ACCA Advanced Financial Management (AFM)', group: 'ACCA Professional' },
  { id: 'ACCA-AAA', name: 'ACCA Advanced Audit and Assurance (AAA)', group: 'ACCA Professional' }
];

const SUGGESTIONS = [
  {
    category: 'Financial Reporting',
    icon: <FileText className="w-4 h-4 text-emerald-400" />,
    prompts: [
      'What is IAS 16 Cost vs Revaluation Model?',
      'Explain IFRS 15 5-Step Model with an example',
      'What is the difference between IAS 37 provision and contingent liability?'
    ]
  },
  {
    category: 'Audit & Assurance',
    icon: <CheckCircle2 className="w-4 h-4 text-blue-400" />,
    prompts: [
      'What are the audit assertions for revenue and sales?',
      'Explain Audit Risk Model and ISA 315 formula',
      'Give me 5 MCQs on ISA 330 substantive procedures'
    ]
  },
  {
    category: 'Calculations & Numericals',
    icon: <Calculator className="w-4 h-4 text-purple-400" />,
    prompts: [
      'Calculate reducing balance depreciation schedule for Rs. 1,000,000 asset',
      'How do I calculate Weighted Average Cost of Capital (WACC)?',
      'Explain salary tax slabs calculation under Pakistan Income Tax Ordinance 2001'
    ]
  },
  {
    category: 'Exam Prep & Urdu Guides',
    icon: <Lightbulb className="w-4 h-4 text-amber-400" />,
    prompts: [
      'Explain IAS 16 depreciation in simple Roman Urdu',
      'Quiz me with 5 MCQs on audit and test my answers',
      'Give me the standard journal entry for IFRS 16 lease liability'
    ]
  }
];

export default function StudyTutorChat() {
  const [selectedSubject, setSelectedSubject] = useState(PAPERS[0].name);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('taxman_ai_study_chat');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTypingStream, setIsTypingStream] = useState(false);
  const [activeStreamingMessageId, setActiveStreamingMessageId] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [activeStudyMode, setActiveStudyMode] = useState('normal');
  const [isSpeakingId, setIsSpeakingId] = useState(null);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const streamTimerRef = useRef(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('taxman_ai_study_chat', JSON.stringify(messages));
    } catch {
      // Storage quota safety
    }
  }, [messages]);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isTypingStream]);

  // Adjust textarea height dynamically
  const handleInputChange = (e) => {
    setInputQuery(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  };

  // Typewriter streaming effect for ChatGPT realism
  const streamAiResponse = (fullText, messageId) => {
    setIsTypingStream(true);
    setActiveStreamingMessageId(messageId);

    const words = fullText.split(' ');
    let currentWordIdx = 0;

    if (streamTimerRef.current) clearInterval(streamTimerRef.current);

    streamTimerRef.current = setInterval(() => {
      currentWordIdx += 2; // Fast, smooth streaming
      if (currentWordIdx >= words.length) {
        clearInterval(streamTimerRef.current);
        setIsTypingStream(false);
        setActiveStreamingMessageId(null);
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, displayedText: fullText, isComplete: true } : m))
        );
      } else {
        const partial = words.slice(0, currentWordIdx).join(' ');
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, displayedText: partial, isComplete: false } : m))
        );
      }
    }, 28);
  };

  // Send message to AI Tutor API
  const handleSendMessage = async (queryText = null, customMode = null) => {
    const rawText = queryText !== null ? queryText : inputQuery;
    const textToSend = (rawText || '').trim();
    if (!textToSend || isLoading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputQuery('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsLoading(true);

    try {
      const response = await api.post('/ai/study-tutor', {
        subject: selectedSubject,
        query: textToSend,
        mode: customMode || activeStudyMode,
        history: newMessages.slice(-6).map((m) => ({ sender: m.sender, text: m.text }))
      });

      const replyText =
        response?.data?.reply ||
        response?.data?.data?.reply ||
        "I'm here to help! Could you please elaborate on your question?";

      const aiMsgId = Date.now() + 1;
      const aiMsg = {
        id: aiMsgId,
        sender: 'tutor',
        text: replyText,
        displayedText: '',
        isComplete: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followUps: generateDynamicFollowUps(textToSend, replyText)
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
      streamAiResponse(replyText, aiMsgId);
    } catch (err) {
      console.error('Failed to get AI Tutor response:', err);
      const fallbackReply = generateClientFallback(textToSend, selectedSubject);
      const fallbackId = Date.now() + 1;
      const fallbackAiMsg = {
        id: fallbackId,
        sender: 'tutor',
        text: fallbackReply,
        displayedText: '',
        isComplete: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followUps: ['Explain this in simpler words', 'Give me a practice question', 'Test me with MCQs']
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
      setIsLoading(false);
      streamAiResponse(fallbackReply, fallbackId);
    }
  };

  // Keydown handler: Enter sends, Shift+Enter adds newline
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Copy AI response to clipboard
  const handleCopyText = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // Text-to-Speech Web Audio Voice
  const handleSpeakText = (msgId, text) => {
    if (!window.speechSynthesis) return;

    if (isSpeakingId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[#*`_$\-|]/g, ' ').replace(/\s+/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeakingId(null);
    utterance.onerror = () => setIsSpeakingId(null);
    window.speechSynthesis.speak(utterance);
    setIsSpeakingId(msgId);
  };

  // Reset conversation
  const handleNewChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    setIsTypingStream(false);
    setActiveStreamingMessageId(null);
    setMessages([]);
    setInputQuery('');
    localStorage.removeItem('taxman_ai_study_chat');
  };

  // Generate dynamic follow-up chips
  function generateDynamicFollowUps(userQuery, aiReply) {
    const q = (userQuery + ' ' + aiReply).toLowerCase();
    if (q.includes('mcq') || q.includes('quiz')) {
      return ['Check my answers', 'Give me 5 more difficult MCQs', 'Explain the hardest question'];
    }
    if (q.includes('ias 16') || q.includes('depreciation')) {
      return ['Give me a numerical example', 'Explain Revaluation Model journal entry', 'Explain in Roman Urdu'];
    }
    if (q.includes('audit') || q.includes('assertion') || q.includes('isa')) {
      return ['Give me 5 audit MCQs', 'Explain substantive audit procedures for this', 'What is the partner exam tip?'];
    }
    if (q.includes('tax') || q.includes('salary')) {
      return ['Calculate tax for Rs. 2,500,000 salary', 'Explain withholding tax rules', 'Give me an exam question'];
    }
    return [
      'Give me a practical example',
      'Explain this like I am a beginner',
      'Test me on this with 3 questions'
    ];
  }

  // Client-side instant fallback engine if network drops
  function generateClientFallback(query, subject) {
    const q = query.toLowerCase();
    if (q.includes('ias 16') || q.includes('depreciation')) {
      return `### 💡 IAS 16: Property, Plant and Equipment

**1. Core Principle:**
Tangible items held for use in production or supply of goods/services expected to be used during more than one period.

**2. Measurement Models:**
- **Cost Model:** $\\text{Cost} - \\text{Accumulated Depreciation} - \\text{Impairment}$
- **Revaluation Model:** Carried at fair value at date of revaluation less subsequent depreciation.

**3. Depreciation Rule:**
Depreciation begins when the asset is **available for use** (i.e. in the location and condition necessary for it to be capable of operating in the manner intended by management).

---
💡 **Next Step:** Ask me to *calculate a numerical schedule* or *show journal entries*!`;
    }

    if (q.includes('audit risk') || q.includes('isa 315')) {
      return `### 🔍 Audit Risk Model (ISA 200 & 315)

$$\\text{Audit Risk} = \\text{Inherent Risk (IR)} \\times \\text{Control Risk (CR)} \\times \\text{Detection Risk (DR)}$$

- **Inherent Risk:** Susceptibility of an assertion to material misstatement before consideration of any related controls.
- **Control Risk:** Risk that a misstatement will not be prevented, or detected and corrected on a timely basis by the entity's internal control.
- **Detection Risk:** Risk that the auditor's substantive procedures will fail to detect a misstatement that exists.`;
    }

    return `### 📚 CA & ACCA Study Assistance: ${subject}

Regarding your question: **"${query}"**

1. **Standard Guidance:** Review the fundamental recognition and measurement criteria under the applicable IFRS / ISA standard.
2. **Exam Technique:** Always state the relevant standard definition, perform the step-by-step mathematical calculation or audit procedure, and conclude with the required disclosure.

Feel free to ask for a **numerical example**, **exam tip**, or **MCQs**!`;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT SIDEBAR: Subject Context & Study Modes */}
      <div className="lg:col-span-4 bg-navy-dark p-6 rounded-3xl border border-white/10 space-y-6 flex flex-col justify-between">
        <div className="space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-brandGreen/20 border border-brandGreen/30 flex items-center justify-center text-brandGreen">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white leading-tight">24/7 AI Study Assistant</h3>
                <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">ICAP & ACCA Mentor</span>
              </div>
            </div>

            <button
              onClick={handleNewChat}
              className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer"
              title="Start Fresh Conversation"
            >
              <PlusCircle className="w-4 h-4 text-brandGreen" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          </div>

          {/* Subject Context Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
              Selected Syllabus Context
            </label>
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3.5 py-3 bg-[#021B3A] border border-white/15 rounded-2xl text-xs text-white font-medium focus:outline-none focus:border-brandGreen cursor-pointer appearance-none pr-8"
              >
                {PAPERS.map((paper) => (
                  <option key={paper.id} value={paper.name} className="bg-navy-dark text-white">
                    {paper.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              💡 Provides context to the AI. You can still ask any question across CA & ACCA topics freely!
            </p>
          </div>

          {/* Quick Chat Shortcut Chips */}
          <div className="space-y-2.5 pt-2 border-t border-white/10">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
              Quick Study Actions
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveStudyMode('explain');
                  handleSendMessage("Explain this concept in simple beginner-friendly words", 'explain');
                }}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brandGreen/40 text-[11px] font-bold text-gray-200 text-left transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>Explain Simply</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveStudyMode('quiz');
                  handleSendMessage(`Give me 5 high-yield exam MCQs on ${selectedSubject.split(':')[0]}`, 'quiz');
                }}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brandGreen/40 text-[11px] font-bold text-gray-200 text-left transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Quiz Me (5 MCQs)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveStudyMode('numerical');
                  handleSendMessage("Give me a step-by-step numerical practice problem with calculations and journal entry", 'numerical');
                }}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brandGreen/40 text-[11px] font-bold text-gray-200 text-left transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                <span>Practice Math</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveStudyMode('urdu');
                  handleSendMessage("Ye concept simple Roman Urdu mein samjhao", 'urdu');
                }}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brandGreen/40 text-[11px] font-bold text-gray-200 text-left transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>Roman Urdu</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pro Tip Box */}
        <div className="p-3.5 rounded-2xl bg-brandGreen/10 border border-brandGreen/20 text-[11px] text-gray-300 mt-4 flex items-center justify-between">
          <div>
            <strong className="text-emerald-400 block mb-0.5">Real AI Chatbot:</strong>
            Type any question or greeting to chat naturally.
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleNewChat}
              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-colors cursor-pointer"
              title="Clear Chat History"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* RIGHT MAIN CHAT CONVERSATION WORKSPACE */}
      <div className="lg:col-span-8 bg-navy-dark p-6 rounded-3xl border border-white/10 flex flex-col h-[650px] relative">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
          
          {/* Welcome / Empty State */}
          {messages.length === 0 && (
            <div className="py-6 px-2 space-y-6 animate-fadeIn">
              <div className="text-center max-w-lg mx-auto space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-brandGreen/20 border border-brandGreen/30 text-brandGreen flex items-center justify-center mx-auto shadow-lg">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white font-['Outfit',sans-serif]">
                  What would you like to study today?
                </h3>
                <p className="text-xs text-gray-400">
                  Ask any question from ICAP or ACCA syllabus. Try clicking any prompt below to begin:
                </p>
              </div>

              {/* Category Prompt Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {SUGGESTIONS.map((cat, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2.5">
                    <div className="flex items-center space-x-2 text-xs font-bold text-white">
                      {cat.icon}
                      <span>{cat.category}</span>
                    </div>
                    <div className="space-y-1.5">
                      {cat.prompts.map((p, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => handleSendMessage(p)}
                          className="w-full text-left p-2 rounded-xl bg-white/5 hover:bg-brandGreen/15 hover:border-brandGreen/30 border border-white/5 text-[11px] text-gray-300 hover:text-white transition-all cursor-pointer leading-snug"
                        >
                          → {p}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conversation Bubbles */}
          {messages.map((msg, idx) => {
            const isStreamingThis = activeStreamingMessageId === msg.id && isTypingStream;
            const textToRender = msg.displayedText !== undefined && msg.displayedText !== '' ? msg.displayedText : msg.text;

            return (
              <div
                key={msg.id || idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                <div className="flex items-center space-x-2 px-1 text-[10px] text-gray-400">
                  <span>{msg.sender === 'user' ? 'You' : 'AI Study Tutor'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-2xl p-4 sm:p-5 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-brandGreen to-emerald-600 text-white rounded-tr-none shadow-lg shadow-brandGreen/10 font-medium'
                      : 'bg-white/[0.06] text-gray-200 border border-white/10 rounded-tl-none shadow-xl space-y-3'
                  }`}
                >
                  <div className="whitespace-pre-wrap">
                    {textToRender}
                    {isStreamingThis && (
                      <span className="inline-block w-1.5 h-4 ml-1 bg-brandGreen animate-pulse align-middle" />
                    )}
                  </div>

                  {/* AI Message Action Buttons */}
                  {msg.sender === 'tutor' && (
                    <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleCopyText(msg.text, idx)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[10px] font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                        >
                          {copiedIdx === idx ? (
                            <>
                              <Check className="w-3 h-3 text-brandGreen" />
                              <span className="text-brandGreen">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleSpeakText(msg.id, msg.text)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center space-x-1 transition-colors cursor-pointer ${
                            isSpeakingId === msg.id
                              ? 'bg-brandGreen text-white'
                              : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          {isSpeakingId === msg.id ? (
                            <>
                              <VolumeX className="w-3 h-3" />
                              <span>Stop Voice</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3" />
                              <span>Listen</span>
                            </>
                          )}
                        </button>
                      </div>

                      <button
                        onClick={() => handleSendMessage(`Please elaborate on this with more detail and practical examples: ${messages[idx - 1]?.text || 'the previous concept'}`)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[10px] font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Elaborate</span>
                      </button>
                    </div>
                  )}

                  {/* Dynamic Follow-up Suggestions */}
                  {msg.sender === 'tutor' && msg.followUps && msg.followUps.length > 0 && !isStreamingThis && (
                    <div className="pt-2 border-t border-white/5 space-y-1.5">
                      <span className="text-[10px] text-gray-400 font-semibold block">Suggested Follow-ups:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.followUps.map((fu, fuIdx) => (
                          <button
                            key={fuIdx}
                            onClick={() => handleSendMessage(fu)}
                            className="px-2.5 py-1 rounded-full bg-brandGreen/10 hover:bg-brandGreen/20 border border-brandGreen/30 text-[10px] font-semibold text-emerald-300 hover:text-white transition-all cursor-pointer"
                          >
                            + {fu}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* AI Thinking Animation */}
          {isLoading && (
            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-white/5 border border-white/10 w-fit animate-pulse">
              <Bot className="w-4 h-4 text-brandGreen animate-spin" />
              <span className="text-xs text-gray-300 font-medium">
                AI Tutor is analyzing your question & thinking...
              </span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Bottom Sticky Chat Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="mt-4 pt-3 border-t border-white/10 space-y-2"
        >
          <div className="flex items-end space-x-2 bg-[#021B3A] border border-white/15 focus-within:border-brandGreen rounded-2xl p-2 transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about CA / ACCA (e.g. Salam, What is IAS 16?, Calculate depreciation, Explain in Roman Urdu)..."
              className="flex-1 max-h-36 bg-transparent text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none resize-none px-2 py-1.5 leading-relaxed"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className={`p-3 rounded-xl font-bold transition-all flex items-center justify-center cursor-pointer ${
                inputQuery.trim() && !isLoading
                  ? 'bg-brandGreen hover:bg-brandGreen-dark text-white shadow-lg shadow-brandGreen/20 hover:scale-105 active:scale-95'
                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
              }`}
              title="Send Message (Enter)"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-gray-500 px-1">
            <span>Press <kbd className="px-1 py-0.5 bg-white/10 rounded text-gray-300 font-mono">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-white/10 rounded text-gray-300 font-mono">Shift+Enter</kbd> for newline</span>
            <span>24/7 Conversational AI Study Assistant</span>
          </div>
        </form>

      </div>

    </div>
  );
}
