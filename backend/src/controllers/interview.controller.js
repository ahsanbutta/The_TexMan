import mongoose from 'mongoose';
import { InterviewSession } from '../models/InterviewSession.js';
import { GeminiInterviewService } from '../services/geminiInterview.service.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// In-memory session store for local dev / offline DB resilience
const inMemorySessions = new Map();

/**
 * 1. Initialize a new AI Mock Interview Session
 * POST /api/interviews/start
 */
export const startInterview = asyncHandler(async (req, res) => {
  const {
    targetRole,
    interviewRole,
    interviewStage,
    interviewRound,
    difficulty = 'Intermediate',
    interviewType = 'Technical',
    questionCount = 5,
    duration = 15,
    qualification,
    panelMode = false
  } = req.body;

  const resolvedRole = targetRole || interviewRole || 'Audit Trainee (Articleship)';
  const resolvedStage = interviewStage || interviewRound || 'Manager Technical Round';
  const resolvedCount = Number(questionCount) || 5;
  const resolvedDuration = Number(duration) || 15;
  const isPanel = Boolean(panelMode);

  // Generate initial greeting & Q1 from Gemini Service grounded in question bank
  const initialData = await GeminiInterviewService.startInterviewSession({
    targetRole: resolvedRole,
    interviewStage: resolvedStage,
    difficulty,
    interviewType,
    totalQuestions: resolvedCount,
    panelMode: isPanel
  });

  const sessionData = {
    user: req.user._id,
    targetRole: resolvedRole,
    interviewRole: resolvedRole,
    interviewStage: resolvedStage,
    interviewRound: resolvedStage,
    difficulty,
    interviewType,
    questionCount: resolvedCount,
    duration: resolvedDuration,
    panelMode: isPanel,
    bankQuestions: initialData.bankQuestions || [],
    qualification: qualification || req.user.qualification || 'CAF / ACCA',
    status: 'in_progress',
    startedAt: new Date(),
    currentQuestionIndex: 0,
    transcript: [
      {
        speaker: 'ai',
        text: initialData.greeting,
        speakerRole: initialData.currentSpeaker?.role || 'Senior Interviewer',
        speakerName: initialData.currentSpeaker?.name || 'Interview Panelist',
        timestamp: new Date(),
        duration: 0
      }
    ],
    questionEvaluations: [],
    metrics: {
      avgWpm: 0,
      totalFillers: 0,
      totalSpeakingTime: 0,
      totalDuration: 0,
      cameraEngagement: 85,
      postureStability: 85,
      presenceScore: 90
    }
  };

  let session = null;
  if (mongoose.connection.readyState === 1) {
    try {
      session = await InterviewSession.create(sessionData);
    } catch (err) {
      console.warn('[InterviewController] DB create error, falling back to memory store:', err.message);
    }
  }

  if (!session) {
    const memoryId = new mongoose.Types.ObjectId().toString();
    session = {
      _id: memoryId,
      id: memoryId,
      ...sessionData,
      createdAt: new Date(),
      updatedAt: new Date(),
      save: async function () {
        inMemorySessions.set(this._id.toString(), this);
        return this;
      }
    };
    inMemorySessions.set(memoryId, session);
  }

  return new ApiResponse(
    201,
    {
      sessionId: session._id,
      session,
      greeting: initialData.greeting,
      questionNumber: 1,
      totalQuestions: resolvedCount,
      questionText: initialData.questionText,
      currentSpeaker: initialData.currentSpeaker,
      bankQuestions: initialData.bankQuestions
    },
    'Interview session initialized successfully'
  ).send(res);
});

/**
 * 2. Process Candidate Answer / Turn & Return Dynamic Next Question
 * POST /api/interviews/:sessionId/message or POST /api/interviews/:id/answer
 */
