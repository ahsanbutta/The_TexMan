/**
 * AI Service for The TaxMan's Capital
 * Production-Grade 24/7 Conversational AI Study Assistant & Intelligence Engine
 */

export class AiService {
  /**
   * 1. 24/7 Conversational CA & ACCA AI Chatbot Engine
   */
  static async getStudyTutorResponse({
    subject = 'Financial Accounting & Reporting',
    query = '',
    history = [],
    mode = 'normal',
    difficulty = 'Intermediate'
  }) {
    const trimmedQuery = (query || '').trim();
    if (!trimmedQuery) {
      return "Assalamu Alaikum! I am your **24/7 CA & ACCA AI Study Assistant**. How can I assist with your studies today?";
    }

    // Check if external API key is available
    const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
    if (apiKey) {
      try {
        const fetch = (await import('node-fetch')).default || globalThis.fetch;
        const formattedHistory = (history || [])
          .slice(-8)
          .map((m) => `${m.sender === 'user' ? 'Student' : 'Assistant'}: ${m.text}`)
          .join('\n');

        const systemInstruction = `You are the Official AI Study Tutor on "The TaxMan's Capital" platform (Pakistan).
You act like a warm, highly knowledgeable Chartered Accountant (FCA / FCCA) mentor.
Subject Context: ${subject}
Difficulty: ${difficulty}

Rules:
- Be conversant, friendly, and direct (like ChatGPT).
- If the user greets (Hi/Hello/Salam), greet back warmly and offer help with their CA/ACCA papers.
- For concepts, give intuitive explanations, standard rules (IFRS/ISA/ITO 2001/Companies Act 2017), examples, and exam tips.
- For numerical questions, show full step-by-step arithmetic and journal entries.
- If asked in Roman Urdu or Urdu, reply naturally in clear Roman Urdu.
- For comparisons and journal entries, use markdown tables.`;

        const fullPrompt = `${systemInstruction}\n\n${formattedHistory ? `Previous Conversation:\n${formattedHistory}\n\n` : ''}Student: ${trimmedQuery}\nAssistant:`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] })
          }
        );

        const data = await response.json();
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }
      } catch (err) {
        console.warn('[AiService] Gemini API fallback to local conversational engine:', err.message);
      }
    }

    // Local Conversational Intelligence Engine
    return this.generateConversationalResponse({ subject, query: trimmedQuery, history, mode, difficulty });
  }

  /**
   * Conversational Fallback Engine with Context Memory & Intent Parsing
   */
  static generateConversationalResponse({ subject, query, history = [], mode, difficulty }) {
    const q = query.toLowerCase();
    const cleanQ = q.replace(/[^a-z0-9\s]/g, ' ').trim();

    // 1. GREETINGS & CASUAL CHAT
    const greetingMatch = /^(hi|hello|hey|salam|assalam|assalamu alaikum|aoa|kese ho|kaise ho|who are you|what can you do|good morning|good evening|good afternoon)$/i.test(cleanQ);
    if (greetingMatch) {
      return `Wa Alaikum Assalam & Hello! 👋

I am your **24/7 CA & ACCA AI Study Assistant** on *The TaxMan's Capital*. 

I'm here to help you master:
- **Financial Reporting:** IFRS & IAS standards, consolidations, journal entries, and revaluations.
- **Audit & Assurance:** ISAs, audit assertions, risk assessment, and substantive procedures.
- **Taxation:** Pakistan Income Tax Ordinance 2001, salary tax, sales tax, and returns.
- **Cost & Management:** WACC, NPV, variance analysis, and marginal vs absorption costing.
- **Corporate Law:** Companies Act 2017 and corporate governance.
- **Numerical Problems & Exam Prep:** Step-by-step solutions and practice MCQs.

What topic or question are you working on right now? Ask me anything!`;
    }

    // 2. CONTEXT RETRIEVAL FROM HISTORY (FOR SHORT FOLLOW-UPS)
    let contextTopic = '';
    if (history && history.length > 0) {
      const pastUserMessages = history.filter((m) => m.sender === 'user').map((m) => m.text).join(' ').toLowerCase();
      if (pastUserMessages.includes('ias 16') || pastUserMessages.includes('depreciation')) contextTopic = 'IAS 16';
      else if (pastUserMessages.includes('ifrs 15') || pastUserMessages.includes('revenue')) contextTopic = 'IFRS 15';
      else if (pastUserMessages.includes('ifrs 16') || pastUserMessages.includes('lease')) contextTopic = 'IFRS 16';
      else if (pastUserMessages.includes('audit') || pastUserMessages.includes('isa')) contextTopic = 'Audit';
      else if (pastUserMessages.includes('tax') || pastUserMessages.includes('salary')) contextTopic = 'Taxation';
      else if (pastUserMessages.includes('provision') || pastUserMessages.includes('ias 37')) contextTopic = 'IAS 37';
      else if (pastUserMessages.includes('wacc') || pastUserMessages.includes('npv')) contextTopic = 'Financial Management';
    }

    const isExampleRequest = /example|misaal|scenario|case\s*study|practical/i.test(q);
    const isRomanUrdu = /roman\s*urdu|urdu|samjhao|batao|kya\s*hai|hota\s*hai|kaise/i.test(q) || mode === 'urdu';
    const isMcqRequest = /mcq|quiz|test\s*me|practice\s*questions|multiple\s*choice/i.test(q) || mode === 'quiz';
    const isJournalRequest = /journal\s*entry|entry\s*pass|debit\s*credit|recording|double\s*entry/i.test(q) || mode === 'journal';
    const isComparison = /difference\s*between|vs|versus|compare|distinguish/i.test(q) || mode === 'compare';
    const isSimpleMode = /simple|beginner|easy|layman|basic/i.test(q) || mode === 'explain';

    // 3. EXAM STRATEGY & MOTIVATION
    if (q.includes('test kal hai') || q.includes('exam preparation') || q.includes('how to prepare') || q.includes('pass kaise karein')) {
      return `### 🎯 High-Yield Exam Preparation Strategy

1. **Focus on Standard Structure:**
   - **Step 1:** Define the core standard definition (e.g. IAS 16 asset criteria, ISA 315 assertion, or Tax Section).
   - **Step 2:** Show the exact arithmetic working clearly before finalizing the final financial statement figure.
   - **Step 3:** Provide the note disclosure or journal entry.
2. **Time Management in ICAP / ACCA:**
   - Rule of thumb: **1.8 minutes per mark** (100 marks in 180 minutes). Never exceed the time limit on a single question.
3. **Practice Past Papers:**
   - Solve at least 3 recent attempts under timed conditions.

Tell me which specific chapter or standard you want to revise today and I will walk you through the key points!`;
    }

    // 4. IAS 16 / DEPRECIATION / PPE
    if (q.includes('ias 16') || q.includes('depreciation') || (contextTopic === 'IAS 16' && isExampleRequest)) {
      if (isRomanUrdu) {
        return `### 💡 IAS 16: Property, Plant & Equipment (Roman Urdu Guide)

**Depreciation kya hai?**
Kisi tangible fixed asset ki cost ko uski **Useful Life** par systematically divide karna depreciation kehlata hai.

**Main Rules:**
1. **Kab shuru hoti hai?** Jab asset *Available for Use* ho (yani jab use karne ke qabil ho jaye, chahay actual factory production 2 mahine baad shuru ho).
2. **Cost Model:** $\\text{Cost} - \\text{Acc. Depreciation} - \\text{Impairment}$
3. **Revaluation Model:** Fair value par carry kiya jata hai. Gain *OCI (Revaluation Surplus)* mein jata hai.

**Journal Entry for Revaluation Surplus:**
| Account Title | Debit (Rs.) | Credit (Rs.) |
| :--- | :--- | :--- |
| **Asset (Carrying Amount)** | 500,000 | — |
| **Revaluation Surplus (OCI / Equity)** | — | 500,000 |

💡 *Exam Tip:* Land par depreciation nahi hoti kyunke uski life unlimited hoti hai!`;
      }

      if (isJournalRequest) {
        return `### 📝 IAS 16 Standard Journal Entries

#### 1. Initial Purchase & Installation
| Account Title | Debit (Rs.) | Credit (Rs.) |
| :--- | :--- | :--- |
| **Property, Plant & Equipment (Cost)** | 1,000,000 | — |
| **Bank / Cash / Payable** | — | 1,000,000 |

#### 2. Annual Depreciation Expense
| Account Title | Debit (Rs.) | Credit (Rs.) |
| :--- | :--- | :--- |
| **Depreciation Expense (P&L)** | 100,000 | — |
| **Accumulated Depreciation (Contra-Asset)** | — | 100,000 |

#### 3. Upward Revaluation (Surplus)
| Account Title | Debit (Rs.) | Credit (Rs.) |
| :--- | :--- | :--- |
| **Asset (Gross / Net)** | 200,000 | — |
| **Revaluation Surplus (Other Comprehensive Income)** | — | 200,000 |`;
      }

      return `### 🏢 IAS 16: Property, Plant and Equipment

**1. Recognition Criteria**:
An item is recognized as PPE if:
- It is **probable** that future economic benefits associated with the asset will flow to the entity.
- The cost of the asset can be **measured reliably**.

**2. Measurement After Recognition**:
- **Cost Model:** $\\text{Cost} - \\text{Accumulated Depreciation} - \\text{Accumulated Impairment Losses}$.
- **Revaluation Model:** Carried at fair value at the revaluation date less subsequent depreciation.
  - *Revaluation Gain:* Recognized in **OCI** and accumulated in Equity under Revaluation Surplus.
  - *Revaluation Deficit:* Recognized in **P&L** (unless reversing a previous surplus on the same asset).

**3. Depreciation Principles**:
- Begins when the asset is **available for use**.
- Ceases at the earlier of date classified as held for sale (IFRS 5) or derecognition.
- Methods: Straight-line, Diminishing balance, Units of production.`;
    }

    // 5. IFRS 15 REVENUE
    if (q.includes('ifrs 15') || q.includes('revenue') || (contextTopic === 'IFRS 15' && isExampleRequest)) {
      return `### 📊 IFRS 15: Revenue from Contracts with Customers (5-Step Model)

**Step 1: Identify the Contract with a Customer**
Enforceable rights, commercial substance, approved terms, and probable collection.

**Step 2: Identify Distinct Performance Obligations (POs)**
A good or service is distinct if the customer can benefit from it on its own and it is separately identifiable within the contract.

**Step 3: Determine the Transaction Price**
The amount the entity expects to be entitled to in exchange for transferring goods/services (factors variable consideration, significant financing, non-cash consideration).

**Step 4: Allocate Transaction Price to Performance Obligations**
Allocated based on relative **Standalone Selling Prices (SSP)**.

**Step 5: Recognize Revenue**
- *Over Time:* If customer simultaneously receives and consumes benefits, creates an asset with no alternative use and an enforceable right to payment.
- *Point in Time:* When control transfers (e.g. goods delivered and accepted).`;
    }

    // 6. IAS 37 PROVISIONS & CONTINGENCIES
    if (q.includes('provision') || q.includes('contingent') || q.includes('ias 37')) {
      return `### ⚖️ IAS 37: Provisions, Contingent Liabilities & Contingent Assets

| Feature | Provision | Contingent Liability | Contingent Asset |
| :--- | :--- | :--- | :--- |
| **Probability** | **Probable** (> 50% chance) | **Possible** (5% to 50%) OR present obligation where outflow is not probable | **Probable** (> 50%) |
| **Measurement** | Can be **reliably estimated** | Cannot be reliably estimated | Possible / Probable estimate |
| **Accounting Treatment** | **Recognized as Liability** in Balance Sheet & Expense in P&L | **Disclosed in Notes** to Financial Statements | **Disclosed** in Notes (Recognized only if Virtually Certain > 95%) |
| **Journal Entry** | **Dr.** Expense <br> **Cr.** Provision Liability | **No Entry** (Disclosure Only) | **No Entry** until virtually certain |`;
    }

    // 7. AUDIT ASSERTIONS & AUDIT RISK (ISA 315 / 330 / 320)
    if (q.includes('audit') || q.includes('assertion') || q.includes('isa') || q.includes('materiality') || contextTopic === 'Audit') {
      if (q.includes('assertion')) {
        return `### 🔍 Audit Assertions under ISA 315 (Revised)

#### 1. Classes of Transactions (P&L):
- **Occurrence:** Transactions and events recorded actually occurred and pertain to the entity.
- **Completeness:** All transactions that should have been recorded have been included.
- **Accuracy:** Amounts and other data have been recorded appropriately.
- **Cut-off:** Transactions are recorded in the correct accounting period.
- **Classification:** Recorded in the proper accounts.

#### 2. Account Balances at Period End (Balance Sheet):
- **Existence:** Assets, liabilities, and equity interests physically and legally exist.
- **Rights & Obligations:** The entity holds or controls the rights to assets, and liabilities are obligations of the entity.
- **Completeness:** All assets and liabilities that should have been recorded are recorded.
- **Accuracy, Valuation & Allocation:** Included at appropriate carrying amounts and resulting valuation adjustments are properly recorded.`;
      }

      return `### 🛡️ Audit Risk Model (ISA 200 & 315)

$$\\text{Audit Risk (AR)} = \\text{Inherent Risk (IR)} \\times \\text{Control Risk (CR)} \\times \\text{Detection Risk (DR)}$$

- **Inherent Risk (IR):** Susceptibility of an assertion to material misstatement assuming no related internal controls.
- **Control Risk (CR):** Risk that a misstatement will not be prevented, detected, or corrected by the entity's internal control system.
- **Detection Risk (DR):** Risk that auditor's substantive procedures will fail to detect a misstatement.
- **Materiality (ISA 320):** An omission or misstatement is material if it could reasonably influence the economic decisions of users.`;
    }

    // 8. TAXATION (PAKISTAN INCOME TAX ORDINANCE 2001)
    if (q.includes('tax') || q.includes('salary tax') || q.includes('withholding') || q.includes('ito') || contextTopic === 'Taxation') {
      return `### 📑 Pakistan Income Tax Ordinance 2001 (ITO 2001)

**5 Heads of Total Income (Section 11)**:
1. **Salary (Sec 12):** Employment income, basic pay, allowances, and perquisites.
2. **Income from Property (Sec 15):** Rent received/receivable from land or building.
3. **Income from Business (Sec 18):** Profits from trade, commerce, and profession.
4. **Capital Gains (Sec 37 & 37A):** Gains on disposal of capital assets, shares, and securities.
5. **Income from Other Sources (Sec 39):** Dividends, profit on debt, prize money.

**Salary Tax Slabs Benchmark (Tax Year 2024–2025)**:
- **Up to Rs. 600,000:** 0% (Tax-Free threshold)
- **Rs. 600,001 to Rs. 1,200,000:** 5% of amount exceeding Rs. 600,000
- **Rs. 1,200,001 to Rs. 2,200,000:** Rs. 30,000 + 15% of amount exceeding Rs. 1,200,000
- **Rs. 2,200,001 to Rs. 3,200,000:** Rs. 180,000 + 25% of amount exceeding Rs. 2,200,000
- **Exceeding Rs. 3,200,000:** Highest progressive bracket + applicable surcharge.`;
    }

    // 9. FINANCIAL MANAGEMENT & CORPORATE FINANCE (WACC, NPV, IRR)
    if (q.includes('wacc') || q.includes('npv') || q.includes('irr') || q.includes('cost of capital') || q.includes('capm') || contextTopic === 'Financial Management') {
      return `### 💰 Corporate Finance & Financial Management

**1. Weighted Average Cost of Capital (WACC)**:
$$WACC = \\left(\\frac{E}{V} \\times K_e\\right) + \\left(\\frac{D}{V} \\times K_d \\times (1 - T)\\right)$$

- **$K_e$ (Cost of Equity via CAPM):** $R_f + \\beta(R_m - R_f)$
- **$K_d$:** Pre-tax cost of debt
- **$T$:** Corporate tax rate (typically 29% in Pakistan)
- **$E/V, D/V$:** Market value proportions of equity and debt.

**2. Net Present Value (NPV)**:
$$NPV = \\sum_{t=1}^{n} \\frac{CF_t}{(1 + r)^t} - \\text{Initial Outlay}$$
- *Decision Rule:* Accept project if $NPV > 0$.`;
    }

    // 10. DYNAMIC CONVERSATIONAL SYNTHESIS FOR ANY OTHER QUERY
    return `### 🎓 CA & ACCA Tutor Guidance: ${subject}

Regarding your question: **"${query}"**

#### 1. Core Technical Concept
In the syllabus for **${subject}**, this topic is evaluated to test technical understanding and practical application under professional examination standards (IFRS / ISA / ICAP / ACCA).

#### 2. Key Framework Principles
- **Scope & Applicability:** Ensure that the transaction falls within the relevant framework criteria.
- **Measurement & Valuation:** Record the impact on the Statement of Financial Position and Statement of Comprehensive Income.
- **Disclosures:** Provide appropriate notes reflecting accounting assumptions, risks, and reconciliations.

#### 3. Standard Practical Application
| Component | Accounting / Audit Implication |
| :--- | :--- |
| **Primary Classification** | Recognize based on substance over form. |
| **Measurement Basis** | Cost, Fair Value, or Present Value as mandated. |
| **Impact on Results** | Realized in P&L or Other Comprehensive Income (OCI). |

---
💡 **How would you like to proceed?**
- Would you like a **worked numerical example**?
- Would you like me to explain this in **simple Roman Urdu**?
- Or should I generate **practice exam questions / MCQs**?`;
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
