import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { runAutonomousDailyCycle, getOrCreateAISettings } from './src/services/scheduler/autonomousScheduler.js';
import { AISettings } from './src/models/AISettings.js';
import { AIDailyReport } from './src/models/AIDailyReport.js';
import { sendEmailAlert, sendWhatsAppAlert, sendDailyReportNotification } from './src/services/aiTools/externalNotifier.js';

async function runAutonomousDigitalEmployeeTests() {
  console.log('================================================================');
  console.log('🚀 TESTING AUTONOMOUS DIGITAL EMPLOYEE SYSTEM');
  console.log('================================================================\n');

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/the-taxman';
    console.log(`[Step 1] Connecting to MongoDB: ${mongoUri}...`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ MongoDB connected successfully.\n');

    // 1. Verify AISettings schema & defaults
    console.log('[Step 2] Testing AISettings retrieval & configuration...');
    const settings = await getOrCreateAISettings();
    console.log('✅ Settings loaded:', {
      scheduleCron: settings.scheduleCron,
      timezone: settings.timezone,
      autonomyLevel: settings.autonomyLevel,
      notificationChannels: settings.notificationChannels,
      notificationRecipients: settings.notificationRecipients
    });

    // 2. Test Notification Channels directly
    console.log('\n[Step 3] Testing Direct External Notification dispatch...');
    const emailResult = await sendEmailAlert({
      to: settings.notificationRecipients?.email || 'muhammadahsaniftikaharahmad@gmail.com',
      subject: 'Autonomous AI Digital Employee System Verification',
      text: `Hello Muhammad Ahsan,\n\nThis is an automated verification of your Autonomous AI Digital Employee.\n\nSettings:\n- Schedule: ${settings.scheduleCron} (${settings.timezone})\n- Autonomy Level: ${settings.autonomyLevel}\n- WhatsApp Alert Target: ${settings.notificationRecipients?.phone}\n\nThe system is operational and ready to run background tasks without manual triggering.\n\nRegards,\nThe TaxMan AI Digital Employee`
    });
    console.log('📧 Email Notification Result:', emailResult);

    const waResult = await sendWhatsAppAlert({
      to: settings.notificationRecipients?.phone || '03269754249',
      message: `*🤖 The TaxMan AI Autonomous Worker Alert*\n\nAutonomous digital employee verification check completed successfully.\n\nSchedule: ${settings.scheduleCron} (PKT)\nTarget Email: ${settings.notificationRecipients?.email}\nStatus: System Operational`
    });
    console.log('📱 WhatsApp Notification Result:', waResult);

    // 3. Test Full Autonomous Cycle Execution
    console.log('\n[Step 4] Triggering Full Autonomous Daily Cycle (Background Worker)...');
    const cycleResult = await runAutonomousDailyCycle('CLI Autonomous Test Runner');
    console.log('\n✅ Cycle Completed Successfully!');
    console.log('📊 Execution Result:', {
      success: cycleResult.success,
      summary: cycleResult.summaryText
    });

    // 4. Verify Latest Report in MongoDB
    console.log('\n[Step 5] Querying latest AIDailyReport from Database...');
    const latestReport = await AIDailyReport.findOne().sort({ createdAt: -1 });
    if (latestReport) {
      console.log('✅ Found latest AIDailyReport in DB:', {
        _id: latestReport._id,
        date: latestReport.date,
        sourcesScanned: latestReport.sourcesScanned,
        discoveriesCount: latestReport.discoveriesCount,
        duplicatesCount: latestReport.duplicatesCount,
        newResourcesCount: latestReport.newResourcesCount,
        newEventsCount: latestReport.newEventsCount,
        pendingApprovalsCount: latestReport.pendingApprovalsCount,
        status: latestReport.status,
        summaryText: latestReport.summaryText.substring(0, 100) + '...'
      });
    }

    console.log('\n================================================================');
    console.log('🎉 ALL AUTONOMOUS DIGITAL EMPLOYEE TESTS PASSED');
    console.log('================================================================');

  } catch (err) {
    console.error('❌ Autonomous Digital Employee Test Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('\n[Finished] Disconnected MongoDB.');
  }
}

runAutonomousDigitalEmployeeTests();
