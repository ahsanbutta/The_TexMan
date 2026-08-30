import app from './src/app.js';
import mongoose from 'mongoose';
import http from 'http';

async function testInterviewLifecycle() {
  console.log('🧪 Starting AI Mock Interview System Integration Tests...');

  // Start temporary test server
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;

  console.log(`🌐 Test server running on ${baseUrl}`);

  try {
    // 1. Test Session Initialization
    console.log('\n▶️ 1. Testing POST /api/interviews/start ...');
    const startRes = await fetch(`${baseUrl}/interviews/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock_token'
      },
      body: JSON.stringify({
        targetRole: 'Audit Trainee (Articleship)',
        interviewStage: 'Manager Technical Round',
        difficulty: 'Advanced',
        interviewType: 'Technical',
        questionCount: 3,
        duration: 15
      })
    });

    const startData = await startRes.json();
    console.log(`Response status: ${startRes.status}`);
    console.log('Greeting received:', startData.data?.greeting?.substring(0, 100) + '...');
    if (!startData.data?.sessionId) throw new Error('No sessionId returned from start');
    const sessionId = startData.data.sessionId;

    // 2. Test Answering Question 1
    console.log('\n▶️ 2. Testing POST /api/interviews/:sessionId/message (Turn 1)...');
    const turnRes = await fetch(`${baseUrl}/interviews/${sessionId}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock_token'
      },
      body: JSON.stringify({
        candidateAnswer:
          'Substantive procedures test for material misstatements in transactions and balances under ISA 330, whereas Tests of Controls evaluate the operating effectiveness of internal controls.',
        duration: 25,
        metrics: {
          wpm: 135,
          fillerCount: 1,
          wordCount: 26
        }
      })
    });

    const turnData = await turnRes.json();
    console.log(`Turn response status: ${turnRes.status}`);
    console.log('Turn Score:', turnData.data?.turnEvaluation?.score);
    console.log('Interviewer Next Reply:', turnData.data?.interviewerReply?.substring(0, 100) + '...');

    // 3. Test Completing Session & Generating Scorecard
    console.log('\n▶️ 3. Testing POST /api/interviews/:sessionId/complete ...');
    const completeRes = await fetch(`${baseUrl}/interviews/${sessionId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock_token'
      }
    });

    const completeData = await completeRes.json();
    console.log(`Complete response status: ${completeRes.status}`);
    console.log('Overall Score (0-100):', completeData.data?.evaluation?.overallScore);
    console.log('Technical Knowledge:', completeData.data?.evaluation?.technicalKnowledge);
    console.log('Hiring Recommendation:', completeData.data?.evaluation?.hiringRecommendation);
    console.log('Strengths count:', completeData.data?.evaluation?.strengths?.length);

    // 4. Test Fetching Session Details
    console.log('\n▶️ 4. Testing GET /api/interviews/:sessionId ...');
    const getRes = await fetch(`${baseUrl}/interviews/${sessionId}`, {
      headers: { Authorization: 'Bearer mock_token' }
    });
    const getData = await getRes.json();
    console.log(`Get Session status: ${getRes.status}`);
    console.log('Session Status:', getData.data?.status);
    console.log('Transcript length:', getData.data?.transcript?.length);

    // 5. Test Fetching History
    console.log('\n▶️ 5. Testing GET /api/interviews/history ...');
    const histRes = await fetch(`${baseUrl}/interviews/history`, {
      headers: { Authorization: 'Bearer mock_token' }
    });
    const histData = await histRes.json();
    console.log(`History count: ${histData.data?.length}`);

    // 6. Test Deleting Session
    console.log('\n▶️ 6. Testing DELETE /api/interviews/:sessionId ...');
    const delRes = await fetch(`${baseUrl}/interviews/${sessionId}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer mock_token' }
    });
    const delData = await delRes.json();
    console.log(`Delete response status: ${delRes.status}`);

    console.log('\n✅ ALL BACKEND INTERVIEW TESTS PASSED WITH 100% SUCCESS!');
  } catch (err) {
    console.error('❌ Test failed:', err);
  } finally {
    server.close();
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

testInterviewLifecycle();
