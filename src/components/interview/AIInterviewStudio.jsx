import { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  Sparkles,
  Award,
  Clock,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Shield,
  Layers,
  HelpCircle,
  ThumbsUp,
  Play,
  X,
  Radio,
  Check
} from 'lucide-react';

/**
 * Audio Frequency Waveform Visualizer
 */
function AudioVisualizer({ isListening, isSpeaking, stream }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let audioContext;
    let analyser;
    let dataArray;

    if (stream && isListening) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioCtx();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 32;
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        dataArray = new Uint8Array(analyser.frequencyBinCount);
      } catch (e) {}
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const bars = 16;
      const barWidth = width / bars - 2;

      for (let i = 0; i < bars; i++) {
        let barHeight = 4;
        if (isSpeaking) {
          barHeight = Math.sin(Date.now() / 150 + i * 0.5) * 14 + 16;
        } else if (analyser && dataArray && isListening) {
          analyser.getByteFrequencyData(dataArray);
          const val = dataArray[i % dataArray.length] || 0;
          barHeight = Math.max(4, (val / 255) * height * 0.9);
        } else if (isListening) {
          barHeight = Math.sin(Date.now() / 200 + i) * 6 + 8;
        }

        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isSpeaking) {
          gradient.addColorStop(0, '#00E676');
          gradient.addColorStop(1, '#00B0FF');
        } else if (isListening) {
          gradient.addColorStop(0, '#60A5FA');
          gradient.addColorStop(1, '#3B82F6');
        } else {
          gradient.addColorStop(0, '#475569');
          gradient.addColorStop(1, '#334155');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioContext && audioContext.state !== 'closed') audioContext.close().catch(() => {});
    };
  }, [isListening, isSpeaking, stream]);

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={36}
      className="w-full max-w-[240px] h-9 mx-auto rounded-lg bg-black/30 border border-white/5"
    />
  );
}

