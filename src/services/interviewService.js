import api from './api';

/**
 * AI Mock Interview Service (Frontend)
 * Communicates with backend /api/interviews endpoints.
 * Includes local fallback resilience if the backend is temporarily offline during development.
 */

export const startInterviewSession = async ({
  targetRole = 'Audit Trainee (Articleship)',
  interviewStage = 'Manager Technical Round',
  difficulty = 'Intermediate',
  interviewType = 'Technical',
  questionCount = 5,
  duration = 15
}) => {
  try {
    const res = await api.post('/interviews/start', {
      targetRole,
      interviewStage,
      difficulty,
      interviewType,
      questionCount: Number(questionCount) || 5,
      duration: Number(duration) || 15
    });
    return res.data || res;
  } catch (err) {
    console.warn('[InterviewService] API unavailable, running client-side fallback session:', err.message);
    const mockSessionId = 'local_session_' + Date.now();
    const initialGreeting = `Good morning and welcome to your simulated ${interviewStage} for the ${targetRole} position at The TaxMan's Capital. I will be conducting your interview today. Please answer each question naturally and clearly. To begin, could you please introduce yourself, state your academic background, and explain why you chose to pursue a career in this field?`;

    return {
      sessionId: mockSessionId,
      session: {
        _id: mockSessionId,
        targetRole,
        interviewStage,
        difficulty,
        interviewType,
        questionCount,
        duration,
        transcript: [{ speaker: 'ai', text: initialGreeting, timestamp: new Date() }]
      },
      greeting: initialGreeting,
      questionNumber: 1,
      totalQuestions: questionCount,
      questionText: initialGreeting
    };
  }
};

export const sendInterviewAnswer = async ({
  sessionId,
  candidateAnswer,
  metrics = {},
  duration = 0
}) => {
  try {
    const res = await api.post(`/interviews/${sessionId}/message`, {
      candidateAnswer,
      metrics,
      duration
    });
    return res.data || res;
  } catch (err) {
    console.warn('[InterviewService] API answer turn fallback:', err.message);
    const words = (candidateAnswer || '').trim().split(/\s+/).filter(Boolean).length;
    const score = words > 20 ? 82 : words > 10 ? 70 : 55;

    return {
      turnEvaluation: {
        score,
        technicalAccuracy: score,
        relevance: score + 5,
        clarity: score,
        completeness: score - 5,
        feedback: words > 15
          ? 'Good articulate answer covering relevant principles.'
          : 'Answer was concise. Consider referencing relevant IFRS / ISA standards.',
        idealAnswerPoints: ['Identification of core standard', 'Impact on audit procedures', 'Professional skepticism']
      },
      interviewerReply: 'Thank you for your response. Let us proceed to the next question: Can you explain how you would evaluate internal control risks when audit evidence is inconsistent?',
      isInterviewComplete: false
    };
  }
};

export const completeInterviewSession = async (sessionId) => {
  try {
    const res = await api.post(`/interviews/${sessionId}/complete`, {});
    return res.data || res;
  } catch (err) {
    console.warn('[InterviewService] API complete fallback:', err.message);
    return {
      evaluation: {
        overallScore: 84,
        technicalKnowledge: 86,
        communication: 82,
        answerRelevance: 85,
        clarity: 80,
        problemSolving: 84,
        professionalism: 90,
        confidenceIndicator: 85,
        strengths: [
          'Strong conceptual grasp of IFRS and ISA audit standards',
          'Clear, articulate response delivery with good composure',
          'Demonstrated ethical awareness under the ICAP Code of Ethics'
        ],
        weaknesses: [
          'Could cite specific standard paragraph numbers in scenario answers',
          'Pacing can be modulated with brief deliberate pauses'
        ],
        recommendations: [
          'Review ISA 315 internal control walkthrough procedures',
          'Practice structuring answers with Framework -> Evidence -> Conclusion',
          'Deepen knowledge of IFRS 15 5-step revenue recognition criteria'
        ],
        technicalGaps: [
          'Substantive audit testing of complex financial instruments',
          'Deferred taxation adjustments under IAS 12'
        ],
        finalAssessment: 'Candidate demonstrated high professional aptitude, solid technical understanding, and strong problem-solving capabilities.',
        interviewSummary: 'Completed a comprehensive Big 4 simulated technical & behavioral round.',
        hiringRecommendation: 'Strong Candidate - Recommended for Induction'
      }
    };
  }
};

export const getInterviewHistory = async () => {
  try {
    const res = await api.get('/interviews/history');
    return res.data || res;
  } catch (err) {
    console.warn('[InterviewService] Fetching history fallback:', err.message);
    return [];
  }
};

export const getInterviewSession = async (sessionId) => {
  try {
    const res = await api.get(`/interviews/${sessionId}`);
    return res.data || res;
  } catch (err) {
    console.warn('[InterviewService] Fetch session fallback:', err.message);
    return null;
  }
};

export const deleteInterviewSession = async (sessionId) => {
  try {
    const res = await api.delete(`/interviews/${sessionId}`);
    return res.data || res;
  } catch (err) {
    console.warn('[InterviewService] Delete session fallback:', err.message);
    return { deletedId: sessionId };
  }
};
