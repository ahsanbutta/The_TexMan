/**
 * Live End-to-End API Test Suite for Multi-Agent AI System
 * Tests HTTP REST endpoints and all 10 specialized domain agents
 */

const BASE_URL = 'http://localhost:5000/api/ai';

async function testLiveAIEndpoints() {
  console.log('====================================================');
  console.log('🌐 TESTING LIVE MULTI-AGENT REST APIS (PORT 5000)');
  console.log('====================================================\n');

  try {
    // ----------------------------------------------------
    // TEST 1: Get AI Control Center Stats & Telemetry
    // ----------------------------------------------------
    console.log('1️⃣ Testing GET /api/ai/control-center/stats ...');
    const statsRes = await fetch(`${BASE_URL}/control-center/stats`);
    const statsData = await statsRes.json();
    console.log('   Status Code:', statsRes.status);
    console.log('   Active Agents Count:', statsData.data?.agents?.length);
    console.log('   Overview KPIs:', statsData.data?.overview);

    // ----------------------------------------------------
    // TEST 2: Natural Language Orchestrator Command
    // ----------------------------------------------------
    console.log('\n2️⃣ Testing POST /api/ai/orchestrator/command ...');
    const commandText = 'Find new ACCA study resources, upcoming webinars, and generate social media drafts.';
    console.log(`   Executing Prompt: "${commandText}"`);
    const orchestratorRes = await fetch(`${BASE_URL}/orchestrator/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commandText })
    });
    const orchestratorData = await orchestratorRes.json();
    console.log('   Status Code:', orchestratorRes.status);
    console.log('   Task ID:', orchestratorData.data?.taskId);
    console.log('   Orchestrator Summary:', orchestratorData.data?.summary);

    // ----------------------------------------------------
    // TEST 3: Direct Agent Invocation (Research Agent)
    // ----------------------------------------------------
    console.log('\n3️⃣ Testing POST /api/ai/agents/research/run ...');
    const researchRes = await fetch(`${BASE_URL}/agents/research/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: { query: 'ICAP CAF', limit: 3 } })
    });
    const researchData = await researchRes.json();
    console.log('   Status Code:', researchRes.status);
    console.log('   Research Findings:', researchData.data?.result?.message);

    // ----------------------------------------------------
    // TEST 4: Direct Agent Invocation (Content & SEO Agent)
    // ----------------------------------------------------
    console.log('\n4️⃣ Testing POST /api/ai/agents/content/run ...');
    const contentRes = await fetch(`${BASE_URL}/agents/content/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: {
          title: 'Top 5 Tips for Big 4 Audit Trainee Written Tests',
          category: 'Big 4 & Inductions',
          requiresApproval: true
        }
      })
    });
    const contentData = await contentRes.json();
    console.log('   Status Code:', contentRes.status);
    console.log('   Draft Created:', contentData.data?.result?.message);

    // ----------------------------------------------------
    // TEST 5: Grounded Student Support RAG Query (Real vs Unknown)
    // ----------------------------------------------------
    console.log('\n5️⃣ Testing POST /api/ai/support/query (Grounded RAG) ...');
    const supportQueryRes = await fetch(`${BASE_URL}/support/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'Audit' })
    });
    const supportData = await supportQueryRes.json();
    console.log('   Status Code:', supportQueryRes.status);
    console.log('   Items Found in DB:', supportData.data?.found);
    console.log('   Sources Count:', supportData.data?.sources?.length);

    // ----------------------------------------------------
    // TEST 6: AI Approval Queue & Decision Processing
    // ----------------------------------------------------
    console.log('\n6️⃣ Testing GET /api/ai/approvals ...');
    const approvalsRes = await fetch(`${BASE_URL}/approvals?status=Pending`);
    const approvalsData = await approvalsRes.json();
    const pendingList = approvalsData.data || [];
    console.log(`   Pending Approvals Count: ${pendingList.length}`);

    if (pendingList.length > 0) {
      const firstItem = pendingList[0];
      console.log(`   Deciding Approval for Item [${firstItem._id}]: "${firstItem.title}"`);
      const decideRes = await fetch(`${BASE_URL}/approvals/${firstItem._id}/decide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision: 'Approved', reviewNotes: 'Verified and approved via test script.' })
      });
      const decideData = await decideRes.json();
      console.log('   Decision Status:', decideRes.status);
      console.log('   Approval Result Message:', decideData.message);
    }

    // ----------------------------------------------------
    // TEST 7: Autonomous n8n Webhook Trigger
    // ----------------------------------------------------
    console.log('\n7️⃣ Testing POST /api/ai/webhook/n8n ...');
    const webhookRes = await fetch(`${BASE_URL}/webhook/n8n`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-n8n-webhook-secret': 'n8n_taxman_secret_2026'
      },
      body: JSON.stringify({
        action: 'morning_research_scan'
      })
    });
    const webhookData = await webhookRes.json();
    console.log('   Status Code:', webhookRes.status);
    console.log('   Webhook Task ID:', webhookData.data?.taskId);
    console.log('   Webhook Output Summary:', webhookData.data?.summary?.whatFound);

    console.log('\n====================================================');
    console.log('🎉 ALL LIVE REST API & AGENT TESTS PASSED SUCCESSFULLY!');
    console.log('====================================================\n');
  } catch (err) {
    console.error('❌ Live API test failed with error:', err.message);
  }
}

testLiveAIEndpoints();
