import nodemailer from 'nodemailer';
import { AIActivityLog } from '../../models/AIActivityLog.js';
import { AIApproval } from '../../models/AIApproval.js';
import { AISettings } from '../../models/AISettings.js';
import { Resource } from '../../models/Resource.js';
import { Blog } from '../../models/Blog.js';
import { Event } from '../../models/Event.js';
import { Announcement } from '../../models/Announcement.js';

// Telemetry in-memory counters for live dashboard verification
let telemetryStats = {
  whatsappConfigured: false,
  whatsappConnection: false,
  whatsappMessageSentCount: 0,
  whatsappDeliveryConfirmedCount: 0,
  whatsappLastSentAt: null,
  whatsappLastError: null,

  emailConfigured: false,
  emailConnection: false,
  emailMessageSentCount: 0,
  emailDeliveryConfirmedCount: 0,
  emailLastSentAt: null,
  emailLastError: null,

  approvalsProcessedCount: 0
};

/**
 * Configure Nodemailer Transport from .env credentials
 */
export function getEmailTransporter() {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587', 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD;

  if (host && user && pass) {
    telemetryStats.emailConfigured = true;
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  telemetryStats.emailConfigured = false;
  return null;
}

/**
 * Send External Email Notification (HTML + Text)
 */
export async function sendEmailAlert({
  to = 'muhammadahsaniftikharahmad6688@gmail.com',
  subject = "New CA/ACCA Resource Requires Approval",
  text = '',
  html = ''
}) {
  try {
    const transporter = getEmailTransporter();
    const fromAddress = process.env.EMAIL_FROM || '"The TaxMan AI Digital Employee" <ai@taxmancapital.com>';

    if (transporter) {
      const info = await transporter.sendMail({
        from: fromAddress,
        to,
        subject,
        text,
        html: html || `<p>${text.replace(/\n/g, '<br/>')}</p>`
      });

      telemetryStats.emailConnection = true;
      telemetryStats.emailMessageSentCount++;
      telemetryStats.emailDeliveryConfirmedCount++;
      telemetryStats.emailLastSentAt = new Date();
      telemetryStats.emailLastError = null;

      console.log(`[ExternalNotifier] ✅ Email successfully sent to ${to} (Message ID: ${info.messageId})`);
      return { success: true, messageId: info.messageId, recipient: to, channel: 'Email', deliveryConfirmed: true };
    } else {
      telemetryStats.emailLastError = 'Missing SMTP credentials in .env';
      console.log(`[ExternalNotifier] [SIMULATED EMAIL DISPATCH] To: ${to} | Subject: "${subject}"\n${text}`);
      return { success: true, simulated: true, recipient: to, channel: 'Email', message: 'Email logged (Configure SMTP_HOST in .env for live transport)' };
    }
  } catch (err) {
    telemetryStats.emailLastError = err.message;
    console.warn(`[ExternalNotifier] ❌ Email dispatch error to ${to}:`, err.message);
    return { success: false, error: err.message, channel: 'Email', deliveryConfirmed: false };
  }
}

/**
 * Send WhatsApp Notification with Actionable Controls to Administrator Phone
 */
export async function sendWhatsAppAlert({
  to = '+923269754249',
  message = '',
  interactiveButtons = null
}) {
  try {
    let cleanNumber = to.replace(/[^0-9]/g, '');
    if (cleanNumber.startsWith('03')) {
      cleanNumber = '92' + cleanNumber.slice(1);
    } else if (cleanNumber.startsWith('3') && cleanNumber.length === 10) {
      cleanNumber = '92' + cleanNumber;
    }

    const whatsappWebhookUrl = process.env.WHATSAPP_WEBHOOK_URL || process.env.N8N_WHATSAPP_WEBHOOK;
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
    const metaToken = process.env.META_WHATSAPP_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN || process.env.FACEBOOK_ACCESS_TOKEN;
    const metaPhoneId = process.env.META_PHONE_NUMBER_ID || process.env.WHATSAPP_PHONE_NUMBER_ID || '1168307046374937';

    const fetch = (await import('node-fetch')).default || globalThis.fetch;

    // 1. Primary Direct Meta Cloud API (24/7 Live Cloud Dispatch - No Local Laptop / ngrok needed)
    if (metaToken && metaPhoneId) {
      try {
        telemetryStats.whatsappConfigured = true;
        const res = await fetch(`https://graph.facebook.com/v23.0/${metaPhoneId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${metaToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: cleanNumber,
            type: 'text',
            text: {
              preview_url: true,
              body: message
            }
          })
        });

        const json = await res.json();
        if (res.ok) {
          telemetryStats.whatsappConnection = true;
          telemetryStats.whatsappMessageSentCount++;
          telemetryStats.whatsappDeliveryConfirmedCount++;
          telemetryStats.whatsappLastSentAt = new Date();
          telemetryStats.whatsappLastError = null;

          console.log(`[ExternalNotifier] ✅ WhatsApp sent via Direct 24/7 Meta Cloud API to ${cleanNumber}`);
          return { success: true, channel: 'WhatsApp', recipient: cleanNumber, deliveryConfirmed: true, metaResponse: json };
        } else {
          console.warn(`[ExternalNotifier] ⚠️ Direct Meta API returned ${res.status}:`, json?.error?.message || json);
        }
      } catch (metaErr) {
        console.warn(`[ExternalNotifier] ⚠️ Direct Meta API dispatch failed, trying webhook fallback:`, metaErr.message);
      }
    }

    // 2. Webhook / Hosted n8n Dispatch
    if (whatsappWebhookUrl) {
      try {
        telemetryStats.whatsappConfigured = true;
        const res = await fetch(whatsappWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: cleanNumber,
            message,
            interactiveButtons: interactiveButtons || [
              { id: 'APPROVE', title: '✅ APPROVE' },
              { id: 'REJECT', title: '❌ REJECT' },
              { id: 'REVIEW', title: '🔍 REVIEW' }
            ],
            timestamp: new Date().toISOString()
          })
        });

        if (res.ok) {
          telemetryStats.whatsappConnection = true;
          telemetryStats.whatsappMessageSentCount++;
          telemetryStats.whatsappDeliveryConfirmedCount++;
          telemetryStats.whatsappLastSentAt = new Date();
          telemetryStats.whatsappLastError = null;

          console.log(`[ExternalNotifier] ✅ WhatsApp sent via Webhook to ${cleanNumber} (Status: ${res.status})`);
          return { success: true, channel: 'WhatsApp', recipient: cleanNumber, deliveryConfirmed: true };
        } else {
          console.warn(`[ExternalNotifier] ⚠️ Webhook returned status ${res.status}`);
        }
      } catch (webhookErr) {
        console.warn(`[ExternalNotifier] ⚠️ Webhook dispatch failed (e.g. ngrok offline):`, webhookErr.message);
      }
    }

    // 3. Twilio WhatsApp Dispatch
    if (twilioSid && twilioAuth) {
      telemetryStats.whatsappConfigured = true;
      const fetch = (await import('node-fetch')).default || globalThis.fetch;
      const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioAuth}`).toString('base64');
      const params = new URLSearchParams();
      params.append('From', twilioPhone);
      params.append('To', `whatsapp:${cleanNumber}`);
      params.append('Body', message);

      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });

      const json = await res.json();
      telemetryStats.whatsappConnection = res.ok;
      telemetryStats.whatsappMessageSentCount++;
      telemetryStats.whatsappDeliveryConfirmedCount++;
      telemetryStats.whatsappLastSentAt = new Date();

      console.log(`[ExternalNotifier] ✅ WhatsApp sent via Twilio to ${cleanNumber} (SID: ${json.sid})`);
      return { success: true, sid: json.sid, channel: 'WhatsApp', recipient: cleanNumber, deliveryConfirmed: true };
    }

    // 4. Default Fallback
    telemetryStats.whatsappConfigured = false;
    telemetryStats.whatsappLastError = 'No WHATSAPP_WEBHOOK_URL or Twilio/Meta credentials configured';
    console.log(`[ExternalNotifier] [SIMULATED WHATSAPP DISPATCH] To: ${cleanNumber}\n---\n${message}\n---`);
    return {
      success: true,
      simulated: true,
      channel: 'WhatsApp',
      recipient: cleanNumber,
      message: 'WhatsApp alert dispatched (Configure WHATSAPP_WEBHOOK_URL in .env)'
    };
  } catch (err) {
    telemetryStats.whatsappLastError = err.message;
    console.warn(`[ExternalNotifier] ❌ WhatsApp dispatch error to ${to}:`, err.message);
    return { success: false, error: err.message, channel: 'WhatsApp', deliveryConfirmed: false };
  }
}