export const submitAnswer = asyncHandler(async (req, res) => {
  const sessionId = (req.params.sessionId || req.params.id || '').toString();
  const { candidateAnswer, userAnswer, metrics = {}, duration = 0 } = req.body;
  const answerText = (candidateAnswer || userAnswer || '').trim();

  let session = null;
  if (mongoose.connection.readyState === 1) {
    try {
      session = await InterviewSession.findOne({
        _id: sessionId,
        user: req.user._id
      });
    } catch (err) {}
  }

  if (!session) {
    session = inMemorySessions.get(sessionId);
  }

  if (!session) {
    throw new ApiError(404, 'Interview session not found or unauthorized access');
  }

  if (session.status === 'completed') {
    throw new ApiError(400, 'This interview session has already been completed.');
  }

  // Find the last question asked by AI
  const lastAiMessage = [...session.transcript].reverse().find((m) => m.speaker === 'ai');
  const currentQuestionText = lastAiMessage ? lastAiMessage.text : 'Please introduce yourself.';

  // Record Candidate Message in Transcript
  session.transcript.push({
    speaker: 'candidate',
    text: answerText || '(No response recorded)',
    timestamp: new Date(),
    duration: Number(duration) || 0,
    metrics: {
      wpm: Number(metrics.wpm) || 0,
      fillerCount: Number(metrics.fillerCount) || 0,
      wordCount: Number(metrics.wordCount) || answerText.split(/\s+/).filter(Boolean).length
    }
  });

  // Update session aggregate metrics
  const candidateTranscripts = session.transcript.filter((m) => m.speaker === 'candidate');
  const totalFillers = candidateTranscripts.reduce((sum, m) => sum + (m.metrics?.fillerCount || 0), 0);
  const totalWpmSum = candidateTranscripts.reduce((sum, m) => sum + (m.metrics?.wpm || 0), 0);
  const avgWpm = candidateTranscripts.length > 0 ? Math.round(totalWpmSum / candidateTranscripts.length) : 0;
  const totalSpeakingTime = candidateTranscripts.reduce((sum, m) => sum + (m.duration || 0), 0);

  session.metrics = {
    avgWpm,
    totalFillers,
    totalSpeakingTime,
    totalDuration: Math.round((Date.now() - new Date(session.startedAt).getTime()) / 1000),
    cameraEngagement: Number(metrics.cameraEngagement) || session.metrics?.cameraEngagement || 85,
    postureStability: Number(metrics.postureStability) || session.metrics?.postureStability || 85,
    presenceScore: Number(metrics.presenceScore) || session.metrics?.presenceScore || 90
  };

  // Process answer with Gemini AI Engine
  const result = await GeminiInterviewService.processCandidateAnswer({
    targetRole: session.targetRole,
    interviewStage: session.interviewStage,
    difficulty: session.difficulty,
    interviewType: session.interviewType,
    totalQuestions: session.questionCount,
    currentQuestionIndex: session.currentQuestionIndex,
    currentQuestion: currentQuestionText,
    candidateAnswer: answerText,
    conversationHistory: session.transcript,
    bankQuestions: session.bankQuestions,
    panelMode: session.panelMode
  });

  // Store Turn Evaluation
  session.questionEvaluations.push(result.turnEvaluation);
  session.currentQuestionIndex += 1;

  // Add AI response to transcript
  session.transcript.push({
    speaker: 'ai',
    text: result.interviewerReply,
    speakerRole: result.currentSpeaker?.role || 'Senior Interviewer',
    speakerName: result.currentSpeaker?.name || 'Interview Panelist',
    timestamp: new Date(),
    duration: 0
  });

  if (typeof session.save === 'function') {
    await session.save();
  }

  return new ApiResponse(
    200,
    {
      turnEvaluation: result.turnEvaluation,
      interviewerReply: result.interviewerReply,
      currentSpeaker: result.currentSpeaker,
      currentQuestionIndex: session.currentQuestionIndex,
      totalQuestions: session.questionCount,
      isInterviewComplete: result.isInterviewComplete || session.currentQuestionIndex >= session.questionCount,
      session
    },
    'Turn evaluated successfully'
  ).send(res);
});

/**
 * 3. Complete Interview & Generate Final 0-100 Scorecard
 * POST /api/interviews/:sessionId/complete or POST /api/interviews/:id/complete
 */
