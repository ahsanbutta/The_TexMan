import mongoose from 'mongoose';

const interviewMessageSchema = new mongoose.Schema(
  {
    speaker: {
      type: String,
      enum: ['ai', 'candidate', 'system'],
      required: true
    },
    text: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    duration: {
      type: Number,
      default: 0
    },
    metrics: {
      wpm: Number,
      fillerCount: Number,
      wordCount: Number
    }
  },
  { _id: false }
);

const questionEvaluationSchema = new mongoose.Schema(
  {
    questionNumber: {
      type: Number,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    candidateAnswer: {
      type: String,
      default: ''
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    technicalAccuracy: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    relevance: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    clarity: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    completeness: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    feedback: {
      type: String,
      default: ''
    },
    idealAnswerPoints: {
      type: [String],
      default: []
    }
  },
  { _id: false }
);

const interviewEvaluationSchema = new mongoose.Schema(
  {
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    technicalKnowledge: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    communication: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    answerRelevance: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    clarity: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    problemSolving: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    professionalism: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    confidenceIndicator: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    strengths: {
      type: [String],
      default: []
    },
    weaknesses: {
      type: [String],
      default: []
    },
    recommendations: {
      type: [String],
      default: []
    },
    technicalGaps: {
      type: [String],
      default: []
    },
    finalAssessment: {
      type: String,
      default: ''
    },
    interviewSummary: {
      type: String,
      default: ''
    },
    hiringRecommendation: {
      type: String,
      default: 'Needs Further Review'
    }
  },
  { _id: false }
);

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    targetRole: {
      type: String,
      required: true,
      default: 'Audit Trainee'
    },
    interviewStage: {
      type: String,
      required: true,
      default: 'Manager Technical Round'
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate'
    },
    interviewType: {
      type: String,
      enum: ['Technical', 'Behavioral', 'HR', 'Mixed', 'Scenario Based'],
      default: 'Technical'
    },
    questionCount: {
      type: Number,
      default: 5
    },
    duration: {
      type: Number, // In minutes
      default: 15
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress'
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date
    },
    currentQuestionIndex: {
      type: Number,
      default: 0
    },
    transcript: {
      type: [interviewMessageSchema],
      default: []
    },
    questionEvaluations: {
      type: [questionEvaluationSchema],
      default: []
    },
    evaluation: {
      type: interviewEvaluationSchema,
      default: null
    },
    metrics: {
      avgWpm: { type: Number, default: 0 },
      totalFillers: { type: Number, default: 0 },
      totalSpeakingTime: { type: Number, default: 0 },
      totalDuration: { type: Number, default: 0 }
    },
    // Backwards compatibility fields
    interviewRole: {
      type: String
    },
    interviewRound: {
      type: String
    },
    qualification: {
      type: String,
      default: 'CAF / ACCA'
    },
    overallScore: {
      type: String
    },
    technicalAccuracy: {
      type: String
    },
    confidenceScore: {
      type: String
    },
    strengths: {
      type: [String],
      default: []
    },
    weaknesses: {
      type: [String],
      default: []
    },
    recommendations: {
      type: String,
      default: ''
    },
    completed: {
      type: Boolean,
      default: false
    },
    questionsAndAnswers: [
      {
        questionId: Number,
        question: String,
        userAnswer: String,
        isCorrect: Boolean,
        matchedKeywords: [String],
        feedback: String,
        tip: String,
        scoreOutOf10: Number
      }
    ]
  },
  {
    timestamps: true
  }
);

// Sync legacy fields pre-save
interviewSessionSchema.pre('save', function (next) {
  if (this.targetRole && !this.interviewRole) {
    this.interviewRole = this.targetRole;
  }
  if (this.interviewStage && !this.interviewRound) {
    this.interviewRound = this.interviewStage;
  }
  if (this.status === 'completed') {
    this.completed = true;
    if (this.evaluation?.overallScore) {
      this.overallScore = `${Math.round(this.evaluation.overallScore / 10)} / 10`;
      this.technicalAccuracy = `${this.evaluation.technicalKnowledge || 85}%`;
      this.confidenceScore = this.evaluation.confidenceIndicator >= 80 ? 'Exceptional' : 'Strong';
    }
  }
  next();
});

export const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);