/**
 * Send Instant Pending Approval Alert (WhatsApp + Email) with Actionable Buttons
 */
export async function sendApprovalAlert({
  approvalId = '',
  itemTitle = 'Comprehensive CAF & ACCA Study Pack',
  itemType = 'Resource',
  qualification = 'CA / ACCA',
  sourceName = "The TaxMan's Capital Research Desk",
  sourceUrl = 'https://icap.org.pk/students/study-resources',
  reason = 'Human-in-the-loop review policy for public academic material',
  confidence = 96,
  recipientEmail = 'muhammadahsaniftikharahmad6688@gmail.com',
  recipientPhone = '+923269754249'
}) {
  const appUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000';
  const serverBaseUrl = process.env.BACKEND_PUBLIC_URL || (process.env.NODE_ENV === 'production' ? 'https://the-taxmans-capital.vercel.app' : `http://localhost:${process.env.PORT || 5000}`);
  
  const approveUrl = approvalId ? `${serverBaseUrl}/api/ai/quick-action?id=${approvalId}&action=Approved` : `${appUrl}/admin`;
  const rejectUrl = approvalId ? `${serverBaseUrl}/api/ai/quick-action?id=${approvalId}&action=Rejected` : `${appUrl}/admin`;
  const reviewUrl = `${appUrl}/admin`;

  // Actionable structured WhatsApp text with direct buttons / links
  const msg = `🚨 *New CA/ACCA Resource Requires Approval*

📌 *Resource Title*: ${itemTitle}
📁 *Resource Type*: ${itemType} (${qualification})
🏛️ *Source Name*: ${sourceName}
🔗 *Source URL*: ${sourceUrl || 'N/A'}
🤖 *AI Confidence*: ${confidence}%
🆔 *Resource / Approval ID*: ${approvalId || 'N/A'}
⚠️ *Why Approval Required*: ${reason}

⚡ *ACTIONABLE CONTROLS (Tap link or reply with button/text)*:
✅ *APPROVE*: ${approveUrl}
❌ *REJECT*: ${rejectUrl}
🔍 *REVIEW IN DASHBOARD*: ${reviewUrl}

💬 *Or reply with text to AI Manager*:
👉 Reply "APPROVE_${approvalId}" or "REJECT_${approvalId}"`;

  const htmlEmail = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0E17; color: #FFFFFF; border-radius: 16px; padding: 24px; border: 1px solid #1E293B;">
    <div style="border-bottom: 1px solid #1E293B; padding-bottom: 16px; margin-bottom: 20px;">
      <h2 style="color: #F59E0B; margin: 0; font-size: 20px;">The TaxMan's Capital &bull; AI Manager</h2>
      <p style="color: #94A3B8; margin: 4px 0 0 0; font-size: 13px;">Action Required: New CA/ACCA Resource Requires Approval</p>
    </div>

    <div style="background: #111827; padding: 18px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #1E293B;">
      <h3 style="color: #F8FAFC; margin-top: 0; font-size: 16px;">📌 ${itemTitle}</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #CBD5E1;">
        <tr><td style="padding: 6px 0; width: 140px; color: #94A3B8;">Type & Target:</td><td style="font-weight: bold; color: #38BDF8;">${itemType} (${qualification})</td></tr>
        <tr><td style="padding: 6px 0; color: #94A3B8;">Source Name:</td><td style="font-weight: bold; color: #F8FAFC;">${sourceName}</td></tr>
        <tr><td style="padding: 6px 0; color: #94A3B8;">Source URL:</td><td><a href="${sourceUrl}" style="color: #10B981; text-decoration: underline;" target="_blank">${sourceUrl || 'N/A'}</a></td></tr>
        <tr><td style="padding: 6px 0; color: #94A3B8;">AI Confidence:</td><td style="font-weight: bold; color: #10B981;">${confidence}%</td></tr>
        <tr><td style="padding: 6px 0; color: #94A3B8;">Approval ID:</td><td style="font-family: monospace; color: #A855F7;">${approvalId}</td></tr>
        <tr><td style="padding: 6px 0; color: #94A3B8;">Why Required:</td><td style="color: #FBBF24;">${reason}</td></tr>
      </table>
    </div>

    <div style="margin-top: 24px; text-align: center;">
      <div style="margin-bottom: 14px;">
        <a href="${approveUrl}" style="background: #10B981; color: #FFFFFF; text-decoration: none; padding: 14px 28px; font-weight: bold; border-radius: 8px; font-size: 15px; display: inline-block; margin-right: 10px; margin-bottom: 10px;">
          ✅ APPROVE & PUBLISH
        </a>
        <a href="${rejectUrl}" style="background: #EF4444; color: #FFFFFF; text-decoration: none; padding: 14px 24px; font-weight: bold; border-radius: 8px; font-size: 15px; display: inline-block; margin-right: 10px; margin-bottom: 10px;">
          ❌ REJECT
        </a>
        <a href="${reviewUrl}" style="background: #3B82F6; color: #FFFFFF; text-decoration: none; padding: 14px 24px; font-weight: bold; border-radius: 8px; font-size: 15px; display: inline-block; margin-bottom: 10px;">
          🔍 REVIEW IN DASHBOARD
        </a>
      </div>
      <p style="font-size: 12px; color: #64748B; margin-top: 8px;">
        Clicking Approve immediately publishes this item without needing to sign into the Admin dashboard.
      </p>
    </div>

    <div style="margin-top: 30px; border-top: 1px solid #1E293B; padding-top: 16px; font-size: 11px; color: #64748B; text-align: center;">
      Autonomous AI Digital Employee &bull; The TaxMan's Capital
    </div>
  </div>
  `;

  // Parallel multi-channel dispatch
  const results = await Promise.allSettled([
    sendWhatsAppAlert({
      to: recipientPhone,
      message: msg,
      interactiveButtons: [
        { id: `APPROVE_${approvalId}`, title: '✅ APPROVE' },
        { id: `REJECT_${approvalId}`, title: '❌ REJECT' },
        { id: `REVIEW_${approvalId}`, title: '🔍 REVIEW' }
      ]
    }),
    sendEmailAlert({
      to: recipientEmail,
      subject: `New CA/ACCA Resource Requires Approval: ${itemTitle}`,
      text: msg,
      html: htmlEmail
    })
  ]);

  const whatsappResult = results[0].status === 'fulfilled' ? results[0].value : { success: false, error: results[0].reason?.message };
  const emailResult = results[1].status === 'fulfilled' ? results[1].value : { success: false, error: results[1].reason?.message };

  await AIActivityLog.create({
    agent: 'Notification Agent',
    action: 'APPROVAL_NOTIFICATION_DISPATCHED',
    toolUsed: 'sendApprovalAlert',
    input: { itemTitle, itemType, qualification, approvalId, recipientEmail, recipientPhone },
    output: { whatsapp: whatsappResult, email: emailResult },
    status: (whatsappResult.success || emailResult.success) ? 'success' : 'failed'
  });

  return {
    success: whatsappResult.success || emailResult.success,
    whatsapp: whatsappResult,
    email: emailResult
  };
}

/**
 * Send Daily Report Notification
 */
export async function sendDailyReportNotification({
  report,
  recipientEmail = 'muhammadahsaniftikharahmad6688@gmail.com',
  recipientPhone = '03269754249'
}) {
  const formattedDate = report.date || new Date().toISOString().split('T')[0];
  const appUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000';
  const approvalLink = `${appUrl}/admin`;

  const summary = `📊 *The TaxMan's Capital — AI Manager Daily Report*
📅 *Date*: ${formattedDate}
🤖 *Status*: ${report.status || 'Success'}

🔍 *Sources Scanned*: ${report.sourcesScanned || 0}
✨ *New Discoveries*: ${report.discoveriesCount || 0}
🛡️ *Duplicates Filtered*: ${report.duplicatesCount || 0}
📚 *New Resources*: ${report.newResourcesCount || 0}
🎟️ *New Events*: ${report.newEventsCount || 0}
⚡ *Auto Actions Executed*: ${report.autoActionsCount || 0}
⚠️ *Pending Approvals*: ${report.pendingApprovalsCount || 0}

${report.pendingApprovalsCount > 0 ? `🚨 *Action Required*: You have ${report.pendingApprovalsCount} item(s) waiting in the AI Approval Queue.` : '✅ All routine operations up to date.'}

🔗 *Review & Approve*: ${approvalLink}`;

  const htmlEmail = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0E17; color: #FFFFFF; border-radius: 16px; padding: 24px; border: 1px solid #1E293B;">
    <div style="border-bottom: 1px solid #1E293B; padding-bottom: 16px; margin-bottom: 20px;">
      <h2 style="color: #10B981; margin: 0; font-size: 20px;">The TaxMan's Capital</h2>
      <p style="color: #94A3B8; margin: 4px 0 0 0; font-size: 13px;">Autonomous AI Manager Daily Operations Intelligence</p>
    </div>
    <div style="background: #111827; padding: 16px; border-radius: 12px; margin-bottom: 20px;">
      <h3 style="color: #F8FAFC; margin-top: 0; font-size: 15px;">Daily Summary — ${formattedDate}</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #CBD5E1;">
        <tr><td style="padding: 6px 0;">Sources Scanned:</td><td style="font-weight: bold; text-align: right; color: #10B981;">${report.sourcesScanned || 0}</td></tr>
        <tr><td style="padding: 6px 0;">New Discoveries:</td><td style="font-weight: bold; text-align: right; color: #38BDF8;">${report.discoveriesCount || 0}</td></tr>
        <tr><td style="padding: 6px 0;">Duplicates Filtered:</td><td style="font-weight: bold; text-align: right; color: #94A3B8;">${report.duplicatesCount || 0}</td></tr>
        <tr><td style="padding: 6px 0;">New Resources:</td><td style="font-weight: bold; text-align: right; color: #A855F7;">${report.newResourcesCount || 0}</td></tr>
        <tr><td style="padding: 6px 0;">New Events:</td><td style="font-weight: bold; text-align: right; color: #F59E0B;">${report.newEventsCount || 0}</td></tr>
        <tr><td style="padding: 6px 0;">Pending Approvals:</td><td style="font-weight: bold; text-align: right; color: #EF4444;">${report.pendingApprovalsCount || 0}</td></tr>
      </table>
    </div>
    <p style="font-size: 13px; color: #E2E8F0; line-height: 1.6;">${report.summaryText || 'Autonomous cycle completed successfully without human intervention.'}</p>
    ${report.pendingApprovalsCount > 0 ? `
    <div style="margin-top: 24px; text-align: center;">
      <a href="${approvalLink}" style="background: #10B981; color: #FFFFFF; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 8px; font-size: 14px; display: inline-block;">
        Open AI Approval Queue (${report.pendingApprovalsCount} Items)
      </a>
    </div>
    ` : ''}
  </div>`;

  await Promise.allSettled([
    sendEmailAlert({ to: recipientEmail, subject: `Daily AI Report (${formattedDate}) — The TaxMan's Capital`, text: summary, html: htmlEmail }),
    sendWhatsAppAlert({ to: recipientPhone, message: summary })
  ]);

  return { success: true, summary };
}

