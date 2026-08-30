/**
 * AI Service for The TaxMan's Capital
 * Provides replaceable, pluggable intelligence for:
 * 1. AI Study Tutor (Accounting standards, Tax, Audit, Law)
 * 2. Real-time AI Mock Interview Answer Evaluation & Scoring
 * 3. CV Builder Enhancement (Summary improvements, bullet points, skills suggestions)
 */

export class AiService {
  /**
   * 1. AI Study Tutor Response Generator
   */
  static async getStudyTutorResponse({ subject, query, history = [] }) {
    // If external AI key is set, can call Gemini or OpenAI API
    if (process.env.AI_API_KEY && process.env.AI_PROVIDER === 'gemini') {
      try {
        const fetch = (await import('node-fetch')).default || globalThis.fetch;
        const prompt = `You are a certified Senior CA/ACCA Tutor on "The TaxMan's Capital" platform in Pakistan. 
Subject: ${subject}
Student Question: ${query}
Explain with high technical clarity, referencing relevant IFRS / ISA / ICAP / ACCA rules and practical examples. Keep it structured and motivating.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.AI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
          }
        );
        const data = await response.json();
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }
      } catch (err) {
        console.warn('Gemini API call fallback to built-in intelligence engine:', err.message);
      }
    }

    // High quality domain-specific rule-based AI engine for CA/ACCA subjects
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('ias 16') || lowerQuery.includes('depreciation') || lowerQuery.includes('ppe')) {
      return `Under **IAS 16 (Property, Plant and Equipment)**:
1. **Initial Recognition:** Measured at cost including purchase price, import duties, and direct installation costs.
2. **Subsequent Measurement:** Choose between *Cost Model* (Cost - Acc. Depreciation - Impairment) or *Revaluation Model* (Fair value at revaluation date).
3. **Depreciation Commencement:** Begins when the asset is available for use in the condition intended by management.
💡 *Exam Tip:* Remember that land normally has an unlimited useful life and is not depreciated!`;
    }

    if (lowerQuery.includes('ifrs 15') || lowerQuery.includes('revenue')) {
      return `Under **IFRS 15 (Revenue from Contracts with Customers)**, follow the **5-Step Model**:
1. **Step 1:** Identify the contract with the customer.
2. **Step 2:** Identify the distinct performance obligations.
3. **Step 3:** Determine the transaction price.
4. **Step 4:** Allocate the transaction price to performance obligations based on relative standalone selling prices.
5. **Step 5:** Recognize revenue when (or as) the performance obligation is satisfied (over time or at a point in time).`;
    }

    if (lowerQuery.includes('substantive') || lowerQuery.includes('isa 330') || lowerQuery.includes('audit')) {
      return `Under **ISA 330 (The Auditor's Responses to Assessed Risks)**:
- **Tests of Controls:** Designed to evaluate the operating effectiveness of controls in preventing, detecting, and correcting material misstatements.
- **Substantive Procedures:** Designed to detect material misstatements at the assertion level. Comprises tests of details (transactions, account balances, disclosures) and substantive analytical procedures.
💡 *Key takeaway:* Regardless of the assessed risks of material misstatement, the auditor shall design and perform substantive procedures for each material class of transactions, account balance, and disclosure!`;
    }

    if (lowerQuery.includes('wacc') || lowerQuery.includes('cost of capital') || lowerQuery.includes('dcf')) {
      return `**Weighted Average Cost of Capital (WACC)**:
$$WACC = \\left(\\frac{E}{V} \\times K_e\\right) + \\left(\\frac{D}{V} \\times K_d \\times (1 - T)\\right)$$
Where:
- $K_e$ = Cost of Equity via CAPM ($R_f + \\beta(R_m - R_f)$)
- $K_d$ = Pre-tax cost of debt
- $T$ = Corporate tax rate in Pakistan (typically 29% + applicable super tax)
- $E/V, D/V$ = Market value weights of equity and debt in the capital structure.`;
    }

    return `Assalamu Alaikum! Regarding your question in **${subject}**:

To approach this standard concept for your CA/ACCA exams:
1. **Key Principle:** Always state the relevant standard definition and scope before jumping into numerical ledger entries or disclosures.
2. **Practical Audit Context:** Consider how external audit teams test this assertion (e.g. Completeness, Valuation, Existence).
3. **Common Trap:** Ensure adjustments are made net of tax consequences where applicable.

Feel free to ask a specific numerical scenario, calculation, or past paper case!`;
  }

  /**
   * 2. Real-time Mock Interview Answer Evaluator
   */
  static evaluateInterviewAnswer({ question, userAnswer, keywords = [], tip = '' }) {
    const trimmed = (userAnswer || '').trim();
    if (!trimmed) {
      return {
        isCorrect: false,
        scoreOutOf10: 2.0,
        matchedKeywords: [],
        feedback: 'No verbal or written answer was provided. Please attempt the question.',
        tip
      };
    }

    const lowerAns = trimmed.toLowerCase();
    const matched = keywords.filter((k) => lowerAns.includes(k.toLowerCase()));
    const wordCount = trimmed.split(/\s+/).length;

    let score = 5.0;
    if (matched.length >= 2 && wordCount >= 15) {
      score = Math.min(10, 8.5 + (matched.length - 2) * 0.5);
    } else if (matched.length === 1 && wordCount >= 10) {
      score = 7.0;
    } else if (wordCount >= 20) {
      score = 6.0;
    }

    const isCorrect = score >= 7.0;

    return {
      isCorrect,
      scoreOutOf10: Number(score.toFixed(1)),
      matchedKeywords: matched,
      feedback: isCorrect
        ? `Excellent technical articulation! You effectively incorporated key concepts: "${matched.join(', ')}".`
        : `Your response touched on some aspects, but needs stronger technical depth. Be sure to incorporate standard terminology.`,
      tip
    };
  }

  /**
   * 3. CV Summary & Experience Improver
   */
  static improveCvSummary({ qualification, targetFirm = 'Big 4', existingSummary = '' }) {
    const tailored = `Motivated and detail-oriented ${qualification || 'CA Intermediate (CAF Qualified)'} professional with solid foundations in IFRS, ISA audit standards, and financial analysis. Proven track record of first-attempt paper clearances and exceptional analytical problem-solving. Seeking an intensive 3.5-year training articleship contract at ${targetFirm} to deliver rigorous audit assurance and contribute to high-impact engagements.`;
    return {
      improvedSummary: tailored,
      suggestedKeywords: ['IFRS 15/16', 'ISA 315/330', 'Financial Modeling', 'Risk Assessment', 'Audit Sampling', 'MS Excel Pivot Tables']
    };
  }
}
