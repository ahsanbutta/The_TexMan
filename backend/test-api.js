/**
 * Comprehensive API Endpoint Test Suite
 */
const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting Backend API End-to-End Test Suite...\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Health Check
  await test('GET /api/health', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    if (!data.success || data.data.status !== 'healthy') throw new Error('Health check failed');
  });

  // 2. Auth Register (Supports both fullName and name, 6+ character passwords)
  await test('POST /api/auth/register', async () => {
    const testEmail = `test_student_${Date.now()}@taxmancapital.com`;
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'password123',
        fullName: 'Test Candidate',
        username: `candidate_${Date.now().toString().slice(-4)}`
      })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Registration failed');
  });

  // 3. Global Search
  await test('GET /api/search?q=audit', async () => {
    const res = await fetch(`${BASE_URL}/search?q=audit`);
    const data = await res.json();
    if (!data.success || !data.data.jobs) throw new Error('Global search failed');
  });

  // 4. AI Study Tutor
  await test('POST /api/ai/study-tutor', async () => {
    const res = await fetch(`${BASE_URL}/ai/study-tutor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: 'FAR-1 (Financial Accounting)',
        query: 'What are the main rules under IAS 16?'
      })
    });
    const data = await res.json();
    if (!data.success || !data.data.reply) throw new Error('AI Study Tutor failed');
  });

  // 5. AI Interview Evaluator
  await test('POST /api/ai/interview/evaluate', async () => {
    const res = await fetch(`${BASE_URL}/ai/interview/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: 'Explain substantive procedures vs tests of controls under ISA 330',
        userAnswer: 'Substantive procedures test dollar misstatements at assertion level while tests of controls test operating effectiveness of controls.',
        keywords: ['substantive', 'controls', 'isa 330'],
        tip: 'Substantive procedures detect material misstatements; Tests of controls evaluate effectiveness.'
      })
    });
    const data = await res.json();
    if (!data.success || data.data.scoreOutOf10 === undefined) throw new Error('Interview evaluation failed');
  });

  // 6. AI CV Summary Improver
  await test('POST /api/ai/cv/improve-summary', async () => {
    const res = await fetch(`${BASE_URL}/ai/cv/improve-summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        qualification: 'CA Intermediate (CAF Qualified)',
        targetFirm: 'PwC Pakistan'
      })
    });
    const data = await res.json();
    if (!data.success || !data.data.improvedSummary) throw new Error('CV improver failed');
  });

  // 7. Community Groups
  await test('GET /api/community/groups', async () => {
    const res = await fetch(`${BASE_URL}/community/groups`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data)) throw new Error('Community groups failed');
  });

  // 8. Jobs Listing
  await test('GET /api/jobs', async () => {
    const res = await fetch(`${BASE_URL}/jobs`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data)) throw new Error('Jobs listing failed');
  });

  // 9. Resources Listing
  await test('GET /api/resources', async () => {
    const res = await fetch(`${BASE_URL}/resources`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data)) throw new Error('Resources listing failed');
  });

  // 10. Mentors Listing
  await test('GET /api/mentors', async () => {
    const res = await fetch(`${BASE_URL}/mentors`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data)) throw new Error('Mentors listing failed');
  });

  console.log(`\n============================================================`);
  console.log(`📊 Test Results: ${passed} Passed | ${failed} Failed`);
  console.log(`============================================================\n`);
}

runTests();