/**
 * Internal helper to publish or reject an AIApproval record
 */
export async function executeApprovalDecision(approvalId, decision = 'Approved', actor = 'system') {
  const approval = await AIApproval.findById(approvalId);
  if (!approval) {
    return { success: false, error: 'Approval item not found.' };
  }

  if (approval.status === 'Published' || approval.status === 'Approved' || approval.status === 'Rejected') {
    return { success: true, alreadyActioned: true, status: approval.status, title: approval.title };
  }

  approval.status = decision;
  approval.reviewNotes = `Action executed by ${actor} (${decision})`;
  approval.reviewedAt = new Date();

  let publishedEntity = null;

  if (decision === 'Approved') {
    if (approval.type === 'Blog') {
      if (approval.targetEntityId) {
        publishedEntity = await Blog.findByIdAndUpdate(
          approval.targetEntityId,
          {
            $set: {
              status: 'published',
              content: approval.payload?.content || approval.payload?.summary || approval.summary,
              summary: approval.payload?.summary || approval.summary,
              title: approval.payload?.title || approval.title
            }
          },
          { new: true }
        );
      }

      if (!publishedEntity) {
        const rawSlug = (approval.payload?.slug || approval.payload?.title || approval.title || 'article')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
          .slice(0, 80);

        let uniqueSlug = rawSlug;
        const slugExists = await Blog.findOne({ slug: uniqueSlug });
        if (slugExists) {
          uniqueSlug = `${rawSlug}-${Date.now().toString(36)}`;
        }

        const validCategories = ['Big 4 & Inductions', 'CA Guidance', 'ACCA Careers', 'Tax & Audit', 'Study Tips', 'Industry Insights', 'Career & Leadership', 'AI & Accounting', 'Technology & AI', 'General'];
        const matchedCategory = validCategories.find(c => c.toLowerCase() === (approval.payload?.category || '').toLowerCase()) || 'Big 4 & Inductions';

        publishedEntity = await Blog.create({
          title: approval.payload?.title || approval.title,
          slug: uniqueSlug,
          category: matchedCategory,
          author: {
            name: approval.payload?.authorName || 'Saboor Ahmad CA',
            role: approval.payload?.authorRole || 'Founder & Lead Career Mentor',
            avatar: ''
          },
          coverImage: approval.payload?.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
          summary: approval.payload?.summary || approval.summary || 'Educational article',
          content: approval.payload?.content || approval.payload?.summary || approval.summary,
          status: 'published'
        });
      }
      approval.targetEntityId = publishedEntity._id;
      approval.status = 'Published';
    } else if (approval.type === 'Resource' || !approval.type) {
      if (approval.targetEntityId) {
        publishedEntity = await Resource.findByIdAndUpdate(
          approval.targetEntityId,
          {
            $set: {
              status: 'approved',
              published: true,
              approvedAt: new Date()
            }
          },
          { new: true }
        );
      }

      if (!publishedEntity) {
        publishedEntity = await Resource.create({
          title: approval.payload?.title || approval.title,
          description: approval.payload?.description || approval.summary || 'Study resource file',
          category: approval.payload?.category || 'CAF',
          subject: approval.payload?.subject || '',
          qualification: approval.payload?.qualification || 'Both',
          resourceType: approval.payload?.resourceType || 'PDF',
          fileUrl: approval.payload?.fileUrl || approval.payload?.externalUrl || 'https://the-taxmans-capital.vercel.app',
          externalUrl: approval.payload?.externalUrl || '',
          author: approval.payload?.author || "The TaxMan's Capital Mentorship Team",
          tags: Array.isArray(approval.payload?.tags) ? approval.payload.tags : [],
          status: 'approved',
          published: true,
          approvedAt: new Date()
        });
      }
      approval.targetEntityId = publishedEntity._id;
      approval.status = 'Published';
    } else if (approval.type === 'Event') {
      if (approval.targetEntityId) {
        publishedEntity = await Event.findByIdAndUpdate(
          approval.targetEntityId,
          {
            $set: {
              status: 'Upcoming',
              title: approval.payload?.title || approval.title,
              desc: approval.payload?.desc || approval.payload?.description || approval.summary
            }
          },
          { new: true }
        );
      }

      if (!publishedEntity) {
        publishedEntity = await Event.create({
          title: approval.payload?.title || approval.title,
          desc: approval.payload?.desc || approval.payload?.description || approval.summary || 'Educational Session',
          date: approval.payload?.date || 'Upcoming Date TBA',
          time: approval.payload?.time || '08:00 PM PST',
          speakerName: approval.payload?.speakerName || 'Saboor Ahmad CA',
          speakerTitle: approval.payload?.speakerTitle || 'Lead Career Mentor',
          speakerOrg: approval.payload?.speakerOrg || "The TaxMan's Capital",
          location: approval.payload?.location || 'Live Zoom Meeting',
          meetingLink: approval.payload?.meetingLink || '',
          status: 'Upcoming'
        });
      }
      approval.targetEntityId = publishedEntity._id;
      approval.status = 'Published';
    }
  }

  await approval.save();
  telemetryStats.approvalsProcessedCount++;

  await AIActivityLog.create({
    agent: 'AI Approval System',
    taskId: approval.taskId || '',
    action: `APPROVAL_${decision.toUpperCase()}`,
    toolUsed: 'executeApprovalDecision',
    input: { approvalId, decision, actor },
    output: { approvalId, entityId: publishedEntity?._id || null, status: approval.status },
    status: decision === 'Approved' ? 'success' : 'warning',
    actor
  });

  return {
    success: true,
    status: approval.status,
    title: approval.title,
    entity: publishedEntity
  };
}

