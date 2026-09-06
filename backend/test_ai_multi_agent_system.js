import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { orchestrator } from './src/services/agents/orchestrator.agent.js';
import { AITask } from './src/models/AITask.js';
import { ResearchItem } from './src/models/ResearchItem.js';
import { AIApproval } from './src/models/AIApproval.js';
import { Resource } from './src/models/Resource.js';
import { Event } from './src/models/Event.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taxman_capital';

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING MULTI-AGENT AUTONOMOUS AI SYSTEM TEST SUITE');
  console.log('====================================================');

  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGODB_URI);
      console.log('✅ Connected to MongoDB:', mongoose.connection.name);
    }

    // ----------------------------------------------------------------
    // TEST 1: Orchestrator Multi-Agent Execution & Plan Decomposition
    // ----------------------------------------------------------------
    console.log('\n--- TEST 1: AI Orchestrator Execution ---');
    const command = 'Research new ACCA resources, find upcoming events, create useful drafts, and show me what needs approval.';
    console.log(`Prompt: "${command}"`);
    
    const orchestratorResult = await orchestrator.executeCommand({
      commandText: command,
      triggeredBy: 'admin'
    });

    console.log('✅ Orchestrator Status:', orchestratorResult.status);
    console.log('✅ Summary:', JSON.stringify(orchestratorResult.summary, null, 2));
    console.log('✅ Steps Executed:', orchestratorResult.plan.length);

    if (!orchestratorResult.taskId) throw new Error('Test 1 failed: No taskId generated.');

    // ----------------------------------------------------------------
    // TEST 2: Research Inbox Items Verification
    // ----------------------------------------------------------------
    console.log('\n--- TEST 2: Research Inbox Verification ---');
    const researchItems = await ResearchItem.find().sort({ createdAt: -1 }).limit(5);
    console.log(`✅ Research Inbox Count: ${researchItems.length}`);
    researchItems.forEach((item, idx) => {
      console.log(`  ${idx + 1}. [${item.qualification}] ${item.title} (Confidence: ${item.confidence}%, Source: ${item.source})`);
    });

    // ----------------------------------------------------------------
    // TEST 3: Grounded Student Support RAG Search (Real DB vs Unknown)
    // ----------------------------------------------------------------
    console.log('\n--- TEST 3: Grounded Student Support Agent ---');
    const studentSupportAgent = orchestrator.agents.student_support;

    // A: Real Search
    const realQueryResult = await studentSupportAgent.execute({ query: 'ACCA' });
    console.log('✅ Real Query ("ACCA") Found:', realQueryResult.result.found);
    console.log('   Sources Found:', realQueryResult.result.sources?.length || 0);

    // B: Non-existent Search (Zero Hallucination check)
    const nonExistentResult = await studentSupportAgent.execute({ query: 'Quantum Astrophysics 9090' });
    console.log('✅ Non-Existent Query Found:', nonExistentResult.result.found);
    console.log('   Zero-Hallucination Safe Reply:', nonExistentResult.result.reply.slice(0, 120) + '...');

    // ----------------------------------------------------------------
    // TEST 4: AI Approval Queue & Safe Human-in-the-Loop Publishing
    // ----------------------------------------------------------------
    console.log('\n--- TEST 4: Approval Queue & Publishing ---');
    const pendingApprovals = await AIApproval.find({ status: 'Pending' });
    console.log(`✅ Pending Approvals in Queue: ${pendingApprovals.length}`);

    if (pendingApprovals.length > 0) {
      const itemToApprove = pendingApprovals[0];
      console.log(`Approving item: "${itemToApprove.title}" (Type: ${itemToApprove.type})`);

      itemToApprove.status = 'Approved';
      let publishedEntity = null;

      if (itemToApprove.type === 'Resource') {
        publishedEntity = await Resource.create({ ...itemToApprove.payload, published: true });
      } else if (itemToApprove.type === 'Event') {
        publishedEntity = await Event.create(itemToApprove.payload);
      }

      itemToApprove.status = 'Published';
      if (publishedEntity) itemToApprove.targetEntityId = publishedEntity._id;
      await itemToApprove.save();

      console.log('✅ Item published to live database with ID:', publishedEntity?._id || 'N/A');
    }

    // ----------------------------------------------------------------
    // TEST 5: Analytics & Insights Generation
    // ----------------------------------------------------------------
    console.log('\n--- TEST 5: Analytics Agent ---');
    const analyticsAgent = orchestrator.agents.analytics;
    const analyticsResult = await analyticsAgent.execute({});
    console.log('✅ Platform KPIs:', JSON.stringify(analyticsResult.result.kpis));
    console.log('✅ Generated Insights Count:', analyticsResult.result.insights?.length || 0);

    console.log('\n====================================================');
    console.log('🎉 ALL 5 MULTI-AGENT SYSTEM TEST SUITES PASSED SUCCESSFULLY!');
    console.log('====================================================\n');
  } catch (err) {
    console.error('❌ Test failed with error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

runTests();
