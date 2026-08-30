import { useState, useEffect, useRef } from 'react';
import {
  Building2,
  Bot,
  FileText,
  BookOpen,
  Sparkles,
  ExternalLink,
  Search,
  CheckCircle2,
  Send,
  Award,
  Printer,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Briefcase,
  BookMarked,
  RefreshCw,
  Clock,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Activity,
  Video,
  AlertCircle,
  BarChart3,
  TrendingUp,
  History,
  Trash2,
  Eye,
  ShieldCheck,
  Check,
  Zap,
  HelpCircle,
  UserCheck
} from 'lucide-react';
import AudioVisualizer from '../../../components/AudioVisualizer';
import {
  startInterviewSession,
  sendInterviewAnswer,
  completeInterviewSession,
  getInterviewHistory,
  deleteInterviewSession,
  getInterviewSession
} from '../../../services/interviewService';

export default function CareerTools() {
  const [activeSubTab, setActiveSubTab] = useState('directory');

  // Firm Directory State
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [directorySearch, setDirectorySearch] = useState('');

  // ==========================================
  // AI MOCK INTERVIEW ENGINE & REAL-TIME STUDIO
  // ==========================================
  const [mockMode, setMockMode] = useState('studio'); // 'studio' | 'chat' | 'history'

  // Setup Options
  const [interviewRole, setInterviewRole] = useState('Audit Trainee (Articleship)');
  const [customRole, setCustomRole] = useState('');
  const [interviewStage, setInterviewStage] = useState('Manager Technical Round');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [interviewType, setInterviewType] = useState('Technical');
  const [questionCountChoice, setQuestionCountChoice] = useState('5');
  const [customQuestionCount, setCustomQuestionCount] = useState(5);
  const [interviewDurationMinutes, setInterviewDurationMinutes] = useState(15);

  // Active Session State
  const [sessionId, setSessionId] = useState(null);
  const [isStudioActive, setIsStudioActive] = useState(false);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [isFinalizingSession, setIsFinalizingSession] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [totalQuestionsTarget, setTotalQuestionsTarget] = useState(5);
  const [currentQuestionText, setCurrentQuestionText] = useState('');
  const [interviewerStatus, setInterviewerStatus] = useState('CONNECTED'); // 'CONNECTED' | 'AI SPEAKING' | 'LISTENING' | 'PROCESSING' | 'THINKING' | 'DISCONNECTED'

  // Transcript & Turn Tracking
  const [userAnswer, setUserAnswer] = useState('');
  const [transcript, setTranscript] = useState([]);
  const [turnEvaluations, setTurnEvaluations] = useState([]);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [finalScorecard, setFinalScorecard] = useState(null);
  const [expandedEvalIdx, setExpandedEvalIdx] = useState(null);

  // Audio, Voice & Microphone State
  const [isMicListening, setIsMicListening] = useState(false);
  const [micPermissionError, setMicPermissionError] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [aiAudioEnabled, setAiAudioEnabled] = useState(true);
  const [audioStream, setAudioStream] = useState(null);

  // Real-time Timer & Pace Metrics
  const [timerRemaining, setTimerRemaining] = useState(900); // in seconds
  const [elapsedSessionTime, setElapsedSessionTime] = useState(0);
  const [turnSpeakingTime, setTurnSpeakingTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // History State
  const [pastInterviews, setPastInterviews] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  // Chat Mode Specific
  const [chatEvaluation, setChatEvaluation] = useState(null);

  // DOM Refs
  const recognitionRef = useRef(null);
  const transcriptEndRef = useRef(null);
  const audioStreamRef = useRef(null);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcript, isSubmittingAnswer]);

  // Load Past Interview History when History view is accessed
  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await getInterviewHistory();
      setPastInterviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Error fetching history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (mockMode === 'history') {
      fetchHistory();
    }
  }, [mockMode]);

  // Setup Web Speech API for Real-Time Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    } else {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript.trim()) {
          setUserAnswer(currentTranscript);
        }
      };

      recognition.onerror = (event) => {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setMicPermissionError('Microphone access was denied. Please allow microphone permissions in your browser address bar.');
          setIsMicListening(false);
        } else if (event.error !== 'aborted') {
          console.warn('Speech recognition warning:', event.error);
        }
      };

      recognition.onend = () => {
        setIsMicListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  // Timer Countdown Effect
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            // Auto complete interview when duration is reached
            handleFinalizeInterview();
            return 0;
          }
          return prev - 1;
        });
        setElapsedSessionTime((prev) => prev + 1);
        if (isMicListening) {
          setTurnSpeakingTime((prev) => prev + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timerRemaining, isMicListening]);

  // AI Speech Synthesis (Natural Voice Output)
  const speakText = (text) => {
    if (!aiAudioEnabled || !('speechSynthesis' in window) || !text) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#`]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.96;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(
        (v) =>
          v.lang.includes('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('David') ||
            v.name.includes('Zira') ||
            v.name.includes('Male'))
      );
      if (englishVoice) utterance.voice = englishVoice;

      setIsAiSpeaking(true);
      setInterviewerStatus('AI SPEAKING');

      utterance.onend = () => {
        setIsAiSpeaking(false);
        setInterviewerStatus('LISTENING');
        // Auto start listening after AI finishes speaking in studio mode
        if (isStudioActive && mockMode === 'studio') {
          startMicrophoneCapture();
        }
      };

      utterance.onerror = () => {
        setIsAiSpeaking(false);
        setInterviewerStatus('LISTENING');
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
      setIsAiSpeaking(false);
    }
  };

  // Start Real-Time Microphone Capture & Web Audio Stream
  const startMicrophoneCapture = async () => {
    setMicPermissionError(null);
    try {
      let stream = audioStreamRef.current;
      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = stream;
        setAudioStream(stream);
      }

      if (recognitionRef.current && !isMicListening) {
        try {
          recognitionRef.current.start();
          setIsMicListening(true);
          setInterviewerStatus('LISTENING');
        } catch (e) {
          // Ignore already started errors
          setIsMicListening(true);
        }
      }
    } catch (err) {
      console.warn('Microphone permission error:', err);
      setMicPermissionError(
        'Microphone permission is blocked or unavailable. Click the lock/permission icon in your browser URL bar to allow microphone access, or type your answer below.'
      );
      setIsMicListening(false);
    }
  };

  // Stop Microphone
  const stopMicrophoneCapture = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsMicListening(false);
  };

  // Toggle Microphone
  const handleToggleMic = () => {
    if (isMicListening) {
      stopMicrophoneCapture();
    } else {
      startMicrophoneCapture();
    }
  };

  // Live Metrics Helpers
  const getFillerCount = (text) => {
    if (!text) return 0;
    const fillers = ['um', 'uh', 'like', 'actually', 'basically', 'you know', 'mean', 'sort of', 'kind of'];
    const lower = text.toLowerCase();
    let count = 0;
    fillers.forEach((f) => {
      const regex = new RegExp(`\\b${f}\\b`, 'g');
      const matches = lower.match(regex);
      if (matches) count += matches.length;
    });
    return count;
  };

  const getWordCount = (text) => {
    if (!text || !text.trim()) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const calculateWPM = (text, elapsedSeconds) => {
    const words = getWordCount(text);
    if (elapsedSeconds <= 0 || words === 0) return 0;
    return Math.round((words / elapsedSeconds) * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Resolved Target Role
  const targetRoleResolved =
    interviewRole === 'Custom Role' ? customRole.trim() || 'Chartered Accountant Trainee' : interviewRole;
  const targetCountResolved =
    questionCountChoice === 'Custom' ? Number(customQuestionCount) || 5 : Number(questionCountChoice) || 5;

  // ==========================================
  // START INTERVIEW SESSION (VOICE OR CHAT)
  // ==========================================
  const handleStartInterview = async () => {
    setIsStartingSession(true);
    setMicPermissionError(null);
    setFinalScorecard(null);
    setSessionFinished(false);
    setTurnEvaluations([]);
    setUserAnswer('');
    setCurrentQuestionIdx(0);
    setTotalQuestionsTarget(targetCountResolved);
    setElapsedSessionTime(0);
    setTurnSpeakingTime(0);

    const maxSeconds = Number(interviewDurationMinutes) * 60;
    setTimerRemaining(maxSeconds);

    try {
      const response = await startInterviewSession({
        targetRole: targetRoleResolved,
        interviewStage,
        difficulty,
        interviewType,
        questionCount: targetCountResolved,
        duration: interviewDurationMinutes
      });

      const sid = response.sessionId || response.session?._id;
      setSessionId(sid);

      const greetingText = response.greeting || response.questionText || 'Good morning and welcome to your simulated interview.';
      setCurrentQuestionText(greetingText);

      setTranscript([
        {
          speaker: 'ai',
          text: greetingText,
          timestamp: new Date(),
          duration: 0
        }
      ]);

      setIsStudioActive(true);
      setIsTimerActive(true);
      setInterviewerStatus('AI SPEAKING');

      // AI speaks introduction automatically
      if (mockMode === 'studio') {
        speakText(greetingText);
      } else {
        setInterviewerStatus('LISTENING');
      }
    } catch (err) {
      console.error('Failed to start interview:', err);
      alert('Unable to start interview session. Please check your internet connection and try again.');
    } finally {
      setIsStartingSession(false);
    }
  };

  // ==========================================
  // SUBMIT CANDIDATE ANSWER TURN
  // ==========================================
  const handleSubmitAnswerTurn = async (e) => {
    if (e) e.preventDefault();
    if (isSubmittingAnswer || isFinalizingSession) return;

    const answer = userAnswer.trim();
    if (!answer && mockMode === 'chat') return;

    stopMicrophoneCapture();
    setIsSubmittingAnswer(true);
    setInterviewerStatus('PROCESSING');

    // Calculate metrics
    const fillers = getFillerCount(answer);
    const words = getWordCount(answer);
    const wpm = calculateWPM(answer, Math.max(1, turnSpeakingTime));

    // Append candidate message to transcript
    const candidateMsg = {
      speaker: 'candidate',
      text: answer || '(No verbal response recorded)',
      timestamp: new Date(),
      duration: turnSpeakingTime,
      metrics: { wpm, fillerCount: fillers, wordCount: words }
    };
    setTranscript((prev) => [...prev, candidateMsg]);
    setUserAnswer('');
    setTurnSpeakingTime(0);

    try {
      const response = await sendInterviewAnswer({
        sessionId,
        candidateAnswer: answer,
        duration: turnSpeakingTime,
        metrics: { wpm, fillerCount: fillers, wordCount: words }
      });

      if (response.turnEvaluation) {
        setTurnEvaluations((prev) => [...prev, response.turnEvaluation]);
        if (mockMode === 'chat') {
          setChatEvaluation(response.turnEvaluation);
        }
      }

      const nextReply = response.interviewerReply || "Thank you. Let's proceed to the next technical question.";
      setCurrentQuestionText(nextReply);

      // Append AI response to transcript
      setTranscript((prev) => [
        ...prev,
        {
          speaker: 'ai',
          text: nextReply,
          timestamp: new Date(),
          duration: 0
        }
      ]);

      const nextIdx = (response.currentQuestionIndex || currentQuestionIdx + 1);
      setCurrentQuestionIdx(nextIdx);

      const isComplete = response.isInterviewComplete || nextIdx >= totalQuestionsTarget;

      if (isComplete) {
        if (mockMode === 'studio') {
          speakText(nextReply);
        }
        await handleFinalizeInterview();
      } else {
        if (mockMode === 'studio') {
          speakText(nextReply);
        } else {
          setInterviewerStatus('LISTENING');
        }
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      // Resilience fallback
      setCurrentQuestionIdx((prev) => prev + 1);
      setInterviewerStatus('LISTENING');
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // ==========================================
  // FINALIZE & COMPLETE INTERVIEW (SCORECARD)
  // ==========================================
  const handleFinalizeInterview = async () => {
    setIsFinalizingSession(true);
    setIsTimerActive(false);
    stopMicrophoneCapture();
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    try {
      const response = await completeInterviewSession(sessionId);
      const scorecard = response.evaluation || response.session?.evaluation;
      setFinalScorecard(scorecard);
      setSessionFinished(true);
      fetchHistory();
    } catch (err) {
      console.error('Failed to complete interview:', err);
    } finally {
      setIsFinalizingSession(false);
    }
  };

  // Exit Studio & Reset
  const handleExitStudio = () => {
    setIsStudioActive(false);
    setIsTimerActive(false);
    stopMicrophoneCapture();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSessionFinished(false);
    setTranscript([]);
    setTurnEvaluations([]);
    setFinalScorecard(null);
  };

  // View Specific Past Interview Scorecard Modal
  const handleViewPastInterview = async (historyId) => {
    try {
      const sessionData = await getInterviewSession(historyId);
      if (sessionData) {
        setSelectedHistoryItem(sessionData);
        setHistoryModalOpen(true);
      }
    } catch (err) {
      console.error('Failed to fetch session detail:', err);
    }
  };

  const handleDeleteHistory = async (historyId, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this interview record?')) {
      await deleteInterviewSession(historyId);
      setPastInterviews((prev) => prev.filter((item) => item._id !== historyId));
    }
  };

  // ==========================================
  // OTHER SUB-TABS STATE (CV, TUTOR, QURAN)
  // ==========================================
  const [cvData, setCvData] = useState({
    name: 'Muhammad Ahmed',
    crn: 'CRN-104928',
    email: 'ahmed.ca@example.com',
    phone: '+92 300 9876543',
    qualification: 'CA Finalist (CAF Qualified)',
    attempts: 'First Attempt Passed',
    city: 'Lahore',
    skills: 'Financial Modeling, IFRS 15/16, MS Excel (VLOOKUP, Pivot Tables), ISA 315/330 Audit Planning',
    objective: 'Seeking a challenging Articleship position in a reputable Big 4 CA firm to apply accounting principles and gain practical audit experience.'
  });

  const [selectedSubject, setSelectedSubject] = useState('FAR-1 (Financial Accounting)');
  const [tutorQuery, setTutorQuery] = useState('');
  const [tutorMessages, setTutorMessages] = useState([
    {
      sender: 'tutor',
      text: "Assalamu Alaikum! I am your 24/7 AI Study Assistant for CAF & ACCA. Ask me any numerical question, accounting standard concept, or audit scenario!"
    }
  ]);

  const handleSendTutorQuery = (e) => {
    e.preventDefault();
    if (!tutorQuery.trim()) return;
    const q = tutorQuery.trim();
    setTutorMessages((prev) => [...prev, { sender: 'user', text: q }]);
    setTutorQuery('');

    setTimeout(() => {
      let reply = `Regarding your query on **${selectedSubject}**: Always identify the core IAS / IFRS / ISA standard definition before calculating journal entries. Ensure proper assertion testing (Completeness, Valuation, Existence) and tax adjustment where applicable.`;
      if (q.toLowerCase().includes('ias 16')) {
        reply = `Under **IAS 16 (Property, Plant and Equipment)**: Initial recognition is at Cost. Subsequent measurement allows either the Cost Model or Revaluation Model. Depreciation begins when asset is ready for intended use. Note: Land has unlimited useful life and is not depreciated.`;
      } else if (q.toLowerCase().includes('ifrs 15')) {
        reply = `Under **IFRS 15 (Revenue from Contracts with Customers)**, apply the 5-Step Model:\n1. Identify contract\n2. Identify performance obligations\n3. Determine transaction price\n4. Allocate price to obligations\n5. Recognize revenue when/as obligations are satisfied.`;
      }
      setTutorMessages((prev) => [...prev, { sender: 'tutor', text: reply }]);
    }, 600);
  };

  // Firms Data
  const firmsData = [
    {
      id: 1,
      name: 'A.F. Ferguson & Co. (PwC Pakistan)',
      category: 'Big 4',
      city: 'Karachi, Lahore, Islamabad',
      stipend: 'Rs. 29,700 / month',
      feedbacksCount: 142,
      rating: 4.9,
      tags: ['Audit', 'Tax', 'Advisory'],
      recentQuestion: 'What are the criteria for capitalizing development expenditure under IAS 38?'
    },
    {
      id: 2,
      name: 'KPMG Taseer Hadi & Co.',
      category: 'Big 4',
      city: 'Lahore, Karachi, Islamabad',
      stipend: 'Rs. 29,700 / month',
      feedbacksCount: 128,
      rating: 4.8,
      tags: ['Statutory Audit', 'Risk Consulting'],
      recentQuestion: 'How do you test inventory valuation when slow-moving items are present under IAS 2?'
    },
    {
      id: 3,
      name: 'EY Ford Rhodes',
      category: 'Big 4',
      city: 'Karachi, Lahore, Islamabad, Rawalpindi',
      stipend: 'Rs. 29,700 / month',
      feedbacksCount: 115,
      rating: 4.8,
      tags: ['Assurance', 'Tax Compliance'],
      recentQuestion: 'Explain the 5-step revenue recognition model under IFRS 15.'
    },
    {
      id: 4,
      name: 'Yousuf Adil (Deloitte Affiliate)',
      category: 'Big 4',
      city: 'Lahore, Karachi, Islamabad, Multan',
      stipend: 'Rs. 29,700 / month',
      feedbacksCount: 98,
      rating: 4.7,
      tags: ['Audit', 'Financial Advisory'],
      recentQuestion: 'Difference between Provision and Contingent Liability under IAS 37.'
    },
    {
      id: 5,
      name: 'BDO Ebrahim & Co.',
      category: 'Category A',
      city: 'Lahore, Karachi, Islamabad, Faisalabad',
      stipend: 'Rs. 25,000 / month',
      feedbacksCount: 84,
      rating: 4.6,
      tags: ['Audit', 'Taxation'],
      recentQuestion: 'What are the main disclosure requirements for Related Party Transactions under IAS 24?'
    },
    {
      id: 6,
      name: 'Grant Thornton Anjum Rahman',
      category: 'Category A',
      city: 'Lahore, Karachi, Islamabad',
      stipend: 'Rs. 25,000 / month',
      feedbacksCount: 76,
      rating: 4.5,
      tags: ['Taxation', 'Corporate Advisory'],
      recentQuestion: 'Explain Sales Tax input tax credit restrictions in Pakistan Income Tax Law.'
    }
  ];

  const quranLessons = [
    {
      id: 1,
      day: 1,
      surah: 'Surah Al-Baqarah (2:282)',
      title: 'Precision in Financial Documentation',
      arText: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا تَدَايَنتُم بِدَيْنٍ إِلَىٰ أَجَلٍ مُّسَمًّى فَاكْتُبُوهُ',
      translation: 'O you who have believed, when you contract a debt for a specified term, write it down.',
      corporateWisdom: 'The longest verse of the Quran establishes the fundamental principle of complete audit trails, written contracts, and objective third-party verification.'
    },
    {
      id: 2,
      day: 2,
      surah: 'Surah Al-Mutaffifin (83:1-3)',
      title: 'Integrity in Measurement & Reporting',
      arText: 'وَيْلٌ لِّلْمُطَفِّفِينَ • الَّذِينَ إِذَا اكْتَالُوا عَلَى النَّاسِ يَسْتَوْفُونَ',
      translation: 'Woe to those who give less [than due], who, when they take a measure from people, take in full.',
      corporateWisdom: 'Professional ethics and accuracy in financial reporting are sacred trusts. Misleading valuations violate divine accountability.'
    },
    {
      id: 3,
      day: 3,
      surah: 'Surah Al-Qasas (28:26)',
      title: 'Competence & Trustworthiness',
      arText: 'إِنَّ خَيْرَ مَنِ اسْتَأْجَرْتَ الْقَوِيُّ الْأَمِينُ',
      translation: 'Indeed, the best one you can hire is the strong and the trustworthy.',
      corporateWisdom: 'Professional success requires both technical competence (Al-Qawiyy) and uncompromising integrity (Al-Ameen).'
    }
  ];

  return (
    <div className="min-h-screen bg-navy text-white py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy-dark via-navy to-navy-dark border border-white/10 p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-brandGreen/10 blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brandGreen/15 border border-brandGreen/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen CA & ACCA Career Suite</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Career Tools & <span className="text-brandGreen">AI Interview Studio</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Experience simulated Big 4 manager & partner interviews with real-time Gemini voice AI, firm recruitment directories, articleship CV makers, and 24/7 technical tutoring.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
          {[
            { id: 'directory', label: 'Firm Directory', icon: Building2 },
            { id: 'mock', label: 'AI Mock Interview', icon: Bot },
            { id: 'cv', label: 'CV Builder', icon: FileText },
            { id: 'tutor', label: 'AI Study Tutor', icon: BookOpen },
            { id: 'quran', label: 'Quranic Guidance', icon: BookMarked }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center space-x-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-brandGreen text-white shadow-lg shadow-brandGreen/20 border border-brandGreen/50'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* SUB-TAB 1: FIRM DIRECTORY & INTERVIEW INSIGHTS */}
        {/* ======================================================== */}
        {activeSubTab === 'directory' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filters Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-navy-dark p-4 rounded-2xl border border-white/10">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Search firm name or tag..."
                  value={directorySearch}
                  onChange={(e) => setDirectorySearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-brandGreen"
                />
              </div>

              <div>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brandGreen"
                >
                  <option value="All">All Cities (Pakistan)</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                </select>
              </div>

              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brandGreen"
                >
                  <option value="All">All Firm Categories</option>
                  <option value="Big 4">Big 4 Firms</option>
                  <option value="Category A">Category A SMPs</option>
                </select>
              </div>
            </div>

            {/* Firms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {firmsData
                .filter(
                  (f) =>
                    (selectedCity === 'All' || f.city.includes(selectedCity)) &&
                    (selectedCategory === 'All' || f.category === selectedCategory) &&
                    (directorySearch === '' ||
                      f.name.toLowerCase().includes(directorySearch.toLowerCase()) ||
                      f.tags.some((t) => t.toLowerCase().includes(directorySearch.toLowerCase())))
                )
                .map((firm) => (
                  <div
                    key={firm.id}
                    className="bg-navy-dark border border-white/10 rounded-3xl p-6 hover:border-brandGreen/40 transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full bg-brandGreen/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-brandGreen/20">
                          {firm.category}
                        </span>
                        <span className="text-xs text-amber-400 font-bold">★ {firm.rating}</span>
                      </div>

                      <h3 className="text-base font-extrabold text-white">{firm.name}</h3>
                      <p className="text-xs text-gray-400">📍 {firm.city}</p>

                      <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-xs space-y-1">
                        <span className="text-gray-400 block text-[11px]">Monthly Stipend (CAF/ACCA):</span>
                        <span className="text-emerald-400 font-bold text-sm">{firm.stipend}</span>
                      </div>

                      <div className="p-3 rounded-2xl bg-brandGreen/5 border border-brandGreen/15 text-xs text-gray-300 space-y-1">
                        <span className="font-semibold text-brandGreen block">Recent Interview Question:</span>
                        <p className="italic">"{firm.recentQuestion}"</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                      <span>{firm.feedbacksCount} verified reviews</span>
                      <button
                        onClick={() => {
                          setInterviewRole('Audit Trainee (Articleship)');
                          setInterviewStage('Manager Technical Round');
                          setActiveSubTab('mock');
                          setMockMode('studio');
                        }}
                        className="text-brandGreen hover:underline font-bold flex items-center space-x-1 cursor-pointer"
                      >
                        <span>Simulate Interview</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 2: PRODUCTION-GRADE AI MOCK INTERVIEW SUITE */}
        {/* ======================================================== */}
        {activeSubTab === 'mock' && (
          <div className="space-y-6 animate-fadeIn">

            {/* Mode Switcher Header Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-navy-dark p-4 rounded-3xl border border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-brandGreen/15 border border-brandGreen/30 flex items-center justify-center text-emerald-400">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">AI Real-Time Interview Studio</h3>
                  <p className="text-xs text-gray-400">Powered by Google Gemini — Adaptive CA & ACCA technical & behavioral simulation.</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-white/5 p-1 rounded-2xl border border-white/10">
                <button
                  onClick={() => {
                    if (!isStudioActive) setMockMode('studio');
                  }}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    mockMode === 'studio'
                      ? 'bg-brandGreen text-white shadow-md shadow-brandGreen/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Real-Time Studio</span>
                </button>
                <button
                  onClick={() => {
                    if (!isStudioActive) setMockMode('chat');
                  }}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    mockMode === 'chat'
                      ? 'bg-brandGreen text-white shadow-md shadow-brandGreen/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Text Chat Mode</span>
                </button>
                <button
                  onClick={() => {
                    if (!isStudioActive) {
                      setMockMode('history');
                      fetchHistory();
                    }
                  }}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    mockMode === 'history'
                      ? 'bg-brandGreen text-white shadow-md shadow-brandGreen/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>History</span>
                </button>
              </div>
            </div>

            {/* VIEW 1: INTERVIEW SETUP & LAUNCH CARD */}
            {!isStudioActive && !sessionFinished && mockMode !== 'history' && (
              <div className="bg-navy-dark p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-brandGreen/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-3xl space-y-3 relative z-10">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider inline-flex items-center space-x-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Big 4-Style Simulated AI Interview</span>
                  </span>
                  <h2 className="text-xl sm:text-3xl font-extrabold text-white">
                    Simulate Your Professional CA / ACCA Interview
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    Configure your interview profile below. The AI Interviewer will introduce itself automatically, evaluate your answers on technical precision under IFRS/ISA, track your speech pace and filler words, and generate a Big 4 Partner Scorecard!
                  </p>
                </div>

                {/* Setup Controls Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                  {/* Target Role */}
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                    <label className="block text-xs font-bold text-gray-300">Target Role</label>
                    <select
                      value={interviewRole}
                      onChange={(e) => setInterviewRole(e.target.value)}
                      className="w-full px-3 py-2.5 bg-navy border border-white/10 rounded-xl text-xs text-white focus:border-brandGreen focus:outline-none"
                    >
                      <option value="Audit Trainee (Articleship)">Audit Trainee (Articleship)</option>
                      <option value="Audit Associate">Audit Associate</option>
                      <option value="Tax Trainee">Tax Trainee</option>
                      <option value="Tax Associate">Tax Associate</option>
                      <option value="CA Articleship">CA Articleship</option>
                      <option value="ACCA Trainee">ACCA Trainee</option>
                      <option value="Financial Analyst">Financial Analyst</option>
                      <option value="Accounting Associate">Accounting Associate</option>
                      <option value="Internal Audit Trainee">Internal Audit Trainee</option>
                      <option value="Risk Advisory Trainee">Risk Advisory Trainee</option>
                      <option value="Custom Role">Custom Role...</option>
                    </select>

                    {interviewRole === 'Custom Role' && (
                      <input
                        type="text"
                        placeholder="Enter custom role title..."
                        value={customRole}
                        onChange={(e) => setCustomRole(e.target.value)}
                        className="w-full mt-2 px-3 py-2 bg-navy border border-brandGreen/40 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none"
                      />
                    )}
                  </div>

                  {/* Interview Stage */}
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                    <label className="block text-xs font-bold text-gray-300">Interview Stage</label>
                    <select
                      value={interviewStage}
                      onChange={(e) => setInterviewStage(e.target.value)}
                      className="w-full px-3 py-2.5 bg-navy border border-white/10 rounded-xl text-xs text-white focus:border-brandGreen focus:outline-none"
                    >
                      <option value="HR Round">HR Round</option>
                      <option value="Screening Round">Screening Round</option>
                      <option value="Technical Round">Technical Round</option>
                      <option value="Manager Technical Round">Manager Technical Round</option>
                      <option value="Behavioral Round">Behavioral Round</option>
                      <option value="Partner Round">Partner Round</option>
                      <option value="Final Round">Final Round</option>
                    </select>
                  </div>

                  {/* Difficulty */}
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                    <label className="block text-xs font-bold text-gray-300">Difficulty Level</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full px-3 py-2.5 bg-navy border border-white/10 rounded-xl text-xs text-white focus:border-brandGreen focus:outline-none"
                    >
                      <option value="Beginner">Beginner (Foundational concepts)</option>
                      <option value="Intermediate">Intermediate (Standard CAF/ACCA questions)</option>
                      <option value="Advanced">Advanced (Complex IFRS/ISA & Big 4 scenarios)</option>
                      <option value="Expert">Expert (Partner-level judgment & ethics)</option>
                    </select>
                  </div>

                  {/* Interview Type */}
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                    <label className="block text-xs font-bold text-gray-300">Interview Type</label>
                    <select
                      value={interviewType}
                      onChange={(e) => setInterviewType(e.target.value)}
                      className="w-full px-3 py-2.5 bg-navy border border-white/10 rounded-xl text-xs text-white focus:border-brandGreen focus:outline-none"
                    >
                      <option value="Technical">Technical (IFRS, ISA, Tax, Accounting)</option>
                      <option value="Behavioral">Behavioral (STAR method, teamwork, stress)</option>
                      <option value="HR">HR (Background, goals, motivation)</option>
                      <option value="Scenario Based">Scenario Based (Audit dilemmas, fraud, delays)</option>
                      <option value="Mixed">Mixed (Comprehensive multi-round)</option>
                    </select>
                  </div>

                  {/* Question Count */}
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                    <label className="block text-xs font-bold text-gray-300">Question Count</label>
                    <select
                      value={questionCountChoice}
                      onChange={(e) => setQuestionCountChoice(e.target.value)}
                      className="w-full px-3 py-2.5 bg-navy border border-white/10 rounded-xl text-xs text-white focus:border-brandGreen focus:outline-none"
                    >
                      <option value="5">5 Questions (Fast practice)</option>
                      <option value="10">10 Questions (Standard interview)</option>
                      <option value="15">15 Questions (Full intensive session)</option>
                      <option value="Custom">Custom count...</option>
                    </select>

                    {questionCountChoice === 'Custom' && (
                      <input
                        type="number"
                        min="2"
                        max="25"
                        value={customQuestionCount}
                        onChange={(e) => setCustomQuestionCount(Math.max(2, Math.min(25, Number(e.target.value))))}
                        className="w-full mt-2 px-3 py-2 bg-navy border border-brandGreen/40 rounded-xl text-xs text-white focus:outline-none"
                      />
                    )}
                  </div>

                  {/* Duration */}
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                    <label className="block text-xs font-bold text-gray-300">Session Duration</label>
                    <select
                      value={interviewDurationMinutes}
                      onChange={(e) => setInterviewDurationMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-navy border border-white/10 rounded-xl text-xs text-white focus:border-brandGreen focus:outline-none"
                    >
                      <option value="10">10 Minutes</option>
                      <option value="15">15 Minutes</option>
                      <option value="20">20 Minutes</option>
                      <option value="30">30 Minutes</option>
                    </select>
                  </div>
                </div>

                {/* Launch Bar */}
                <div className="flex flex-wrap items-center gap-4 pt-2 relative z-10">
                  <button
                    disabled={isStartingSession}
                    onClick={handleStartInterview}
                    className="px-6 py-3.5 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-2xl font-extrabold text-xs sm:text-sm transition-all shadow-xl shadow-brandGreen/25 flex items-center space-x-2 cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {isStartingSession ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 fill-current" />
                    )}
                    <span>
                      {isStartingSession
                        ? 'Initializing AI Interviewer...'
                        : mockMode === 'studio'
                        ? 'Start Real-Time Voice Studio'
                        : 'Start Text Chat Interview'}
                    </span>
                  </button>

                  {mockMode === 'studio' && (
                    <button
                      onClick={() => setAiAudioEnabled(!aiAudioEnabled)}
                      className="px-4 py-3.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-2xl font-semibold text-xs transition-all border border-white/10 flex items-center space-x-2 cursor-pointer"
                    >
                      {aiAudioEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-red-400" />}
                      <span>AI Voice: {aiAudioEnabled ? 'Active' : 'Muted'}</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 2: ACTIVE REAL-TIME INTERVIEW STUDIO / CHAT VIEW */}
            {isStudioActive && !sessionFinished && (
              <div className="bg-navy-dark p-6 rounded-3xl border border-white/10 space-y-6 animate-fadeIn">

                {/* Studio Top Control Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-3">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                      {mockMode === 'studio' ? 'Live Real-Time Studio' : 'Active Text Chat Simulation'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-400 text-[10px] font-bold">
                      Question {Math.min(currentQuestionIdx + 1, totalQuestionsTarget)} of {totalQuestionsTarget}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-brandGreen/10 text-emerald-300 text-[10px] font-medium border border-brandGreen/20">
                      {targetRoleResolved} • {interviewStage}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    {mockMode === 'studio' && (
                      <button
                        onClick={() => setAiAudioEnabled(!aiAudioEnabled)}
                        className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-all cursor-pointer"
                        title="Toggle AI Audio Voice"
                      >
                        {aiAudioEnabled ? <Volume2 className="w-4 h-4 text-brandGreen" /> : <VolumeX className="w-4 h-4 text-red-400" />}
                      </button>
                    )}
                    <button
                      onClick={handleFinalizeInterview}
                      disabled={isFinalizingSession}
                      className="px-3 py-1.5 bg-brandGreen/20 hover:bg-brandGreen text-emerald-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      {isFinalizingSession ? 'Evaluating...' : 'Finish & Score'}
                    </button>
                    <button
                      onClick={handleExitStudio}
                      className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Exit
                    </button>
                  </div>
                </div>

                {/* Main Interface Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                  {/* Left Column: AI Virtual Interlocutor Card */}
                  <div className="lg:col-span-5 bg-navy p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-between text-center space-y-4 relative overflow-hidden min-h-[420px]">
                    <div className="space-y-4 flex flex-col items-center w-full">
                      {/* Animated Avatar Ring with status aura */}
                      <div
                        className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 border-4 ${
                          isAiSpeaking
                            ? 'border-brandGreen bg-brandGreen/20 shadow-[0_0_30px_rgba(0,200,83,0.5)] scale-105'
                            : isMicListening
                            ? 'border-blue-400 bg-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.5)]'
                            : isSubmittingAnswer
                            ? 'border-amber-400 bg-amber-500/20 shadow-[0_0_25px_rgba(245,158,11,0.4)] animate-pulse'
                            : 'border-white/20 bg-white/5'
                        }`}
                      >
                        <Bot className={`w-14 h-14 ${isAiSpeaking ? 'text-brandGreen animate-bounce' : isSubmittingAnswer ? 'text-amber-300' : 'text-white'}`} />
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-extrabold text-white text-base">Senior Interviewer (Big 4)</h4>
                        <span className="text-[11px] font-semibold uppercase tracking-wider block text-brandGreen">
                          {isAiSpeaking
                            ? '🔊 Speaking Question...'
                            : isSubmittingAnswer
                            ? '💭 Evaluating & Generating Follow-up...'
                            : isMicListening
                            ? '🎙️ Listening to You...'
                            : '⚡ Ready for Response'}
                        </span>
                      </div>

                      {/* Active Live Question Card */}
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200 leading-relaxed text-left w-full max-w-sm">
                        <span className="font-bold text-emerald-400 block mb-1">Current Question:</span>
                        <p className="italic font-medium text-white">{currentQuestionText}</p>
                      </div>
                    </div>

                    {/* Waveform Visualizer */}
                    {mockMode === 'studio' && (
                      <div className="w-full pt-2 border-t border-white/5">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-1">
                          Live Audio Frequency
                        </span>
                        <AudioVisualizer isListening={isMicListening} isSpeaking={isAiSpeaking} stream={audioStream} />
                      </div>
                    )}
                  </div>

                  {/* Right Column: Candidate Live Response Panel & HUD */}
                  <div className="lg:col-span-7 bg-navy p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4">

                    {/* HUD Bar: Timer, Pace WPM, Fillers, Elapsed Time */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Time Remaining</span>
                        <span className={`text-base sm:text-lg font-black ${timerRemaining < 120 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                          {formatTime(timerRemaining)}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Live Pace</span>
                        <span className="text-base sm:text-lg font-black text-white">
                          {calculateWPM(userAnswer, Math.max(1, turnSpeakingTime))} WPM
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Filler Words</span>
                        <span className="text-base sm:text-lg font-black text-amber-400">
                          {getFillerCount(userAnswer)}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Speaking Time</span>
                        <span className="text-base sm:text-lg font-black text-blue-400">
                          {formatTime(turnSpeakingTime)}
                        </span>
                      </div>
                    </div>

                    {/* Live Transcript Stream & Speech Box */}
                    <div className="flex-1 flex flex-col space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-gray-300">Live Transcript & Your Answer:</span>
                        {isMicListening && (
                          <div className="flex items-center space-x-1.5">
                            <span className="w-2 h-2 rounded-full bg-brandGreen animate-ping" />
                            <span className="text-[10px] text-emerald-400 font-bold">Capturing Microphone Speech...</span>
                          </div>
                        )}
                      </div>

                      {/* Permission warning banner if microphone is blocked */}
                      {micPermissionError && (
                        <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-start space-x-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
                          <span>{micPermissionError}</span>
                        </div>
                      )}

                      {/* Scrolling Transcript View */}
                      <div className="max-h-48 overflow-y-auto space-y-2 p-3 rounded-xl bg-black/20 border border-white/5 text-xs scrollbar-thin">
                        {transcript.map((msg, i) => (
                          <div key={i} className={`flex ${msg.speaker === 'candidate' ? 'justify-end' : 'justify-start'}`}>
                            <div
                              className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                                msg.speaker === 'candidate'
                                  ? 'bg-brandGreen text-white rounded-br-none'
                                  : 'bg-white/10 text-gray-200 border border-white/10 rounded-bl-none'
                              }`}
                            >
                              <div className="text-[10px] opacity-75 font-bold mb-1">
                                {msg.speaker === 'candidate' ? 'You (Candidate)' : 'AI Interviewer'}
                              </div>
                              <p className="whitespace-pre-line">{msg.text}</p>
                            </div>
                          </div>
                        ))}
                        {isSubmittingAnswer && (
                          <div className="flex justify-start">
                            <div className="p-3 rounded-xl bg-white/10 text-emerald-300 border border-emerald-500/20 text-xs flex items-center space-x-2">
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Interviewer is evaluating your response and preparing the next question...</span>
                            </div>
                          </div>
                        )}
                        <div ref={transcriptEndRef} />
                      </div>

                      {/* Current Turn Input / Editable Transcript */}
                      <textarea
                        rows="3"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder={
                          mockMode === 'studio'
                            ? "Speak naturally into your microphone or type your response here..."
                            : "Type your professional response to the question..."
                        }
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brandGreen leading-relaxed"
                      />
                    </div>

                    {/* Action Controls */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      {mockMode === 'studio' ? (
                        <button
                          type="button"
                          onClick={handleToggleMic}
                          className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                            isMicListening
                              ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                              : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                          }`}
                        >
                          {isMicListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-400" />}
                          <span>{isMicListening ? 'Stop Speaking (Mic On)' : 'Start Microphone Speaking'}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400">Press Submit or Enter to send answer</span>
                      )}

                      <button
                        type="button"
                        onClick={handleSubmitAnswerTurn}
                        disabled={isSubmittingAnswer || isFinalizingSession}
                        className="w-full sm:w-auto px-6 py-3 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl font-extrabold text-xs transition-all shadow-md shadow-brandGreen/20 flex items-center justify-center space-x-2 cursor-pointer active:scale-95 disabled:opacity-50"
                      >
                        {isSubmittingAnswer ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Answer & Next</span>
                            <ChevronRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* VIEW 3: FINAL AI EVALUATION SCORECARD */}
            {sessionFinished && finalScorecard && (
              <div className="bg-navy-dark p-6 sm:p-8 rounded-3xl border border-brandGreen/30 space-y-6 animate-fadeIn">
                {/* Scorecard Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div className="space-y-1">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brandGreen/20 border border-brandGreen/40 text-emerald-400 text-xs font-bold uppercase">
                      <Award className="w-4 h-4" />
                      <span>{finalScorecard.hiringRecommendation || 'Interview Completed'}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white">Big 4 Partner Evaluation Scorecard</h2>
                    <p className="text-xs text-gray-400">
                      {targetRoleResolved} • {interviewStage} ({difficulty} Level)
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print / PDF</span>
                    </button>
                    <button
                      onClick={handleStartInterview}
                      className="px-4 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Retake Session</span>
                    </button>
                  </div>
                </div>

                {/* Overall Score Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-brandGreen/15 border border-brandGreen/40 text-center space-y-1">
                    <span className="text-[11px] text-gray-300 font-bold uppercase tracking-wider">Overall Score</span>
                    <div className="text-4xl font-black text-emerald-400">{finalScorecard.overallScore} / 100</div>
                    <span className="text-[11px] text-emerald-300 font-semibold block">
                      {finalScorecard.overallScore >= 85
                        ? 'Top Tier (Strong Hire)'
                        : finalScorecard.overallScore >= 75
                        ? 'Solid Performance (Hire)'
                        : 'Passable (Needs Practice)'}
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
                    <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Technical Knowledge</span>
                    <div className="text-3xl font-black text-white">{finalScorecard.technicalKnowledge} / 100</div>
                    <span className="text-[10px] text-gray-400 font-bold">IFRS & ISA Standards</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
                    <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Communication & Clarity</span>
                    <div className="text-3xl font-black text-white">{finalScorecard.communication} / 100</div>
                    <span className="text-[10px] text-gray-400 font-bold">Articulate Delivery</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
                    <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Professional Composure</span>
                    <div className="text-3xl font-black text-white">{finalScorecard.professionalism} / 100</div>
                    <span className="text-[10px] text-gray-400 font-bold">Ethics & Skepticism</span>
                  </div>
                </div>

                {/* Dimension Breakdown Progress Bars */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Performance Dimensions</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {[
                      { label: 'Technical Knowledge', val: finalScorecard.technicalKnowledge },
                      { label: 'Communication & Delivery', val: finalScorecard.communication },
                      { label: 'Answer Relevance & Focus', val: finalScorecard.answerRelevance },
                      { label: 'Clarity & Structure', val: finalScorecard.clarity },
                      { label: 'Problem Solving & Judgment', val: finalScorecard.problemSolving },
                      { label: 'Professional Ethics & Skepticism', val: finalScorecard.professionalism },
                      { label: 'Confidence Indicator', val: finalScorecard.confidenceIndicator }
                    ].map((metric, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between font-semibold">
                          <span className="text-gray-300">{metric.label}</span>
                          <span className="text-emerald-400 font-bold">{metric.val}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-navy border border-white/10 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-brandGreen to-emerald-400 rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(100, Math.max(0, metric.val))}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths, Weaknesses & Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Strengths */}
                  <div className="p-5 rounded-2xl bg-brandGreen/10 border border-brandGreen/20 space-y-3">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Key Strengths</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-gray-200">
                      {finalScorecard.strengths?.map((s, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-brandGreen flex-shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses & Gaps */}
                  <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <AlertCircle className="w-4 h-4" />
                      <span>Areas for Improvement</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-gray-200">
                      {finalScorecard.weaknesses?.map((w, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-3">
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <TrendingUp className="w-4 h-4" />
                      <span>Recommendations</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-gray-200">
                      {finalScorecard.recommendations?.map((r, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <ChevronRight className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Final Assessment Summary */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs text-gray-300">
                  <span className="font-bold text-white uppercase tracking-wider text-[11px] block">
                    Partner Final Assessment Summary:
                  </span>
                  <p className="leading-relaxed">{finalScorecard.finalAssessment}</p>
                </div>

                {/* Question-by-Question Detailed Review */}
                <div className="space-y-4">
                  <h4 className="text-sm font-extrabold text-white tracking-wider uppercase">
                    Question-by-Question Deep Dive ({finalScorecard.questionEvaluations?.length || 0} Questions)
                  </h4>
                  <div className="space-y-3">
                    {finalScorecard.questionEvaluations?.map((evalItem, idx) => {
                      const isExpanded = expandedEvalIdx === idx;
                      return (
                        <div
                          key={idx}
                          className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-3"
                        >
                          <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => setExpandedEvalIdx(isExpanded ? null : idx)}
                          >
                            <div className="space-y-1">
                              <span className="font-extrabold text-emerald-400 text-xs sm:text-sm block">
                                Q{evalItem.questionNumber || idx + 1}: {evalItem.question}
                              </span>
                              <span className="text-[11px] text-gray-400">Score: {evalItem.score} / 100</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="px-2.5 py-1 rounded-lg bg-brandGreen/20 text-emerald-400 font-bold text-xs">
                                {evalItem.score >= 80 ? 'Exceptional' : evalItem.score >= 65 ? 'Good' : 'Needs Work'}
                              </span>
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-navy text-xs text-gray-300 font-mono">
                            <strong>Candidate Answer:</strong> "{evalItem.candidateAnswer || '(No answer recorded)'}"
                          </div>

                          <p className="text-xs text-emerald-300 italic">"{evalItem.feedback}"</p>

                          {isExpanded && evalItem.idealAnswerPoints && evalItem.idealAnswerPoints.length > 0 && (
                            <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs space-y-1.5 mt-2 animate-fadeIn">
                              <span className="font-bold text-gray-300 text-[11px] uppercase">
                                Recommended Answer Points:
                              </span>
                              <ul className="list-disc list-inside text-gray-400 space-y-1">
                                {evalItem.idealAnswerPoints.map((pt, pIdx) => (
                                  <li key={pIdx}>{pt}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/10">
                  <button
                    onClick={handleExitStudio}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Back to Setup
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 4: INTERVIEW HISTORY LIST */}
            {mockMode === 'history' && (
              <div className="bg-navy-dark p-6 rounded-3xl border border-white/10 space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                      <History className="w-4 h-4 text-brandGreen" />
                      <span>Saved Interview Sessions</span>
                    </h3>
                    <p className="text-xs text-gray-400">Review your past scores, transcripts, and feedback history.</p>
                  </div>
                  <button
                    onClick={fetchHistory}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${historyLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                {historyLoading ? (
                  <div className="py-12 text-center text-xs text-gray-400 flex flex-col items-center space-y-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-brandGreen" />
                    <span>Loading saved interviews...</span>
                  </div>
                ) : pastInterviews.length === 0 ? (
                  <div className="py-12 text-center text-xs text-gray-400 space-y-3">
                    <p>No completed interviews found yet.</p>
                    <button
                      onClick={() => setMockMode('studio')}
                      className="px-4 py-2 bg-brandGreen text-white rounded-xl font-bold cursor-pointer"
                    >
                      Start Your First Simulated Interview
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pastInterviews.map((item) => {
                      const scoreDisplay =
                        item.evaluation?.overallScore !== undefined
                          ? `${item.evaluation.overallScore}/100`
                          : item.overallScore || 'Completed';

                      return (
                        <div
                          key={item._id}
                          onClick={() => handleViewPastInterview(item._id)}
                          className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-brandGreen/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-extrabold text-white text-sm">
                                {item.targetRole || item.interviewRole || 'Audit Trainee'}
                              </h4>
                              <span className="px-2 py-0.5 rounded-md bg-brandGreen/20 text-emerald-400 font-bold text-[10px]">
                                {scoreDisplay}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400">
                              {item.interviewStage || item.interviewRound || 'Technical Round'} •{' '}
                              {new Date(item.startedAt || item.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewPastInterview(item._id);
                              }}
                              className="px-3 py-1.5 bg-brandGreen/20 hover:bg-brandGreen text-emerald-300 hover:text-white rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Scorecard</span>
                            </button>
                            <button
                              onClick={(e) => handleDeleteHistory(item._id, e)}
                              className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* PAST SCORECARD MODAL */}
            {historyModalOpen && selectedHistoryItem && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                <div className="bg-navy-dark border border-white/20 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 scrollbar-thin">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">Interview Record & Scorecard</h3>
                      <p className="text-xs text-gray-400">
                        {selectedHistoryItem.targetRole || selectedHistoryItem.interviewRole} •{' '}
                        {selectedHistoryItem.interviewStage || selectedHistoryItem.interviewRound}
                      </p>
                    </div>
                    <button
                      onClick={() => setHistoryModalOpen(false)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {selectedHistoryItem.evaluation ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-brandGreen/15 border border-brandGreen/30 text-center space-y-1">
                        <span className="text-[11px] text-gray-300 uppercase font-bold">Overall Rating</span>
                        <div className="text-3xl font-black text-emerald-400">
                          {selectedHistoryItem.evaluation.overallScore} / 100
                        </div>
                        <span className="text-xs text-emerald-300 font-semibold">
                          {selectedHistoryItem.evaluation.hiringRecommendation}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 space-y-1">
                        <strong className="text-white">Partner Assessment:</strong>
                        <p>{selectedHistoryItem.evaluation.finalAssessment}</p>
                      </div>

                      {/* Transcript */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-white uppercase">Interview Transcript:</h4>
                        <div className="max-h-60 overflow-y-auto space-y-2 p-3 bg-black/30 rounded-xl border border-white/5 text-xs">
                          {selectedHistoryItem.transcript?.map((m, idx) => (
                            <div key={idx} className="space-y-1">
                              <span className={`font-bold block ${m.speaker === 'ai' ? 'text-emerald-400' : 'text-blue-400'}`}>
                                {m.speaker === 'ai' ? 'AI Interviewer:' : 'Candidate:'}
                              </span>
                              <p className="text-gray-300 whitespace-pre-line pl-2">{m.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">No structured evaluation recorded for this session.</p>
                  )}

                  <div className="flex justify-end">
                    <button
                      onClick={() => setHistoryModalOpen(false)}
                      className="px-5 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 3: ARTICLESHIP CV BUILDER */}
        {/* ======================================================== */}
        {activeSubTab === 'cv' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            {/* Form Input Column */}
            <div className="lg:col-span-6 bg-navy-dark p-6 rounded-3xl border border-white/10 space-y-4">
              <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-brandGreen" />
                <span>Articleship CV Form</span>
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={cvData.name}
                    onChange={(e) => setCvData({ ...cvData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brandGreen"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-400 mb-1">CRN / ACCA ID</label>
                  <input
                    type="text"
                    value={cvData.crn}
                    onChange={(e) => setCvData({ ...cvData, crn: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brandGreen"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={cvData.email}
                    onChange={(e) => setCvData({ ...cvData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brandGreen"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={cvData.phone}
                    onChange={(e) => setCvData({ ...cvData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brandGreen"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Career Objective</label>
                <textarea
                  rows="3"
                  value={cvData.objective}
                  onChange={(e) => setCvData({ ...cvData, objective: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brandGreen"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Technical Skills & Tools</label>
                <input
                  type="text"
                  value={cvData.skills}
                  onChange={(e) => setCvData({ ...cvData, skills: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brandGreen"
                />
              </div>
            </div>

            {/* Live CV Preview */}
            <div className="lg:col-span-6 bg-white text-navy p-8 rounded-3xl shadow-2xl space-y-6 font-sans">
              <div className="border-b border-gray-200 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold uppercase text-navy tracking-tight">{cvData.name}</h2>
                  <p className="text-xs text-brandGreen font-bold">{cvData.qualification} | {cvData.crn}</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-2 rounded-xl bg-navy text-white text-xs font-bold flex items-center space-x-1 hover:bg-navy-dark transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print CV</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold uppercase text-brandGreen tracking-wider mb-1">Career Objective</h4>
                  <p className="text-gray-600 leading-relaxed">{cvData.objective}</p>
                </div>

                <div>
                  <h4 className="font-bold uppercase text-brandGreen tracking-wider mb-1">Educational Stage & Attempts</h4>
                  <p className="text-gray-700"><strong>Status:</strong> {cvData.qualification}</p>
                  <p className="text-gray-700"><strong>Attempt Status:</strong> {cvData.attempts}</p>
                </div>

                <div>
                  <h4 className="font-bold uppercase text-brandGreen tracking-wider mb-1">Skills & Certifications</h4>
                  <p className="text-gray-700">{cvData.skills}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 4: 24/7 AI STUDY TUTOR */}
        {/* ======================================================== */}
        {activeSubTab === 'tutor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            <div className="lg:col-span-4 bg-navy-dark p-6 rounded-3xl border border-white/10 space-y-4">
              <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-brandGreen" />
                <span>Subject Selection</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Select ICAP / ACCA Paper</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                >
                  <option value="FAR-1 (Financial Accounting)">CAF-1 Financial Accounting & Reporting I</option>
                  <option value="FAR-2 (Financial Accounting)">CAF-5 Financial Accounting & Reporting II</option>
                  <option value="Audit & Assurance">CAF-6 Audit and Assurance</option>
                  <option value="Taxation">CAF-2 Tax Practices</option>
                  <option value="ACCA PM">ACCA Performance Management</option>
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs space-y-2">
                <span className="font-bold text-emerald-400">Quick Tutor Prompts:</span>
                <div className="space-y-1.5 text-gray-300">
                  <button
                    onClick={() => setTutorQuery("Explain IAS 16 Cost vs Revaluation Model")}
                    className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 transition-colors cursor-pointer"
                  >
                    • IAS 16 Revaluation Model
                  </button>
                  <button
                    onClick={() => setTutorQuery("What are the key assertions in Audit of Sales?")}
                    className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 transition-colors cursor-pointer"
                  >
                    • Audit Assertions for Revenue
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 bg-navy-dark p-6 rounded-3xl border border-white/10 flex flex-col h-[520px]">
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
                {tutorMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-brandGreen text-white rounded-br-none'
                          : 'bg-white/10 text-gray-200 border border-white/10 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendTutorQuery} className="mt-4 flex space-x-2">
                <input
                  type="text"
                  placeholder="Ask any CAF / ACCA question..."
                  value={tutorQuery}
                  onChange={(e) => setTutorQuery(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-brandGreen"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl font-bold text-xs transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <span>Ask Tutor</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 5: DAILY QURANIC GUIDANCE */}
        {/* ======================================================== */}
        {activeSubTab === 'quran' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quranLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="bg-navy-dark border border-white/10 p-6 rounded-3xl space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                      Day {lesson.day} • {lesson.surah}
                    </span>
                    <h3 className="font-extrabold text-base text-white">{lesson.title}</h3>

                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-right font-serif text-emerald-300 text-sm leading-loose">
                      {lesson.arText}
                    </div>

                    <p className="text-xs text-gray-300 italic leading-relaxed">
                      "{lesson.translation}"
                    </p>

                    <div className="p-3 rounded-xl bg-brandGreen/10 border border-brandGreen/20 text-[11px] text-gray-200">
                      <strong className="text-brandGreen block mb-1">Corporate & Exam Wisdom:</strong>
                      {lesson.corporateWisdom}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
