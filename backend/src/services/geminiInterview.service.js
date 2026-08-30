import { GoogleGenAI } from '@google/genai';

/**
 * Gemini AI Interview Service for The TaxMan's Capital
 * Production-grade CA & ACCA interview engine supporting:
 * - Real-time conversational context & adaptive phase progression
 * - Dynamic question generation (Technical, Scenario-based, Behavioral, Partner)
 * - Real-time turn evaluation & scoring
 * - Comprehensive final scorecard generation (0-100 scale)
 * - Safe JSON extraction & resilient domain fallback
 */

const getApiKey = () => {
  return process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '';
};

// Initialize GenAI client safely
let genAIClient = null;
const getGenAI = () => {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
};

// Clean and safely parse JSON from AI responses (handles codeblocks, backticks, extra text)
const cleanAndParseJson = (rawText, fallbackObj) => {
  if (!rawText) return fallbackObj;
  try {
    let text = rawText.trim();
    // Remove markdown code blocks ```json ... ```
    if (text.includes('```')) {
      const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match && match[1]) {
        text = match[1].trim();
      }
    }
    // Attempt standard JSON parse
    return JSON.parse(text);
  } catch (err) {
    try {
      // Find first '{' and last '}'
      const firstBrace = rawText.indexOf('{');
      const lastBrace = rawText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        const jsonSubstring = rawText.substring(firstBrace, lastBrace + 1);
        return JSON.parse(jsonSubstring);
      }
    } catch (innerErr) {
      console.warn('[GeminiInterviewService] JSON extraction failed, using fallback:', innerErr.message);
    }
    return fallbackObj;
  }
};

export class GeminiInterviewService {
  /**
   * System Prompt Generator tailored to CA/ACCA roles and Big 4 style standards
   */
  static buildSystemPrompt({ targetRole, interviewStage, difficulty, interviewType, totalQuestions }) {
    return `You are an experienced Senior Audit Manager / Partner conducting a professional Big 4-style simulated interview for "The TaxMan's Capital" — a career platform for CA (ICAP) & ACCA aspirants.

Candidate Context:
- Target Role: ${targetRole || 'Audit Trainee (Articleship)'}
- Interview Stage: ${interviewStage || 'Manager Technical Round'}
- Difficulty Level: ${difficulty || 'Intermediate'}
- Interview Type: ${interviewType || 'Technical'}
- Total Questions Target: ${totalQuestions || 5}

Behavioral & Tone Guidelines:
1. Professional, calm, respectful, intelligent, adaptive, challenging, concise, and conversational.
2. DO NOT behave like a generic chatbot. Avoid constantly saying "Great answer!", "Awesome!", or excessive flattery.
3. Acknowledge candidate responses concisely and naturally (e.g. "Good. Let's take that one step further", "Understood. Now let's explore...", "You mentioned materiality; how does that apply when...").
4. Adapt intelligently: If the candidate is technically strong, elevate the complexity (e.g., ISA 315/330, IFRS 15/16, IAS 36, fraud risk). If incomplete or incorrect, ask targeted probing or clarifying questions.
5. Emphasize CA/ACCA standards (IFRS, ISA, ICAP Code of Ethics, FBR tax regulations, professional skepticism, internal controls).
6. Progress naturally through interview phases:
   - Phase 1: Professional greeting & introduction
   - Phase 2: Academic background & career motivation
   - Phase 3: Core technical questions
   - Phase 4: Practical scenario / judgment question
   - Phase 5: Probing / follow-up question
   - Phase 6: Ethics & professional skepticism
   - Phase 7: Professional conclusion
7. Keep each spoken interviewer utterance concise (2-4 sentences max) for clear speech delivery.`;
  }