export default function AIInterviewStudio({
  interviewState = 'INTERVIEW_ACTIVE', // 'REQUESTING_PERMISSIONS' | 'DEVICE_READY' | 'AI_GREETING' | 'WAITING_FOR_READY' | 'INTERVIEW_ACTIVE' | ...
  targetRole = 'Audit Trainee (Articleship)',
  interviewStage = 'Manager Technical Round',
  difficulty = 'Intermediate',
  totalQuestionsTarget = 5,
  currentQuestionIdx = 0,
  currentQuestionText = '',
  currentSpeaker = null,
  panelMode = false,
  isBig4 = false,
  transcript = [],
  userAnswer = '',
  setUserAnswer = () => {},
  isSubmittingAnswer = false,
  isFinalizingSession = false,
  timerRemaining = 900,
  turnSpeakingTime = 0,
  wpm = 0,
  fillerCount = 0,
  isMicListening = false,
  isAiSpeaking = false,
  aiAudioEnabled = true,
  audioStream = null,
  videoRef = null,
  cameraStatus = 'READY',
  micStatus = 'READY',
  isCameraActive = true,
  deviceError = null,
  voiceStatusMessage = '',
  behavioralMetrics = {},
  onConfirmReady = () => {},
  onConfirmNotReady = () => {},
  onToggleMic = () => {},
  onToggleCamera = () => {},
  onToggleAiAudio = () => {},
  onSubmitAnswer = () => {},
  onFinalizeInterview = () => {},
  onExitStudio = () => {}
}) {
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const transcriptEndRef = useRef(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, isSubmittingAnswer]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isHRTurn =
    currentSpeaker?.role?.toLowerCase().includes('hr') ||
    currentSpeaker?.role?.toLowerCase().includes('behavioral') ||
    currentSpeaker?.role?.toLowerCase().includes('culture') ||
    currentSpeaker?.name?.toLowerCase().includes('sana');

  const isWaitingForReady = interviewState === 'WAITING_FOR_READY';
  const isGreetingState = interviewState === 'AI_GREETING';
  const isInitializing = interviewState === 'REQUESTING_PERMISSIONS' || interviewState === 'DEVICE_INITIALIZING';

  return (
    <div className="bg-[#021B3A] p-4 sm:p-7 rounded-3xl border border-white/10 space-y-5 animate-fadeIn select-none font-sans shadow-2xl relative">
      
      {/* ── TOP CONTROL & STATUS BAR ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs font-black uppercase tracking-wider text-white">
            {panelMode ? 'Two-Agent Boardroom Simulation' : 'Physical Interview Simulator'}
          </span>

          {isWaitingForReady ? (
            <span className="px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold border border-amber-500/30 animate-pulse flex items-center space-x-1">
              <Radio className="w-3 h-3 text-amber-400" />
              <span>Waiting for Your Readiness</span>
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-brandGreen/20 text-emerald-400 text-[10px] font-extrabold border border-brandGreen/30">
              Question {Math.min(currentQuestionIdx + 1, totalQuestionsTarget)} of {totalQuestionsTarget}
            </span>
          )}

          <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-gray-300 text-[10px] font-bold">
            {targetRole} • {interviewStage} ({difficulty})
          </span>

          {isBig4 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold border border-amber-500/30">
              Big 4 Standard
            </span>
          )}
        </div>

        {/* Global Controls */}
        <div className="flex items-center space-x-2">
          {/* Debug Toggle */}
          <button
            type="button"
            onClick={() => setShowDebugPanel(!showDebugPanel)}
            className="px-2 py-1 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg text-[10px] font-mono border border-white/5 transition-all"
            title="Toggle State Machine Debug Inspector"
          >
            FSM
          </button>

          {/* Audio Mute Button */}
          <button
            type="button"
            onClick={onToggleAiAudio}
            className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-all cursor-pointer border border-white/10"
            title="Toggle Interviewer Spoken Voice"
          >
            {aiAudioEnabled ? <Volume2 className="w-4 h-4 text-brandGreen" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>

          {/* Finish & Score Button */}
          <button
            type="button"
            onClick={() => {
              if (isWaitingForReady || isGreetingState) {
                alert('The interview has not begun yet. Say "I am ready" to start questions, or click Exit to return to setup.');
              } else {
                setShowEndConfirm(true);
              }
            }}
            disabled={isFinalizingSession}
            className="px-3.5 py-2 bg-brandGreen hover:bg-brandGreen-dark text-white font-extrabold rounded-xl text-xs transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center space-x-1.5"
          >
            {isFinalizingSession ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <Award className="w-3.5 h-3.5" />
                <span>Finish & Score</span>
              </>
            )}
          </button>

          {/* Exit Button */}
          <button
            type="button"
            onClick={() => setShowExitConfirm(true)}
            className="px-3 py-2 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Exit
          </button>
        </div>
      </div>

      {/* ── DEVICE READINESS STATUS PILLS ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="font-bold text-gray-400 uppercase text-[10px]">Device Status:</span>
          
          {/* Camera Pill */}
          <span className={`px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1.5 border ${
            cameraStatus === 'READY'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : cameraStatus === 'OFF'
              ? 'bg-gray-700/40 border-gray-600 text-gray-400'
              : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${cameraStatus === 'READY' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
            <span>Camera: {cameraStatus === 'READY' ? 'Ready' : cameraStatus === 'OFF' ? 'Disabled' : 'Voice-Only'}</span>
          </span>

          {/* Microphone Pill */}
          <span className={`px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1.5 border ${
            micStatus === 'READY'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${micStatus === 'READY' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>Microphone: {micStatus === 'READY' ? 'Ready' : 'Muted'}</span>
          </span>
        </div>

        {/* Question Progress Dots */}
        {!isWaitingForReady && !isGreetingState && (
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase mr-1">Progress:</span>
            {Array.from({ length: totalQuestionsTarget }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx < currentQuestionIdx
                    ? 'w-6 bg-brandGreen'
                    : idx === currentQuestionIdx
                    ? 'w-8 bg-emerald-400 animate-pulse'
                    : 'w-4 bg-white/20'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── MAIN TWO-COLUMN PHYSICAL INTERVIEW STAGE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

        {/* ── LEFT COLUMN: AI INTERVIEW PANEL ── */}
        <div className="lg:col-span-6 bg-navy p-5 sm:p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4 relative overflow-hidden text-center min-h-[440px]">
          
          <div className="space-y-4 flex flex-col items-center w-full">
            
            {/* Header Badge */}
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-bold text-gray-300">
                {panelMode ? 'Interview Panel' : 'Senior Interviewer'}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                isAiSpeaking
                  ? 'bg-brandGreen/20 text-emerald-400 border border-brandGreen/40'
                  : isSubmittingAnswer
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : isWaitingForReady
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : isMicListening
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'bg-white/5 text-gray-400'
              }`}>
                {isAiSpeaking
                  ? '● Speaking'
                  : isSubmittingAnswer
                  ? '💭 Evaluating Turn'
                  : isWaitingForReady
                  ? '⏳ Waiting For Ready'
                  : isMicListening
                  ? '🎙️ Listening'
                  : '● Standby'}
              </span>
            </div>

            {/* AVATAR PRESENTATION (Single or Dual Panel) */}
            {panelMode ? (
              <div className="grid grid-cols-2 gap-4 w-full max-w-sm pt-2">
                {/* Panelist 1: Senior Audit Manager (Technical) */}
                <div className={`p-3.5 rounded-2xl transition-all border ${
                  !isHRTurn && (isAiSpeaking || isWaitingForReady)
                    ? 'bg-brandGreen/15 border-brandGreen shadow-[0_0_25px_rgba(0,200,83,0.3)] scale-105'
                    : 'bg-white/5 border-white/10 opacity-75'
                }`}>
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center border-2 border-white/20 mb-2">
                    <Bot className={`w-8 h-8 ${!isHRTurn && isAiSpeaking ? 'text-brandGreen animate-pulse' : 'text-gray-300'}`} />
                  </div>
                  <span className="block text-xs font-black text-white">Asim Raza</span>
                  <span className="block text-[10px] text-emerald-400 font-bold">Senior Audit Manager</span>
                  <span className="block text-[9px] text-gray-400">Technical Lead</span>
                </div>

                {/* Panelist 2: HR Lead (Behavioral) */}
                <div className={`p-3.5 rounded-2xl transition-all border ${
                  isHRTurn && isAiSpeaking
                    ? 'bg-purple-500/15 border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.3)] scale-105'
                    : 'bg-white/5 border-white/10 opacity-75'
                }`}>
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-purple-950 to-slate-800 flex items-center justify-center border-2 border-white/20 mb-2">
                    <User className={`w-8 h-8 ${isHRTurn && isAiSpeaking ? 'text-purple-300 animate-pulse' : 'text-gray-300'}`} />
                  </div>
                  <span className="block text-xs font-black text-white">Sana Malik</span>
                  <span className="block text-[10px] text-purple-300 font-bold">HR Talent Lead</span>
                  <span className="block text-[9px] text-gray-400">Behavioral & Ethics</span>
                </div>
              </div>
            ) : (
              /* Single Interviewer Avatar */
              <div className="pt-2 flex flex-col items-center">
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 border-4 ${
                    isAiSpeaking
                      ? 'border-brandGreen bg-brandGreen/20 shadow-[0_0_35px_rgba(0,200,83,0.5)] scale-105'
                      : isSubmittingAnswer
                      ? 'border-amber-400 bg-amber-500/20 shadow-[0_0_25px_rgba(245,158,11,0.4)] animate-pulse'
                      : isWaitingForReady
                      ? 'border-purple-400 bg-purple-500/20 shadow-[0_0_25px_rgba(168,85,247,0.4)]'
                      : 'border-white/20 bg-white/5'
                  }`}
                >
                  <Bot className={`w-12 h-12 ${isAiSpeaking ? 'text-brandGreen animate-bounce' : 'text-white'}`} />
                </div>
                <div className="mt-3">
                  <h4 className="font-extrabold text-white text-sm">Big 4 Senior Interview Panel</h4>
                  <span className="text-[11px] text-emerald-400 font-bold">The TaxMan's Capital Virtual Boardroom</span>
                </div>
              </div>
            )}

            {/* Current Spoken Dialogue / Question Box */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-200 leading-relaxed text-left w-full shadow-inner">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-emerald-400 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {isWaitingForReady
                      ? 'Candidate Readiness Check:'
                      : isGreetingState
                      ? 'Interviewer Introduction:'
                      : `Question ${currentQuestionIdx + 1}:`}
                  </span>
                </span>
                {currentSpeaker?.name && (
                  <span className="text-[10px] text-gray-400 font-semibold">
                    Spoken by {currentSpeaker.name}
                  </span>
                )}
              </div>
              <p className="italic font-medium text-white text-xs sm:text-sm">
                "{currentQuestionText}"
              </p>
            </div>
          </div>

          {/* Live Audio Visualizer Frequency */}
          <div className="w-full pt-3 border-t border-white/5">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-1">
              Audio Frequency Spectrum
            </span>
            <AudioVisualizer isListening={isMicListening} isSpeaking={isAiSpeaking} stream={audioStream} />
          </div>

        </div>

        {/* ── RIGHT COLUMN: CANDIDATE LIVE CAMERA & RESPONSE PANEL ── */}
        <div className="lg:col-span-6 bg-navy p-5 sm:p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4">
          
          {/* Real-time Candidate Video Feed */}
          <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-white/10 aspect-video max-h-[220px] w-full flex items-center justify-center group shadow-lg">
            {isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="text-center p-6 space-y-2">
                <VideoOff className="w-10 h-10 text-gray-500 mx-auto" />
                <span className="text-xs font-bold text-gray-400 block">Camera is Disabled</span>
                <span className="text-[10px] text-gray-500 block max-w-xs">
                  Running in Voice-Only Mode. Turn camera on for presentation metrics.
                </span>
              </div>
            )}

            {/* Video Live Badges */}
            <div className="absolute top-2.5 left-2.5 flex items-center space-x-2">
              {isCameraActive && (
                <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>HD Camera</span>
                </span>
              )}
              {isMicListening ? (
                <span className="px-2 py-0.5 rounded-md bg-red-600/80 backdrop-blur-md text-white text-[10px] font-bold flex items-center space-x-1 animate-pulse">
                  <Mic className="w-3 h-3" />
                  <span>MIC LIVE</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-gray-300 text-[10px] font-medium">
                  Mic Muted
                </span>
              )}
            </div>

            {/* Behavioral Indicators Badge */}
            {isCameraActive && (
              <div className="absolute bottom-2.5 right-2.5 flex items-center space-x-1.5">
                <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-emerald-300 text-[10px] font-bold border border-white/10">
                  Presence: {behavioralMetrics.gazeStatus || 'Engaged'}
                </span>
              </div>
            )}
          </div>

          {/* Device Error / Warning Disclaimer Banner */}
          {deviceError && (
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
              <span className="text-[11px] leading-tight">{deviceError}</span>
            </div>
          )}

          {/* ── WAITING FOR READY ACTION INTERFACE ── */}
          {isWaitingForReady ? (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 to-emerald-500/15 border border-amber-500/30 space-y-3 animate-fadeIn">
              <div className="flex items-center space-x-2 text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span className="font-extrabold text-xs uppercase tracking-wider">
                  Ready to Start Your Interview?
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                The interviewer is waiting for your confirmation. Say <strong className="text-white">"Yes, I am ready"</strong> into your microphone, or click the button below:
              </p>

              {voiceStatusMessage && (
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{voiceStatusMessage}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => onConfirmReady('Yes, I am ready.')}
                  className="px-5 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl font-black text-xs transition-all shadow-md shadow-brandGreen/25 flex items-center space-x-1.5 cursor-pointer active:scale-95"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Yes, I Am Ready</span>
                </button>

                <button
                  type="button"
                  onClick={() => onConfirmNotReady('Not yet, please give me a moment.')}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-xl font-bold text-xs transition-all cursor-pointer"
                >
                  <span>Wait, give me a moment</span>
                </button>
              </div>
            </div>
          ) : (
            /* ── REAL-TIME ACTIVE HUD ── */
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[9px] text-gray-400 font-bold uppercase block">Time Left</span>
                <span className={`text-xs sm:text-sm font-black ${timerRemaining < 120 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                  {formatTime(timerRemaining)}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[9px] text-gray-400 font-bold uppercase block">Pace</span>
                <span className="text-xs sm:text-sm font-black text-white">{wpm} WPM</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[9px] text-gray-400 font-bold uppercase block">Fillers</span>
                <span className="text-xs sm:text-sm font-black text-amber-400">{fillerCount}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[9px] text-gray-400 font-bold uppercase block">Duration</span>
                <span className="text-xs sm:text-sm font-black text-blue-400">{formatTime(turnSpeakingTime)}</span>
              </div>
            </div>
          )}

          {/* Candidate Spoken Transcript / Text Input Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-300 text-[11px]">
                {isWaitingForReady ? 'Microphone Transcript / Confirmation:' : 'Your Response (Spoken / Typed):'}
              </span>
              {isMicListening && (
                <span className="text-[10px] text-emerald-400 font-bold animate-pulse">
                  {voiceStatusMessage || 'Listening to your microphone...'}
                </span>
              )}
            </div>

            <textarea
              rows="3"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={
                isWaitingForReady
                  ? "Say 'I am ready' or type your confirmation here..."
                  : "Speak directly into your microphone, or type your response here..."
              }
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brandGreen leading-relaxed select-text"
            />
          </div>

          {/* Control Actions Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
            <div className="flex items-center space-x-2">
              {/* Mic Toggle Button */}
              <button
                type="button"
                onClick={onToggleMic}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isMicListening
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                }`}
              >
                {isMicListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{isMicListening ? 'Mute Mic' : 'Start Mic'}</span>
              </button>

              {/* Camera Toggle Button */}
              <button
                type="button"
                onClick={onToggleCamera}
                className={`p-2.5 rounded-xl text-xs flex items-center justify-center transition-all cursor-pointer border ${
                  isCameraActive
                    ? 'bg-white/10 hover:bg-white/20 text-emerald-400 border-white/10'
                    : 'bg-red-500/20 text-red-300 border-red-500/30'
                }`}
                title={isCameraActive ? 'Turn Camera Off' : 'Turn Camera On'}
              >
                {isCameraActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>
            </div>

            {/* Submit Turn Button */}
            {!isWaitingForReady && (
              <button
                type="button"
                onClick={onSubmitAnswer}
                disabled={isSubmittingAnswer || isFinalizingSession}
                className="px-5 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl font-extrabold text-xs transition-all shadow-md shadow-brandGreen/25 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {isSubmittingAnswer ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Submit & Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>

        </div>

      </div>

      {/* ── COLLAPSIBLE LIVE TRANSCRIPT DRAWER ── */}
      <div className="bg-navy/80 rounded-2xl border border-white/10 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowFullTranscript(!showFullTranscript)}
          className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Live Session Transcript History ({transcript.length} turns)</span>
          </div>
          {showFullTranscript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showFullTranscript && (
          <div className="p-4 pt-0 max-h-56 overflow-y-auto space-y-2.5 border-t border-white/5 scrollbar-thin">
            {transcript.map((msg, i) => (
              <div key={i} className={`flex ${msg.speaker === 'candidate' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                    msg.speaker === 'candidate'
                      ? 'bg-brandGreen text-white rounded-br-none'
                      : 'bg-white/10 text-gray-200 border border-white/10 rounded-bl-none'
                  }`}
                >
                  <div className="text-[10px] opacity-75 font-bold mb-1 flex items-center justify-between">
                    <span>
                      {msg.speaker === 'candidate'
                        ? 'Candidate'
                        : msg.speakerName || msg.speakerRole || 'AI Interviewer'}
                    </span>
                    <span className="text-[9px] opacity-60">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="whitespace-pre-line select-text">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={transcriptEndRef} />
          </div>
        )}
      </div>

      {/* ── OPTIONAL DEBUG STATUS BAR (FOR INSPECTION) ── */}
      {showDebugPanel && (
        <div className="p-3 bg-black/80 rounded-xl border border-emerald-500/40 text-[11px] font-mono text-gray-300 space-y-1">
          <div className="text-emerald-400 font-bold uppercase">State Machine Inspector:</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div>State: <span className="text-white font-bold">{interviewState}</span></div>
            <div>Camera: <span className="text-emerald-300 font-bold">{cameraStatus}</span></div>
            <div>Microphone: <span className="text-emerald-300 font-bold">{micStatus}</span></div>
            <div>Speech: <span className="text-blue-300 font-bold">{isMicListening ? 'LISTENING' : 'OFF'}</span></div>
            <div>AI Speaking: <span className="text-amber-300 font-bold">{isAiSpeaking ? 'TRUE' : 'FALSE'}</span></div>
            <div>Waiting Ready: <span className="text-purple-300 font-bold">{isWaitingForReady ? 'TRUE' : 'FALSE'}</span></div>
          </div>
        </div>
      )}

      {/* Privacy Guarantee Footer Note */}
      <div className="flex items-center justify-center space-x-2 text-[10px] text-gray-500 pt-1">
        <Shield className="w-3 h-3 text-emerald-500" />
        <span>
          Zero raw video or audio is stored on servers. Behavioral signals and speech metrics are computed transiently in real time.
        </span>
      </div>

      {/* ── MODAL: END INTERVIEW CONFIRMATION ── */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#031E42] border border-white/10 rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-5 shadow-2xl animate-scaleUp">
            <div className="space-y-2">
              <h3 className="text-lg font-black text-white">End Interview Session?</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Ending the interview will conclude question rounds, shut down camera and microphone hardware, and compile your Big 4 Partner Evaluation Scorecard.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEndConfirm(false)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Continue Interview
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEndConfirm(false);
                  onFinalizeInterview();
                }}
                className="px-4 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl text-xs font-black transition-all shadow-md shadow-brandGreen/25 cursor-pointer"
              >
                End & Generate Scorecard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: EXIT CONFIRMATION ── */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#031E42] border border-red-500/30 rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-5 shadow-2xl animate-scaleUp">
            <div className="space-y-2">
              <h3 className="text-lg font-black text-white">Exit Interview Studio?</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Exiting will immediately stop all camera and microphone hardware, reset session progress, and return to the interview setup screen.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Stay in Studio
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false);
                  onExitStudio();
                }}
                className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black transition-all shadow-md cursor-pointer"
              >
                Confirm Exit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
