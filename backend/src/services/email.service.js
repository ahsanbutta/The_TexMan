import nodemailer from 'nodemailer';

/**
 * Reusable Nodemailer Email Service with HTML templates
 */
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_PORT == 465,
      auth: {
        user: process.env.EMAIL_USER || 'support@taxmancapital.com',
        pass: process.env.EMAIL_PASSWORD || 'mock_password'
      }
    });
  }

  async sendEmail({ to, subject, html, text }) {
    // In dev / test mode without active SMTP, gracefully log
    if (!process.env.EMAIL_PASSWORD || process.env.EMAIL_PASSWORD === 'app_password_mock') {
      console.log(`📧 [Simulated Email Sent] To: ${to} | Subject: ${subject}`);
      return { messageId: 'simulated-id-' + Date.now() };
    }

    try {
      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || '"The TaxMan\'s Capital" <noreply@taxmancapital.com>',
        to,
        subject,
        text: text || '',
        html
      });
      console.log('📧 Email successfully dispatched:', info.messageId);
      return info;
    } catch (err) {
      console.error('📧 Email delivery failed:', err.message);
      return null;
    }
  }

  async sendWelcomeEmail(user) {
    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #021B3A; color: #ffffff; padding: 40px 20px; border-radius: 12px;">
        <h1 style="color: #00C853; margin-bottom: 10px;">Welcome to The TaxMan's Capital!</h1>
        <p>Assalamu Alaikum <strong>${user.name}</strong>,</p>
        <p>Your account has been successfully created on Pakistan's premier career & education platform for CA & ACCA students.</p>
        <div style="background-color: #011126; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #00C853;">
          <p style="margin: 0; font-size: 14px;"><strong>Your Registered Email:</strong> ${user.email}</p>
          <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Target Qualification:</strong> ${user.qualification || 'CAF'}</p>
        </div>
        <p>Explore latest firm inductions, download Big 4 CV templates, and access 24/7 AI study tutoring!</p>
        <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/login" style="display: inline-block; background-color: #00C853; color: #ffffff; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin-top: 15px;">Launch Dashboard</a>
      </div>
    `;
    return this.sendEmail({
      to: user.email,
      subject: "Welcome to The TaxMan's Capital Platform 🌟",
      html
    });
  }

  async sendCounselingReplyEmail({ studentEmail, studentName, querySubject, replyText, adminName }) {
    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #021B3A; color: #ffffff; padding: 40px 20px; border-radius: 12px;">
        <h2 style="color: #00C853;">Response to Your Counseling Query</h2>
        <p>Dear <strong>${studentName}</strong>,</p>
        <p>Our mentor <strong>${adminName || 'Saboor Ahmad'}</strong> has reviewed your query regarding: <em>"${querySubject || 'Career Guidance'}"</em>.</p>
        <div style="background-color: #ffffff; color: #021B3A; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #021B3A;">Mentor's Advice:</h4>
          <p style="white-space: pre-line; line-height: 1.6;">${replyText}</p>
        </div>
        <p style="font-size: 12px; color: #8899aa;">The TaxMan's Capital Mentorship Team — Guidance. Opportunities. Success.</p>
      </div>
    `;
    return this.sendEmail({
      to: studentEmail,
      subject: `Official Response: ${querySubject || 'Career Guidance Inquiry'}`,
      html
    });
  }
}

export const emailService = new EmailService();