  /**
   * Generate Initial Greeting & Question 1
   */
  static async startInterviewSession({ targetRole, interviewStage, difficulty, interviewType, totalQuestions }) {
    const ai = getGenAI();
    const systemPrompt = this.buildSystemPrompt({ targetRole, interviewStage, difficulty, interviewType, totalQuestions });

    if (ai) {
      try {
        const prompt = `${systemPrompt}

Task: Begin the interview.
Provide a professional, welcoming greeting that introduces yourself, sets expectations for the ${interviewStage}, and immediately asks the first question (Phase 1/2: Introduction, candidate background, or motivation).

Do not output bullet points or meta tags. Output only the natural spoken text of the interviewer.`;

        const response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: prompt,
          config: {
            temperature: 0.7,
            maxOutputTokens: 300
          }
        });

        const initialSpeech = response.text?.trim();
        if (initialSpeech) {
          return {
            greeting: initialSpeech,
            questionNumber: 1,
            questionText: initialSpeech
          };
        }
      } catch (err) {
        console.warn('[GeminiInterviewService] startInterviewSession API fallback:', err.message);
      }
    }

    // High quality domain fallback
    const roleTitles = {
      'Audit Trainee': 'Audit Trainee (Articleship)',
      'Tax Assistant': 'Tax Advisory Assistant',
      'Financial Analyst': 'Financial Analyst'
    };
    const displayRole = roleTitles[targetRole] || targetRole || 'Audit Trainee';

    const fallbackGreeting = `Good morning and welcome to your simulated ${interviewStage} for the ${displayRole} role at The TaxMan's Capital. I will be conducting your interview today. Please answer each question naturally and clearly. To begin, could you please introduce yourself, state your academic background, and share what motivated you to pursue a career in this field?`;

    return {
      greeting: fallbackGreeting,
      questionNumber: 1,
      questionText: fallbackGreeting
    };
  }

  /**
   * Evaluate Candidate Turn and Generate Next Adaptive Question
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
    conversationHistory = []
  }) {
    const ai = getGenAI();
    const nextQuestionNum = currentQuestionIndex + 2;
    const isLastQuestion = nextQuestionNum > totalQuestions;

    if (ai) {
      try {
        const historySnippet = conversationHistory
          .map((m) => `${m.speaker === 'ai' ? 'INTERVIEWER' : 'CANDIDATE'}: ${m.text}`)
          .join('\n\n');

        const systemPrompt = this.buildSystemPrompt({ targetRole, interviewStage, difficulty, interviewType, totalQuestions });

        const prompt = `${systemPrompt}

Current Conversation Context:
${historySnippet}

Current Question (Q${currentQuestionIndex + 1}):
"${currentQuestion}"

Candidate's Answer:
"${candidateAnswer}"

Target Question Count: ${totalQuestions}
Current Question Index: ${currentQuestionIndex + 1}
Is this the final question of the interview?: ${isLastQuestion ? 'YES' : 'NO'}

Tasks:
1. Evaluate the candidate's answer on technical accuracy, relevance, clarity, and completeness (Scores 0-100).
2. If this is NOT the last question (${!isLastQuestion}):
   - Provide a natural conversational transition (1 sentence).
   - Generate the next dynamic, adaptive Question ${nextQuestionNum}.
   - Adapt difficulty and topic based on candidate's performance. Avoid repeating previous questions.
3. If this IS the last question (${isLastQuestion}):
   - Provide a warm, professional closing statement concluding the interview.

Return ONLY a valid JSON object matching this exact schema:
{
  "turnEvaluation": {
    "score": 85,
    "technicalAccuracy": 85,
    "relevance": 90,
    "clarity": 80,
    "completeness": 80,
    "feedback": "Concise 1-2 sentence feedback on candidate answer.",
    "idealAnswerPoints": ["Key point 1", "Key point 2"]
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
              candidateAnswer,
              score: Number(parsed.turnEvaluation.score) || 75,
              technicalAccuracy: Number(parsed.turnEvaluation.technicalAccuracy) || 75,
              relevance: Number(parsed.turnEvaluation.relevance) || 80,
              clarity: Number(parsed.turnEvaluation.clarity) || 80,
              completeness: Number(parsed.turnEvaluation.completeness) || 70,
              feedback: parsed.turnEvaluation.feedback || 'Good attempt with relevant points.',
              idealAnswerPoints: Array.isArray(parsed.turnEvaluation.idealAnswerPoints)
                ? parsed.turnEvaluation.idealAnswerPoints
                : ['Clear standard reference', 'Practical application']
            },
            interviewerReply: parsed.interviewerReply.trim(),
            isInterviewComplete: Boolean(parsed.isInterviewComplete)
          };
        }
      } catch (err) {
        console.warn('[GeminiInterviewService] processCandidateAnswer API fallback:', err.message);
      }
    }

    // Domain Fallback Engine
    const words = (candidateAnswer || '').trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    let baseScore = wordCount > 25 ? 82 : wordCount > 10 ? 72 : 55;

    const roleBank = {
      1: "Under ISA 330, can you explain how you distinguish between Substantive Testing and Tests of Controls?",
      2: "Suppose during an audit you identify an unrecorded material liability right before year-end closing. How would you handle this scenario?",
      3: "How do you evaluate Going Concern risk under ISA 570 when a client shows consecutive operating losses?",
      4: "Describe a situation where you had to uphold professional skepticism and ethical integrity when challenged.",
      5: "Where do you see your professional career progressing over the next 3 to 5 years?"
    };

    const nextQ = roleBank[nextQuestionNum] || `Can you provide a practical example of how you apply professional standards to solve complex accounting problems?`;
    const nextReply = isLastQuestion
      ? "Thank you very much. That concludes your simulated interview. Your responses have been recorded and your performance scorecard is now being prepared."
      : `Thank you for that response. Let's move to our next question: ${nextQ}`;

    return {
      turnEvaluation: {
        questionNumber: currentQuestionIndex + 1,
        question: currentQuestion,
        candidateAnswer,
        score: baseScore,
        technicalAccuracy: baseScore,
        relevance: Math.min(100, baseScore + 5),
        clarity: Math.min(100, baseScore + 2),
        completeness: Math.max(50, baseScore - 5),
        feedback: wordCount > 20
          ? 'Clear and structured answer demonstrating relevant understanding of key concepts.'
          : 'Answer was brief. Elaborate on practical procedures and standard references for higher marks.',
        idealAnswerPoints: [
          'Direct identification of standard principles',
          'Mention of practical audit/accounting impact',
          'Clear, articulate terminology'
        ]
      },
      interviewerReply: nextReply,
      isInterviewComplete: isLastQuestion
    };
  }

  /**
   * Final Comprehensive Scorecard Generator (0-100 scale)
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

    if (ai) {
      try {
        const transcriptText = transcript
          .map((t) => `[${t.speaker.toUpperCase()}] (${new Date(t.timestamp).toLocaleTimeString()}): ${t.text}`)
          .join('\n');

        const evalsSummary = questionEvaluations
          .map(
            (q) =>
              `Question ${q.questionNumber}: "${q.question}"\nCandidate Answer: "${q.candidateAnswer}"\nTurn Score: ${q.score}/100\nFeedback: ${q.feedback}`
          )
          .join('\n\n');

        const prompt = `You are a Big 4 Partner evaluating a completed simulated interview for "The TaxMan's Capital" career platform.

Interview Context:
- Target Role: ${targetRole}
- Stage: ${interviewStage}
- Difficulty: ${difficulty}
- Type: ${interviewType}

Transcript:
${transcriptText}

Turn Evaluations:
${evalsSummary}

Candidate Speech Metrics:
- Average Pace: ${metrics.avgWpm || 125} WPM
- Filler Words: ${metrics.totalFillers || 0}
- Total Duration: ${metrics.totalDuration || 600} seconds

Generate a comprehensive, realistic Big 4 partner evaluation. All numerical scores must be integers between 0 and 100.

Return ONLY a valid JSON object matching this EXACT schema:
{
  "overallScore": 84,
  "technicalKnowledge": 85,
  "communication": 82,
  "answerRelevance": 88,
  "clarity": 80,
  "problemSolving": 83,
  "professionalism": 90,
  "confidenceIndicator": 82,
  "strengths": [
    "Strong conceptual understanding of ISA and IFRS frameworks",
    "Structured, professional communication composure",
    "Good awareness of professional ethics and skepticism"
  ],
  "weaknesses": [
    "Could provide more specific substantive audit procedures",
    "Pacing occasionally rushed during technical explanations"
  ],
  "recommendations": [
    "Deepen knowledge of ISA 315 risk assessment and internal control matrices",
    "Practice articulating IFRS 15 5-step revenue models with numerical examples",
    "Maintain steady pace and pause briefly before answering complex scenario questions"
  ],
  "technicalGaps": [
    "Detailed substantive sampling techniques under ISA 530",
    "Deferred tax calculations under IAS 12"
  ],
  "questionEvaluations": ${JSON.stringify(questionEvaluations)},
  "finalAssessment": "Candidate demonstrated solid baseline readiness with strong professional presence and good technical instincts. Highly competitive for articleship intake.",
  "interviewSummary": "Completed a full simulated ${interviewStage} covering technical accounting/audit concepts, scenario judgment, and career motivation.",
  "hiringRecommendation": "Strong Candidate - Recommended for Induction"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: prompt,
          config: {
            temperature: 0.5,
            maxOutputTokens: 1200,
            responseMimeType: 'application/json'
          }
        });

        const scorecard = cleanAndParseJson(response.text, null);
        if (scorecard && typeof scorecard.overallScore === 'number') {
          // Ensure all required properties exist
          return {
            overallScore: Math.min(100, Math.max(0, Math.round(scorecard.overallScore))),
            technicalKnowledge: Math.min(100, Math.max(0, Math.round(scorecard.technicalKnowledge || scorecard.overallScore))),
            communication: Math.min(100, Math.max(0, Math.round(scorecard.communication || 80))),
            answerRelevance: Math.min(100, Math.max(0, Math.round(scorecard.answerRelevance || 80))),
            clarity: Math.min(100, Math.max(0, Math.round(scorecard.clarity || 80))),
            problemSolving: Math.min(100, Math.max(0, Math.round(scorecard.problemSolving || 80))),
            professionalism: Math.min(100, Math.max(0, Math.round(scorecard.professionalism || 85))),
            confidenceIndicator: Math.min(100, Math.max(0, Math.round(scorecard.confidenceIndicator || 80))),
            strengths: Array.isArray(scorecard.strengths) && scorecard.strengths.length > 0
              ? scorecard.strengths
              : ['Strong technical awareness', 'Professional composure'],
            weaknesses: Array.isArray(scorecard.weaknesses) && scorecard.weaknesses.length > 0
              ? scorecard.weaknesses
              : ['Expand on practical case studies'],
            recommendations: Array.isArray(scorecard.recommendations) && scorecard.recommendations.length > 0
              ? scorecard.recommendations
              : ['Review standard audit assertions and documentation requirements'],
            technicalGaps: Array.isArray(scorecard.technicalGaps)
              ? scorecard.technicalGaps
              : ['Advanced IFRS disclosures'],
            questionEvaluations: Array.isArray(scorecard.questionEvaluations) && scorecard.questionEvaluations.length > 0
              ? scorecard.questionEvaluations
              : questionEvaluations,
            finalAssessment: scorecard.finalAssessment || 'Solid performance showing high potential for professional training.',
            interviewSummary: scorecard.interviewSummary || `Completed simulated ${interviewStage} for ${targetRole}.`,
            hiringRecommendation: scorecard.hiringRecommendation || 'Recommended for Articleship'
          };
        }
      } catch (err) {
        console.warn('[GeminiInterviewService] generateFinalScorecard API fallback:', err.message);
      }
    }

    // Fallback Scorecard Calculation
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
      communication: Math.min(100, avgScore - 2),
      answerRelevance: Math.min(100, avgScore + 3),
      clarity: Math.min(100, avgScore),
      problemSolving: Math.min(100, avgScore + 1),
      professionalism: Math.min(100, avgScore + 5),
      confidenceIndicator: Math.min(100, avgScore - 1),
      strengths: [
        'Good grasp of fundamental CA/ACCA concepts and accounting standards',
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
      finalAssessment: `Candidate exhibited solid baseline preparation for the ${targetRole} position, demonstrating good reasoning and professional presence.`,
      interviewSummary: `Completed ${evals.length} questions in ${interviewStage} (${difficulty} difficulty).`,
      hiringRecommendation: hiringVerdict
    };
  }
}