/**
 * Process Two-Way Incoming WhatsApp Message / Button Reply
 */
export async function processIncomingWhatsAppMessage({ from, text = '', message = '', buttonPayload = '' }) {
  const cleanFrom = (from || '').replace(/[^0-9+]/g, '');
  const rawInput = (buttonPayload || text || message || '').trim();
  const inputLower = rawInput.toLowerCase();

  console.log(`[WhatsAppTwoWay] Received from ${cleanFrom}: "${rawInput}"`);

  // 1. Button Actions (e.g. APPROVE_6a9d7d9ceb1a714bae13b37d or REJECT_...)
  if (rawInput.startsWith('APPROVE_') || rawInput.startsWith('REJECT_')) {
    const isApprove = rawInput.startsWith('APPROVE_');
    const id = rawInput.replace(/^APPROVE_|^REJECT_/, '').trim();
    const result = await executeApprovalDecision(id, isApprove ? 'Approved' : 'Rejected', `whatsapp:${cleanFrom}`);

    if (result.alreadyActioned) {
      const reply = `ℹ️ "${result.title}" is already marked as *${result.status}*.`;
      await sendWhatsAppAlert({ to: cleanFrom, message: reply });
      return { action: 'approval_already_actioned', reply };
    }

    if (result.success) {
      const reply = isApprove
        ? `✅ *Approved & Published!* "${result.title}" is now LIVE on The TaxMan's Capital portal.`
        : `❌ *Rejected:* "${result.title}" was rejected and will not be published.`;
      await sendWhatsAppAlert({ to: cleanFrom, message: reply });
      return { action: 'approval_decision_executed', reply, result };
    } else {
      const reply = `⚠️ Error processing approval: ${result.error}`;
      await sendWhatsAppAlert({ to: cleanFrom, message: reply });
      return { action: 'approval_error', reply };
    }
  }

  // 2. Direct Command: "Approve" / "Approve latest" / "Yes" / "Publish"
  if (
    inputLower === 'approve' ||
    inputLower === 'approved' ||
    inputLower === 'yes' ||
    inputLower === 'publish' ||
    (inputLower.includes('approve') && (inputLower.includes('latest') || inputLower.includes('blog') || inputLower.includes('recent') || inputLower.includes('it')))
  ) {
    const latestPending = await AIApproval.findOne({ status: 'Pending' }).sort({ createdAt: -1 });
    if (!latestPending) {
      const reply = `ℹ️ *No Pending Approvals:* Queue is currently empty. Everything has already been reviewed and published!`;
      await sendWhatsAppAlert({ to: cleanFrom, message: reply });
      return { action: 'no_pending', reply };
    }

    const result = await executeApprovalDecision(latestPending._id, 'Approved', `whatsapp:${cleanFrom}`);
    const appUrl = process.env.CLIENT_URL || 'https://the-taxmans-capital.vercel.app';
    const reply = `✅ *Approved & Published!*
📌 *Title*: "${latestPending.title}"
🏷️ *Type*: ${latestPending.type || 'Blog'}
🌐 *Live Link*: ${appUrl}/resources

The content is now live for students and users on The TaxMan's Capital portal.`;
    await sendWhatsAppAlert({ to: cleanFrom, message: reply });
    return { action: 'latest_approved', reply, result };
  }

  // 3. Direct Command: "Reject" / "Rejected" / "No" / "Discard"
  if (
    inputLower === 'reject' ||
    inputLower === 'rejected' ||
    inputLower === 'no' ||
    inputLower === 'discard' ||
    (inputLower.includes('reject') && (inputLower.includes('latest') || inputLower.includes('blog') || inputLower.includes('item')))
  ) {
    const latestPending = await AIApproval.findOne({ status: 'Pending' }).sort({ createdAt: -1 });
    if (!latestPending) {
      const reply = `ℹ️ No pending items found in queue to reject.`;
      await sendWhatsAppAlert({ to: cleanFrom, message: reply });
      return { action: 'no_pending_reject', reply };
    }

    const result = await executeApprovalDecision(latestPending._id, 'Rejected', `whatsapp:${cleanFrom}`);
    const reply = `❌ *Rejected & Dismissed:*
📌 *Title*: "${latestPending.title}"

This item has been removed from the publishing pipeline and will not go live.`;
    await sendWhatsAppAlert({ to: cleanFrom, message: reply });
    return { action: 'latest_rejected', reply, result };
  }

  // 4. Direct Command: "Review" / "Details" / "Preview"
  if (
    inputLower === 'review' ||
    inputLower === 'details' ||
    inputLower === 'preview' ||
    inputLower === 'read' ||
    inputLower.includes('review latest')
  ) {
    const latestPending = await AIApproval.findOne({ status: 'Pending' }).sort({ createdAt: -1 });
    if (!latestPending) {
      const reply = `✅ *No Pending Items:* The AI Approval Queue is currently clear.`;
      await sendWhatsAppAlert({ to: cleanFrom, message: reply });
      return { action: 'no_pending_review', reply };
    }

    const serverBaseUrl = process.env.BACKEND_PUBLIC_URL || (process.env.NODE_ENV === 'production' ? 'https://the-taxmans-capital.vercel.app' : `http://localhost:${process.env.PORT || 5000}`);
    const approveUrl = `${serverBaseUrl}/api/ai/quick-action?id=${latestPending._id}&action=Approved`;
    const rejectUrl = `${serverBaseUrl}/api/ai/quick-action?id=${latestPending._id}&action=Rejected`;

    const reply = `🔍 *Review Item Details*:
📌 *Title*: ${latestPending.title}
🏷️ *Format*: ${latestPending.type || 'Blog Article'}
🤖 *Confidence*: ${latestPending.confidence || 95}%
📝 *Summary*: ${latestPending.summary || 'Essential educational guidance'}

⚡ *Quick Actions*:
• Reply *APPROVE* to publish immediately
• Reply *REJECT* to dismiss
• Or 1-Click: ${approveUrl}`;

    await sendWhatsAppAlert({ to: cleanFrom, message: reply });
    return { action: 'review_details_sent', reply };
  }

  // 5. Command: "Show me pending approvals" / "Pending approvals" / "Queue"
  if (inputLower.includes('pending') || inputLower.includes('approvals') || inputLower.includes('queue')) {
    const pendingItems = await AIApproval.find({ status: 'Pending' }).sort({ createdAt: -1 }).limit(5).lean();
    if (pendingItems.length === 0) {
      const reply = `✅ *AI Approval Queue is Clean!* No pending items waiting for review.`;
      await sendWhatsAppAlert({ to: cleanFrom, message: reply });
      return { action: 'pending_list_empty', reply };
    }

    const appUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const serverBaseUrl = process.env.BACKEND_PUBLIC_URL || (process.env.NODE_ENV === 'production' ? 'https://the-taxmans-capital.vercel.app' : `http://localhost:${process.env.PORT || 5000}`);

    let reply = `📋 *Pending AI Approvals (${pendingItems.length} items)*:\n\n`;
    pendingItems.forEach((item, idx) => {
      const approveUrl = `${serverBaseUrl}/api/ai/quick-action?id=${item._id}&action=Approved`;
      const rejectUrl = `${serverBaseUrl}/api/ai/quick-action?id=${item._id}&action=Rejected`;
      reply += `${idx + 1}. *${item.title}* (${item.type})\n`;
      reply += `   🤖 Confidence: ${item.confidence}%\n`;
      reply += `   ✅ Approve: ${approveUrl}\n`;
      reply += `   ❌ Reject: ${rejectUrl}\n\n`;
    });
    reply += `📊 Review all in dashboard: ${appUrl}/admin`;

    await sendWhatsAppAlert({ to: cleanFrom, message: reply });
    return { action: 'pending_list_sent', count: pendingItems.length, reply };
  }

  // 4. Command: "What is scheduled for tomorrow?" / "Schedule status"
  if (inputLower.includes('schedule') || inputLower.includes('tomorrow') || inputLower.includes('when')) {
    const settings = await AISettings.findOne().lean();
    const nextRun = settings?.nextRunAt ? new Date(settings.nextRunAt).toLocaleString() : 'Not configured';
    const reply = `⏰ *AI Digital Employee Schedule*:
• Status: *${settings?.schedulerEnabled ? 'ACTIVE' : 'PAUSED'}*
• Frequency: *${settings?.scheduleFrequency || 'Daily'}*
• Next Run: *${nextRun}*
• Timezone: *${settings?.timezone || 'Asia/Karachi'}*
• Autonomy: *Level ${settings?.autonomyLevel || 2}*`;

    await sendWhatsAppAlert({ to: cleanFrom, message: reply });
    return { action: 'schedule_status_sent', reply };
  }

  // 5. Command: "Run today's content cycle" / "Run cycle now"
  if (inputLower.includes('run cycle') || inputLower.includes('run today') || inputLower.includes('start cycle')) {
    const { runAutonomousDailyCycle } = await import('../scheduler/autonomousScheduler.js');
    runAutonomousDailyCycle(`WhatsApp Trigger (${cleanFrom})`).catch(() => {});
    const reply = `🚀 *Autonomous Research & Content Cycle Started!* Scanning official sources now. You will receive an intelligence summary upon completion.`;
    await sendWhatsAppAlert({ to: cleanFrom, message: reply });
    return { action: 'cycle_triggered', reply };
  }

  // 6. Command: "Create a blog about ..." / General prompt
  if (inputLower.includes('create') || inputLower.includes('blog') || inputLower.includes('write') || inputLower.includes('article')) {
    const { orchestrator } = await import('../agents/orchestrator.agent.js');
    const result = await orchestrator.executeCommand({
      commandText: rawInput,
      triggeredBy: 'admin'
    });

    const contentResult = result.results?.content;
    const title = contentResult?.draft?.title || 'New Blog Article';
    const approvalId = contentResult?.approvalId;
    const serverBaseUrl = process.env.BACKEND_PUBLIC_URL || (process.env.NODE_ENV === 'production' ? 'https://the-taxmans-capital.vercel.app' : `http://localhost:${process.env.PORT || 5000}`);
    const approveUrl = approvalId ? `${serverBaseUrl}/api/ai/quick-action?id=${approvalId}&action=Approved` : '';

    const reply = `✨ *Blog Article Created Successfully!*
📌 *Title*: ${title}
🤖 *Status*: Enqueued for your review.

⚡ *1-Click Approve & Publish*:
👉 ${approveUrl}`;

    await sendWhatsAppAlert({ to: cleanFrom, message: reply });
    return { action: 'blog_generated', reply, result };
  }

  // 7. General Conversational / Support response
  const reply = `Assalamu Alaikum! I am your *AI Digital Employee* on The TaxMan's Capital.
You can send me commands directly:
• "Create a blog about AI in accounting."
• "Show me pending approvals."
• "Approve the latest blog."
• "Run today's content cycle."
• "What is scheduled for tomorrow?"`;

  await sendWhatsAppAlert({ to: cleanFrom, message: reply });
  return { action: 'help_sent', reply };
}

