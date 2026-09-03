import { GoogleGenAI } from '@google/genai';
import { QUESTION_BANK, getQuestionsForInterview } from '../data/questionBank.js';

/**
 * Gemini AI Interview Service for The TaxMan's Capital
 * Realistic CA & ACCA Physical Interview Simulator Engine supporting:
 * - 324-question structured bank extraction from CA_Firms_FAQ_Interview.html
 * - Single Interviewer & Two-Agent Panel Modes (Senior Audit Manager & HR Manager)
 * - Conversational context & adaptive follow-up probing
 * - Real-time turn evaluation with standard ideal answer points
 * - Non-invasive speech and camera behavioral metric incorporation
 * - Comprehensive 0-100 Big 4 Partner evaluation scorecard
 */

const getApiKey = () => {
  return process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '';
};

let genAIClient = null;
const getGenAI = () => {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
};

const cleanAndParseJson = (rawText, fallbackObj) => {
  if (!rawText) return fallbackObj;
  try {
    let text = rawText.trim();
    if (text.includes('```')) {
      const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match && match[1]) {
        text = match[1].trim();
      }
    }
    return JSON.parse(text);
  } catch (err) {
    try {
      const firstBrace = rawText.indexOf('{');
      const lastBrace = rawText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        const jsonSubstring = rawText.substring(firstBrace, lastBrace + 1);
        return JSON.parse(jsonSubstring);
      }
    } catch (innerErr) {
      console.warn('[GeminiInterviewService] JSON extraction fallback:', innerErr.message);
    }
    return fallbackObj;
  }
};

export class GeminiInterviewService {
  /**
   * Builds system prompt grounded in CA/ACCA standards and structured question context
   */
  static buildSystemPrompt({
    targetRole = 'Audit Trainee (Articleship)',
    interviewStage = 'Manager Technical Round',
    difficulty = 'Intermediate',
    interviewType = 'Technical',
    totalQuestions = 5,
    panelMode = false,
    currentSpeakerRole = 'Senior Audit Manager (Technical)'
  }) {
    const isPanel = Boolean(panelMode);

    return `You are conducting a realistic CA (ICAP) / ACCA simulated physical interview for "The TaxMan's Capital".

Role & Candidate Context:
- Target Role: ${targetRole}
- Interview Stage: ${interviewStage}
- Difficulty: ${difficulty}
- Interview Type: ${interviewType}
- Target Question Count: ${totalQuestions}
- Panel Mode: ${isPanel ? 'ACTIVE (Two-Agent Interview Panel)' : 'Single Interviewer Mode'}
- Current Interviewer Identity: ${currentSpeakerRole}

Interviewer Personas:
1. Senior Audit Manager / Technical Partner: Sharp, professional, evaluates technical accuracy under IFRS/ISA/Tax laws, asks practical audit scenarios, probing follow-ups, and tests professional skepticism.
2. HR & Behavioral Lead: Observant, professional, evaluates communication, teamwork, pressure handling, ethical dilemmas, and motivation using STAR principles.

Behavioral Guidelines:
1. Professional, calm, respectful, corporate, conversational, and direct.
2. Avoid generic chatbot greetings ("Great job!", "Awesome!"). Acknowledge answers concisely before moving forward.
3. Emphasize standard CA/ACCA frameworks: IFRS (IFRS 15, 16, 9, IAS 36, 12, 1, 2), ISA (ISA 315, 330, 500, 570, 700, 240), Income Tax Ordinance 2001, Sales Tax Act, Companies Act 2017, and the ICAP/IESBA Code of Ethics.
4. Keep spoken interviewer dialogue natural and concise (2-3 sentences max) for clear speech delivery.`;
  }

