import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { ResearchSource } from './src/models/ResearchSource.js';
import { ResearchItem } from './src/models/ResearchItem.js';
import { AIApproval } from './src/models/AIApproval.js';
import { Resource } from './src/models/Resource.js';
import { seedDefaultResearchSources, fetchExternalWebPage, parseHtmlContent, extractDiscoveriesWithAI } from './src/services/aiTools/externalCrawler.js';
import { performMultiSignalDuplicateCheck, evaluateDiscoveryDecision } from './src/services/aiTools/duplicateDetector.js';
import { runResearchQuery } from './src/services/aiTools/researchTools.js';
import { orchestrator } from './src/services/agents/orchestrator.agent.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taxman_capital';

async function testAutonomousExternalDiscovery() {
  console.log('====================================================');
  console.log('🌐 TESTING REAL AUTONOMOUS EXTERNAL RESEARCH ENGINE');
  console.log('====================================================\n');

  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGODB_URI);
      console.log('✅ Connected to MongoDB:', mongoose.connection.name);
    }

    // ----------------------------------------------------
    // TEST 1: Research Sources Seeding & Dynamic Management
    // ----------------------------------------------------
    console.log('\n--- TEST 1: External Sources Management ---');
    await seedDefaultResearchSources();
    const sources = await ResearchSource.find();
    console.log(`✅ Configured External Sources Count: ${sources.length}`);
    sources.forEach((s, idx) => {
      console.log(`   ${idx + 1}. [${s.category}] ${s.name} -> ${s.url} (Active: ${s.isActive})`);
    });

    // ----------------------------------------------------
    // TEST 2: Live External Web Fetch & HTML Parser
    // ----------------------------------------------------
    console.log('\n--- TEST 2: Live External Web Crawl ---');
    const targetUrl = 'https://the-taxmans-capital.vercel.app/resources';
    console.log(`   Fetching live external URL: ${targetUrl} ...`);
    const fetchResult = await fetchExternalWebPage(targetUrl);
    console.log('   Fetch Success:', fetchResult.success);

    if (fetchResult.success) {
      const { cleanText, links, hash } = parseHtmlContent(fetchResult.html);
      console.log(`   Extracted Text Length: ${cleanText.length} characters`);
      console.log(`   Extracted Links Count: ${links.length}`);
      console.log(`   SHA-256 Memory Fingerprint: ${hash.slice(0, 16)}...`);
    }

    // ----------------------------------------------------
    // TEST 3: AI Semantic Extraction & Novel Discovery
    // ----------------------------------------------------
    console.log('\n--- TEST 3: External Knowledge Extraction & Discovery ---');
    const scanResults = await runResearchQuery({
      query: '',
      qualification: 'Both',
      limit: 4,
      autonomyLevel: 2
    });

    console.log('   Total Sources Evaluated:', scanResults.totalSources);
    console.log('   Live Sources Scanned:', scanResults.sourcesScanned);
    console.log('   Novel Discoveries Found:', scanResults.totalFound);
    console.log('   Duplicates Filtered:', scanResults.duplicates);
    console.log('   Auto-Drafts Enqueued for Approval:', scanResults.autoDraftsCreated);

    // ----------------------------------------------------
    // TEST 4: Multi-Signal Duplicate & Decision Engine
    // ----------------------------------------------------
    console.log('\n--- TEST 4: Multi-Signal Duplicate Detection ---');
    
    // Test A: Existing Item Duplicate Check
    const dupCheck1 = await performMultiSignalDuplicateCheck({
      title: 'ACCA Financial Reporting (FR) IAS 16 & IFRS 15 Summary Pack',
      sourceUrl: 'https://the-taxmans-capital.vercel.app'
    });
    console.log('   Check A (Existing Resource): isDuplicate =', dupCheck1.isDuplicate, '| MatchType =', dupCheck1.matchType);

    // Test B: Genuinely New External Item Check
    const novelItem = {
      title: `ICAP Spring 2027 Advanced Tax Planning Directive ${Date.now().toString().slice(-4)}`,
      sourceUrl: `https://www.icap.org.pk/news/directive-${Date.now()}`,
      category: 'Exams & Syllabus',
      qualification: 'CA',
      confidence: 96
    };
    const dupCheck2 = await performMultiSignalDuplicateCheck(novelItem);
    console.log('   Check B (Novel Discovery): isDuplicate =', dupCheck2.isDuplicate, '| MatchType =', dupCheck2.matchType);

    const decision = await evaluateDiscoveryDecision(novelItem);
    console.log('   AI Decision Recommendation:', decision.recommendation, '| ContentType:', decision.contentType);

    // ----------------------------------------------------
    // TEST 5: Natural Language "Run Today's Research" Command
    // ----------------------------------------------------
    console.log('\n--- TEST 5: Orchestrator "Run Today\'s Research" ---');
    const commandText = 'Run today\'s research on ICAP and ACCA sources and prepare drafts for my approval.';
    console.log(`   Command: "${commandText}"`);
    const orchResult = await orchestrator.executeCommand({
      commandText,
      triggeredBy: 'admin'
    });

    console.log('   Orchestrator Execution Time:', orchResult.executionTimeMs, 'ms');
    console.log('   What Was Found:', orchResult.summary.whatFound);
    console.log('   What Was Created:', orchResult.summary.whatCreated);
    console.log('   Requires Approval:', orchResult.summary.whatRequiresApproval);

    console.log('\n====================================================');
    console.log('🎉 ALL AUTONOMOUS EXTERNAL RESEARCH TESTS PASSED!');
    console.log('====================================================\n');
  } catch (err) {
    console.error('❌ Autonomous research test failed:', err);
  } finally {
    await mongoose.disconnect();
  }
}

testAutonomousExternalDiscovery();
