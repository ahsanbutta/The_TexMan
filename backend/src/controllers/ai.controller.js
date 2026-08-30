import { AiService } from '../services/ai.service.js';
import { Conversation } from '../models/Conversation.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * AI Study Tutor Q&A Endpoint
 * POST /api/ai/study-tutor
 */
export const askStudyTutor = asyncHandler(async (req, res) => {
  const { subject, query, conversationId } = req.body;

  if (!query) {
    throw new ApiError(400, 'Please provide your question or scenario for the AI Study Tutor.');
  }

  const aiAnswer = await AiService.getStudyTutorResponse({
    subject: subject || 'FAR-1 (Financial Accounting)',
    query
  });

  // If user is authenticated, save to conversation history
  let conversation = null;
  if (req.user) {
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }

    if (!conversation) {
      conversation = await Conversation.create({
        user: req.user._id,
        title: query.slice(0, 40) + '...',
        subject: subject || 'FAR-1',
        messages: []
      });
    }

    conversation.messages.push(
      { sender: 'user', text: query },
      { sender: 'tutor', text: aiAnswer }
    );
    await conversation.save();
  }

  return new ApiResponse(
    200,
    {
      reply: aiAnswer,
      subject: subject || 'FAR-1',
      conversationId: conversation?._id || null
    },
    'Study Tutor response generated'
  ).send(res);
});

/**
 * Get User's Past AI Tutor Conversations
 * GET /api/ai/conversations
 */
export const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ user: req.user._id }).sort({ updatedAt: -1 });
  return new ApiResponse(200, conversations, 'Conversations retrieved').send(res);
});

/**
 * AI CV Assistant - Improve Summary & Experience
 * POST /api/ai/cv/improve-summary
 */
export const improveCvSummary = asyncHandler(async (req, res) => {
  const { qualification, targetFirm, existingSummary } = req.body;

  const result = AiService.improveCvSummary({
    qualification: qualification || req.user?.qualification,
    targetFirm: targetFirm || 'Big 4 (PwC, KPMG, EY, Deloitte)',
    existingSummary
  });

  return new ApiResponse(200, result, 'CV Summary optimized').send(res);
});

/**
 * Evaluate Interview Answer
 * POST /api/ai/interview/evaluate
 */
export const evaluateAnswer = asyncHandler(async (req, res) => {
  const { question, userAnswer, keywords, tip } = req.body;

  const evaluation = AiService.evaluateInterviewAnswer({
    question,
    userAnswer,
    keywords: keywords || [],
    tip: tip || ''
  });

  return new ApiResponse(200, evaluation, 'Answer evaluated successfully').send(res);
});
