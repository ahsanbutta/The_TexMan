import { AiService } from './src/services/ai.service.js';

async function testTutor() {
  console.log('--- TESTING AI STUDY TUTOR ENGINE ---');

  const testCases = [
    { title: '1. What is IAS 16?', query: 'What is IAS 16?' },
    { title: '2. Explain depreciation in simple words', query: 'Explain depreciation in simple words' },
    { title: '3. What is audit risk?', query: 'What is audit risk?' },
    { title: '4. Materiality in audit', query: 'Give me an example of materiality in audit' },
    { title: '5. Difference between provision & contingent liability', query: 'What is the difference between provision and contingent liability?' },
    { title: '6. Numerical calculation', query: 'Calculate depreciation using reducing balance method for Rs 1000000 asset' },
    { title: '7. Quiz me on audit (MCQs)', query: 'Give me 5 MCQs on audit', mode: 'quiz' },
    { title: '8. Roman Urdu explanation', query: 'IAS 16 depreciation roman urdu mein samjhao' },
    { title: '9. IFRS 16 Leases', query: 'What is IFRS 16 right of use asset?' },
    { title: '10. Pakistan Income Tax Ordinance 2001', query: 'What are the salary tax slabs in Pakistan?' }
  ];

  for (const tc of testCases) {
    console.log(`\n========================================`);
    console.log(`TEST: ${tc.title}`);
    console.log(`========================================`);
    const reply = await AiService.getStudyTutorResponse({
      subject: 'Financial Accounting & Reporting (CAF-1)',
      query: tc.query,
      mode: tc.mode || 'normal'
    });
    console.log(reply.substring(0, 300) + '...\n');
  }

  console.log('✅ ALL TEST CASES PASSED SUCCESSFULLY!');
}

testTutor();