export const completeInterview = asyncHandler(async (req, res) => {
  const sessionId = (req.params.sessionId || req.params.id || '').toString();

  let session = null;
  if (mongoose.connection.readyState === 1) {
    try {
      session = await InterviewSession.findOne({
        _id: sessionId,
        user: req.user._id
      });
    } catch (err) {}
  }

  if (!session) {
    session = inMemorySessions.get(sessionId);
  }

  if (!session) {
    throw new ApiError(404, 'Interview session not found or unauthorized access');
  }

  // Generate complete final evaluation scorecard
  const finalScorecard = await GeminiInterviewService.generateFinalScorecard({
    targetRole: session.targetRole,
    interviewStage: session.interviewStage,
    difficulty: session.difficulty,
    interviewType: session.interviewType,
    transcript: session.transcript,
    questionEvaluations: session.questionEvaluations,
    metrics: session.metrics
  });

  session.evaluation = finalScorecard;
  session.status = 'completed';
  session.completed = true;
  session.completedAt = new Date();

  // Legacy summary metrics
  session.overallScore = `${Math.round(finalScorecard.overallScore / 10)} / 10`;
  session.technicalAccuracy = `${finalScorecard.technicalKnowledge}%`;
  session.confidenceScore = finalScorecard.confidenceIndicator >= 80 ? 'Exceptional' : 'Strong';
  session.strengths = finalScorecard.strengths;
  session.weaknesses = finalScorecard.weaknesses;
  session.recommendations = finalScorecard.recommendations.join(' ');

  if (typeof session.save === 'function') {
    await session.save();
  }

  return new ApiResponse(
    200,
    {
      session,
      evaluation: finalScorecard
    },
    'Interview finalized! Full scorecard generated.'
  ).send(res);
});

/**
 * 4. Get User's Past Interview History
 * GET /api/interviews/history or GET /api/interviews
 */
export const getInterviewHistory = asyncHandler(async (req, res) => {
  let history = [];
  if (mongoose.connection.readyState === 1) {
    try {
      history = await InterviewSession.find({ user: req.user._id })
        .select(
          '_id targetRole interviewRole interviewStage interviewRound difficulty interviewType questionCount duration status startedAt completedAt evaluation overallScore technicalAccuracy confidenceScore createdAt'
        )
        .sort({ createdAt: -1 });
    } catch (err) {}
  }

  // Merge with any in-memory sessions for current user
  const memList = Array.from(inMemorySessions.values()).filter(
    (s) => s.user?.toString() === req.user._id.toString()
  );

  const combined = [...history, ...memList.filter((m) => !history.some((h) => h._id.toString() === m._id.toString()))];

  return new ApiResponse(200, combined, 'Interview history retrieved successfully').send(res);
});

/**
 * 5. Get Single Interview Session Details
 * GET /api/interviews/:sessionId
 */
export const getInterviewSession = asyncHandler(async (req, res) => {
  const sessionId = (req.params.sessionId || req.params.id || '').toString();

  let session = null;
  if (mongoose.connection.readyState === 1) {
    try {
      session = await InterviewSession.findOne({
        _id: sessionId,
        user: req.user._id
      });
    } catch (err) {}
  }

  if (!session) {
    session = inMemorySessions.get(sessionId);
  }

  if (!session) {
    throw new ApiError(404, 'Interview session not found or access unauthorized');
  }

  return new ApiResponse(200, session, 'Interview session details retrieved').send(res);
});

/**
 * 6. Delete an Interview Session
 * DELETE /api/interviews/:sessionId
 */
export const deleteInterviewSession = asyncHandler(async (req, res) => {
  const sessionId = (req.params.sessionId || req.params.id || '').toString();

  let deleted = false;
  if (mongoose.connection.readyState === 1) {
    try {
      const res = await InterviewSession.findOneAndDelete({
        _id: sessionId,
        user: req.user._id
      });
      if (res) deleted = true;
    } catch (err) {}
  }

  if (inMemorySessions.has(sessionId)) {
    inMemorySessions.delete(sessionId);
    deleted = true;
  }

  if (!deleted) {
    throw new ApiError(404, 'Interview session not found or unauthorized');
  }

  return new ApiResponse(200, { deletedId: sessionId }, 'Interview session deleted successfully').send(res);
});

/**
 * 7. Ephemeral Handshake Token (Keep API Keys Server-Side)
 * POST /api/interviews/token
 */
export const getInterviewToken = asyncHandler(async (req, res) => {
  return new ApiResponse(
    200,
    {
      authenticated: true,
      userId: req.user._id,
      timestamp: Date.now()
    },
    'Interview session token generated'
  ).send(res);
});