  /**
   * Start Interview Session with grounded greeting and Question 1
   */
  static async startInterviewSession({
    targetRole = 'Audit Trainee (Articleship)',
    interviewStage = 'Manager Technical Round',
    difficulty = 'Intermediate',
    interviewType = 'Technical',
    totalQuestions = 5,
    panelMode = false
  }) {
    const selectedBankQuestions = getQuestionsForInterview({
      targetRole,
      interviewStage,
      difficulty,
      interviewType,
      count: totalQuestions
    });

    const q1 = selectedBankQuestions[0] || {
      question: 'To begin, please introduce yourself, state your academic background, and share why you chose to pursue CA / ACCA.',
      idealAnswerPoints: ['Clear background overview', 'Motivation for professional qualification', 'Relevant achievements']
    };

    const speakerRole = panelMode ? 'Senior Audit Manager (Technical)' : 'Senior Interviewer';
    const speakerName = panelMode ? 'Asim Raza (Audit Manager)' : 'Interview Panelist';

    const ai = getGenAI();
    if (ai) {
      try {
        const systemPrompt = this.buildSystemPrompt({
          targetRole,
          interviewStage,
          difficulty,
          interviewType,
          totalQuestions,
          panelMode,
          currentSpeakerRole: speakerRole
        });

        const prompt = `${systemPrompt}

Task: Begin the interview.
Question 1 to ask: "${q1.question}"

Generate a crisp, professional spoken opening (2-3 sentences). Introduce yourself and state the purpose of the ${interviewStage}, then ask Question 1.
Do not output meta-tags or markdown formatting. Output only spoken words.`;

        const response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: prompt,
          config: {
            temperature: 0.65,
            maxOutputTokens: 250
          }
        });

        const text = response.text?.trim();
        if (text) {
          return {
            greeting: text,
            questionNumber: 1,
            questionText: text,
            currentSpeaker: {
              role: speakerRole,
              name: speakerName
            },
            bankQuestions: selectedBankQuestions
          };
        }
      } catch (err) {
        console.warn('[GeminiInterviewService] startInterviewSession fallback:', err.message);
      }
    }

    const fallbackGreeting = `Good morning. Welcome to your simulated ${interviewStage} for the ${targetRole} position at The TaxMan's Capital. I will be leading your session today. Let's begin: ${q1.question}`;

    return {
      greeting: fallbackGreeting,
      questionNumber: 1,
      questionText: fallbackGreeting,
      currentSpeaker: {
        role: speakerRole,
        name: speakerName
      },
      bankQuestions: selectedBankQuestions
    };
  }

  /**
   * Evaluate Candidate Turn, determine follow-up necessity, and generate next turn
   */
  static async processCandidateAnswer({
    targetRole,
    interviewStage,
    difficulty,
    interviewType,
    totalQuestions,
    currentQuestionIndex,
    currentQuestion,
    candidateAnswer,
    conversationHistory = [],
    bankQuestions = [],
    panelMode = false
  }) {
    const ai = getGenAI();
    const nextQuestionNum = currentQuestionIndex + 2;
    const isLastQuestion = nextQuestionNum > totalQuestions;

    // Alternate speakers in panel mode
    const isTechnicalTurn = currentQuestionIndex % 2 === 0;
    const speakerRole = panelMode
      ? isTechnicalTurn
        ? 'HR Manager (Behavioral & Culture)'
        : 'Senior Audit Manager (Technical)'
      : 'Senior Interviewer';

    const speakerName = panelMode
      ? isTechnicalTurn
        ? 'Sana Malik (Talent Lead)'
        : 'Asim Raza (Audit Manager)'
      : 'Interview Panelist';

    // Reference question bank item if available
    const nextBankItem = (bankQuestions && bankQuestions[currentQuestionIndex + 1]) || null;
    const currentBankItem = (bankQuestions && bankQuestions[currentQuestionIndex]) || null;

    if (ai) {
      try {
        const historySnippet = conversationHistory
          .map((m) => `[${m.speaker.toUpperCase()}]: ${m.text}`)
          .join('\n\n');

        const systemPrompt = this.buildSystemPrompt({
          targetRole,
          interviewStage,
          difficulty,
          interviewType,
          totalQuestions,
          panelMode,
          currentSpeakerRole: speakerRole
        });

        const prompt = `${systemPrompt}

Conversation History:
${historySnippet}

Current Question (Q${currentQuestionIndex + 1}):
"${currentQuestion}"

Target Reference Ideal Concepts:
${currentBankItem ? JSON.stringify(currentBankItem.idealAnswerPoints) : '["Conceptual accuracy", "Standard application", "Clear professional reasoning"]'}

Candidate's Spoken Answer:
"${candidateAnswer || '[No verbal response provided]'}"

Next Planned Question:
"${nextBankItem ? nextBankItem.question : 'General scenario question'}"

Is Final Question?: ${isLastQuestion ? 'YES' : 'NO'}

Evaluation & Response Tasks:
1. Evaluate candidate's answer (Technical accuracy 0-100, Relevance 0-100, Clarity 0-100, Completeness 0-100).
2. If candidate answer was too vague/incomplete and question index < ${totalQuestions - 1}, you may ask a brief clarifying follow-up question before advancing.
3. If this is NOT the last question, provide a natural transition acknowledging the answer and ask the next question spoken by ${speakerName} (${speakerRole}).
4. If this IS the last question, provide a professional conclusion concluding the interview.

Return ONLY a valid JSON object matching this schema:
{
  "turnEvaluation": {
    "score": 82,
    "technicalAccuracy": 85,
    "relevance": 85,
    "clarity": 80,
    "completeness": 78,
    "feedback": "Concise 1-2 sentence assessment of candidate response.",
    "idealAnswerPoints": ["Key principle", "Practical procedure"]
  },
  "interviewerReply": "Spoken text that the interviewer will say next (transition + next question OR closing statement)",
  "isInterviewComplete": ${isLastQuestion}
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: prompt,
          config: {
            temperature: 0.6,
            maxOutputTokens: 600,
            responseMimeType: 'application/json'
          }
        });

        const parsed = cleanAndParseJson(response.text, null);
        if (parsed && parsed.turnEvaluation && parsed.interviewerReply) {
          return {
            turnEvaluation: {
              questionNumber: currentQuestionIndex + 1,
              question: currentQuestion,
              candidateAnswer: candidateAnswer || '(No answer provided)',
              score: Number(parsed.turnEvaluation.score) || 75,
              technicalAccuracy: Number(parsed.turnEvaluation.technicalAccuracy) || 75,
              relevance: Number(parsed.turnEvaluation.relevance) || 80,
              clarity: Number(parsed.turnEvaluation.clarity) || 80,
              completeness: Number(parsed.turnEvaluation.completeness) || 70,
              feedback: parsed.turnEvaluation.feedback || 'Good articulation of core principles.',
              idealAnswerPoints: Array.isArray(parsed.turnEvaluation.idealAnswerPoints)
                ? parsed.turnEvaluation.idealAnswerPoints
                : currentBankItem?.idealAnswerPoints || ['Standard principles', 'Practical audit procedures']
            },
            interviewerReply: parsed.interviewerReply.trim(),
            currentSpeaker: {
              role: speakerRole,
              name: speakerName
            },
            isInterviewComplete: Boolean(parsed.isInterviewComplete)
          };
        }
      } catch (err) {
        console.warn('[GeminiInterviewService] processCandidateAnswer API fallback:', err.message);
      }
    }

    // Domain Fallback
    const words = (candidateAnswer || '').trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    let baseScore = wordCount > 25 ? 82 : wordCount > 10 ? 70 : 55;

    const fallbackNextQ = nextBankItem?.question || "Can you share how you ensure compliance with ethical principles when working under tight audit deadlines?";
    const nextReply = isLastQuestion
      ? "Thank you for your time and comprehensive responses. That concludes your simulated interview. Your performance scorecard and analytics report are now being prepared."
      : `Thank you for that response. ${panelMode ? `${speakerName} here.` : ''} Let's proceed to the next question: ${fallbackNextQ}`;

    return {
      turnEvaluation: {
        questionNumber: currentQuestionIndex + 1,
        question: currentQuestion,
        candidateAnswer: candidateAnswer || '(No answer provided)',
        score: baseScore,
        technicalAccuracy: baseScore,
        relevance: Math.min(100, baseScore + 4),
        clarity: Math.min(100, baseScore + 2),
        completeness: Math.max(50, baseScore - 4),
        feedback: wordCount > 20
          ? 'Clear and structured answer demonstrating relevant understanding of core principles.'
          : 'Answer was brief. Elaborate on practical procedures and standard references for higher marks.',
        idealAnswerPoints: currentBankItem?.idealAnswerPoints || [
          'Direct identification of standard principles',
          'Mention of practical audit/accounting impact'
        ]
      },
      interviewerReply: nextReply,
      currentSpeaker: {
        role: speakerRole,
        name: speakerName
      },
      isInterviewComplete: isLastQuestion
    };
  }

  /**
   * Final Comprehensive Scorecard Generator
   */
  static async generateFinalScorecard({
    targetRole,
    interviewStage,
    difficulty,
    interviewType,
    transcript = [],
    questionEvaluations = [],
    metrics = {}
  }) {
    const ai = getGenAI();

    // Compute speech & camera derived weights
    const avgWpm = Number(metrics.avgWpm) || 130;
    const fillerCount = Number(metrics.totalFillers) || 0;
    const cameraEngagement = Number(metrics.cameraEngagement) || 82;
    const postureStability = Number(metrics.postureStability) || 80;
    const presenceScore = Number(metrics.presenceScore) || 85;

    if (ai) {
      try {
        const transcriptText = transcript
          .map((t) => `[${t.speaker.toUpperCase()}]: ${t.text}`)
          .join('\n');

        const evalsSummary = questionEvaluations
          .map(
            (q) =>
              `Question ${q.questionNumber}: "${q.question}"\nCandidate: "${q.candidateAnswer}"\nScore: ${q.score}/100\nFeedback: ${q.feedback}`
          )
          .join('\n\n');

        const prompt = `You are a Big 4 Partner evaluating a completed simulated interview for "The TaxMan's Capital".

Context:
- Target Role: ${targetRole}
- Stage: ${interviewStage}
- Difficulty: ${difficulty}
- Type: ${interviewType}

Transcript:
${transcriptText}

Turn Evaluations:
${evalsSummary}

Candidate Speech & Behavioral Analytics:
- Speaking Pace: ${avgWpm} WPM
- Filler Words Count: ${fillerCount}
- Camera Engagement: ${cameraEngagement}/100
- Posture Stability: ${postureStability}/100
- Presence Score: ${presenceScore}/100

Generate a comprehensive Big 4 partner evaluation. All scores must be integers between 0 and 100.
Delivery Confidence must be computed strictly from observable communication signals (speech fluency, pace, filler frequency, pause consistency).
Interview Presence must be computed strictly from observable engagement (camera focus, posture stability, presence in frame) without any physical appearance bias.

Return ONLY a valid JSON object matching this EXACT schema:
{
  "overallScore": 83,
  "technicalKnowledge": 85,
  "answerQuality": 84,
  "communication": 80,
  "confidenceIndicator": 78,
  "professionalism": 90,
  "interviewPresence": 82,
  "strengths": [
    "Strong conceptual grasp of relevant IFRS / ISA standards",
    "Composed, professional communication delivery",
    "Good awareness of professional ethics and skepticism"
  ],
  "weaknesses": [
    "Could provide more specific substantive procedures",
    "Moderate use of filler words during technical explanations"
  ],
  "recommendations": [
    "Review ISA 315 risk identification matrices",
    "Practice structured STAR responses for situational questions",
    "Maintain steady speaking cadence under 140 WPM"
  ],
  "technicalGaps": [
    "Substantive sampling techniques under ISA 530",
    "Specific tax adjustments under Income Tax Ordinance 2001"
  ],
  "questionEvaluations": ${JSON.stringify(questionEvaluations)},
  "speechAnalytics": {
    "avgWpm": ${avgWpm},
    "fillerWordsCount": ${fillerCount},
    "speakingPaceFeedback": "Speaking pace was well modulated and natural."
  },
  "cameraAnalytics": {
    "cameraEngagement": ${cameraEngagement},
    "postureStability": ${postureStability},
    "presenceScore": ${presenceScore},
    "behavioralFeedback": "Maintained attentive screen presence and steady posture throughout the session."
  },
  "weakAreaTopics": ["Audit Risk Assessment", "Deferred Taxation", "Behavioral Conflict Resolution"],
  "finalAssessment": "Candidate demonstrated solid baseline readiness and professional aptitude, showing high potential for intake.",
  "interviewSummary": "Completed full simulated ${interviewStage} covering core technical accounting/audit standards and professional situational judgment.",
  "hiringRecommendation": "Strong Candidate - Recommended for Induction"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: prompt,
          config: {
            temperature: 0.45,
            maxOutputTokens: 1400,
            responseMimeType: 'application/json'
          }
        });

        const scorecard = cleanAndParseJson(response.text, null);
        if (scorecard && typeof scorecard.overallScore === 'number') {
          return {
            overallScore: Math.min(100, Math.max(0, Math.round(scorecard.overallScore))),
            technicalKnowledge: Math.min(100, Math.max(0, Math.round(scorecard.technicalKnowledge || scorecard.overallScore))),
            answerQuality: Math.min(100, Math.max(0, Math.round(scorecard.answerQuality || scorecard.overallScore))),
            communication: Math.min(100, Math.max(0, Math.round(scorecard.communication || 80))),
            confidenceIndicator: Math.min(100, Math.max(0, Math.round(scorecard.confidenceIndicator || 80))),
            professionalism: Math.min(100, Math.max(0, Math.round(scorecard.professionalism || 88))),
            interviewPresence: Math.min(100, Math.max(0, Math.round(scorecard.interviewPresence || presenceScore))),
            strengths: Array.isArray(scorecard.strengths) && scorecard.strengths.length > 0
              ? scorecard.strengths
              : ['Strong technical awareness', 'Professional demeanor'],
            weaknesses: Array.isArray(scorecard.weaknesses) && scorecard.weaknesses.length > 0
              ? scorecard.weaknesses
              : ['Elaborate with practical case examples'],
            recommendations: Array.isArray(scorecard.recommendations) && scorecard.recommendations.length > 0
              ? scorecard.recommendations
              : ['Practice concise point-explanation-example structure'],
            technicalGaps: Array.isArray(scorecard.technicalGaps)
              ? scorecard.technicalGaps
              : ['ISA 315 internal control testing'],
            questionEvaluations: Array.isArray(scorecard.questionEvaluations) && scorecard.questionEvaluations.length > 0
              ? scorecard.questionEvaluations
              : questionEvaluations,
            speechAnalytics: scorecard.speechAnalytics || {
              avgWpm,
              fillerWordsCount: fillerCount,
              speakingPaceFeedback: 'Balanced and clear articulation.'
            },
            cameraAnalytics: scorecard.cameraAnalytics || {
              cameraEngagement,
              postureStability,
              presenceScore,
              behavioralFeedback: 'Candidate remained visible and engaged during all response turns.'
            },
            weakAreaTopics: Array.isArray(scorecard.weakAreaTopics) && scorecard.weakAreaTopics.length > 0
              ? scorecard.weakAreaTopics
              : ['Audit Risk Assessment', 'IFRS Standards'],
            finalAssessment: scorecard.finalAssessment || 'Solid performance showing high potential for professional training.',
            interviewSummary: scorecard.interviewSummary || `Completed simulated ${interviewStage} for ${targetRole}.`,
            hiringRecommendation: scorecard.hiringRecommendation || 'Recommended for Articleship'
          };
        }
      } catch (err) {
        console.warn('[GeminiInterviewService] generateFinalScorecard API fallback:', err.message);
      }
    }

    // High quality Fallback Scorecard Calculation
    const evals = questionEvaluations.length > 0 ? questionEvaluations : [];
    const avgScore = evals.length > 0
      ? Math.round(evals.reduce((acc, q) => acc + (q.score || 75), 0) / evals.length)
      : 82;

    const hiringVerdict =
      avgScore >= 85
        ? 'Top Tier - Strong Recommendation for Induction'
        : avgScore >= 75
        ? 'Solid Candidate - Recommended for Final Partner Interview'
        : avgScore >= 65
        ? 'Passable - Recommend Additional Technical Preparation'
        : 'Needs Improvement - Retake Simulated Practice';

    return {
      overallScore: avgScore,
      technicalKnowledge: Math.min(100, avgScore + 2),
      answerQuality: Math.min(100, avgScore + 1),
      communication: Math.min(100, avgScore - 2),
      confidenceIndicator: Math.min(100, avgScore - 1),
      professionalism: Math.min(100, avgScore + 5),
      interviewPresence: Math.min(100, presenceScore),
      strengths: [
        'Good grasp of fundamental CA/ACCA concepts and standard accounting frameworks',
        'Structured response delivery with clear professional demeanor',
        'Maintained composure during technical probing questions'
      ],
      weaknesses: [
        'Could include more direct citations of standard paragraph numbers (e.g. ISA 315/330, IFRS 15)',
        'Be more concise in initial overview before expanding into technical mechanics'
      ],
      recommendations: [
        'Practice time-boxed responses (under 90 seconds per technical scenario)',
        'Review standard substantive procedures for inventory, revenue, and bank balances',
        'Strengthen articulation of ethical frameworks under the ICAP / ACCA Code of Ethics'
      ],
      technicalGaps: [
        'Substantive testing of complex financial instruments',
        'Specific tax adjustments under Income Tax Ordinance 2001'
      ],
      questionEvaluations: evals,
      speechAnalytics: {
        avgWpm,
        fillerWordsCount: fillerCount,
        speakingPaceFeedback: avgWpm > 150 ? 'Pace was fast; practice pausing.' : 'Good natural speaking pace.'
      },
      cameraAnalytics: {
        cameraEngagement,
        postureStability,
        presenceScore,
        behavioralFeedback: 'Maintained consistent camera presence and stable posture.'
      },
      weakAreaTopics: ['Audit Risk Assessment', 'Revenue Recognition (IFRS 15)'],
      finalAssessment: `Candidate exhibited solid baseline preparation for the ${targetRole} position, demonstrating good reasoning and professional presence.`,
      interviewSummary: `Completed ${evals.length} questions in ${interviewStage} (${difficulty} difficulty).`,
      hiringRecommendation: hiringVerdict
    };
  }
}

export const geminiInterviewService = new GeminiInterviewService();
export default geminiInterviewService;