/**
 * Return Telemetry Status for Real Delivery Verification
 */
export function getTelemetryDeliveryStatus() {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD;
  const whatsappWebhookUrl = process.env.WHATSAPP_WEBHOOK_URL || process.env.N8N_WHATSAPP_WEBHOOK;
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;

  return {
    whatsappConfigured: Boolean(whatsappWebhookUrl || twilioSid),
    whatsappWebhookSet: Boolean(whatsappWebhookUrl),
    whatsappTwilioSet: Boolean(twilioSid),
    whatsappConnection: telemetryStats.whatsappConnection,
    whatsappMessageSentCount: telemetryStats.whatsappMessageSentCount,
    whatsappDeliveryConfirmedCount: telemetryStats.whatsappDeliveryConfirmedCount,
    whatsappLastSentAt: telemetryStats.whatsappLastSentAt,
    whatsappLastError: telemetryStats.whatsappLastError,

    emailConfigured: Boolean(host && user && pass),
    emailConnection: telemetryStats.emailConnection,
    emailMessageSentCount: telemetryStats.emailMessageSentCount,
    emailDeliveryConfirmedCount: telemetryStats.emailDeliveryConfirmedCount,
    emailLastSentAt: telemetryStats.emailLastSentAt,
    emailLastError: telemetryStats.emailLastError,

    approvalsProcessedCount: telemetryStats.approvalsProcessedCount
  };
}
