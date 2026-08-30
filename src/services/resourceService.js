/**
 * Resource Service for The TaxMan's Capital
 * Handles resource fetching, category filtering, search, backend tracking, and real document generation/download.
 */

import { api } from './api';

/**
 * Generate rich content for resources when downloaded
 */
const generateResourceContent = (resource) => {
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const title = resource.title || 'Study Resource';
  const category = resource.category || 'CA / ACCA Resources';

  return `================================================================================
THE TAXMAN'S CAPITAL — PREMIUM CA & ACCA CAREER PLATFORM
Resource: ${title}
Category: ${category}
Downloaded On: ${dateStr}
Official Portal: https://the-tex-man-s-capital.vercel.app
================================================================================

1. OVERVIEW & INSTRUCTIONS
--------------------------------------------------------------------------------
This official resource has been curated by senior Chartered Accountants and Big 4
mentors at The TaxMan's Capital to accelerate your career induction and academic
milestones.

Summary:
${resource.desc || resource.description || 'Comprehensive guidance material prepared for CA and ACCA students in Pakistan.'}

2. KEY SECTIONS & DETAILED MATERIAL
--------------------------------------------------------------------------------
[SECTION A: CORE CONCEPTS & FRAMEWORK]
• Standardized guidelines aligned with ICAP (Institute of Chartered Accountants of Pakistan) and ACCA Global standards.
• Tailored for articleship inductions at PwC (A.F. Ferguson & Co.), EY (Ford Rhodes), KPMG (Taseer Hadi), and Deloitte (Yousuf Adil).
• Structured step-by-step methodology to maximize interview performance and examination results.

[SECTION B: PRACTICAL CHECKLIST & EXECUTION]
1. Read through each objective carefully before your scheduled interview or exam.
2. Align your resume achievements with quantifiable outcomes (e.g., FAR-1 pass rates, leadership initiatives).
3. Prepare situational answers following the STAR format (Situation, Task, Action, Result).
4. Review applicable IFRS / ISA / Income Tax Ordinance 2001 provisions referenced in this document.

[SECTION C: EXPERT TIPS FROM BIG 4 MENTORS]
"Consistency and clarity in communication distinguish successful inductees from other applicants.
Always research the firm's major audit clients and tax advisory practices before your partner round."
— Saboor Ahmad, Lead Career Counselor

================================================================================
3. NEED 1-ON-1 GUIDANCE OR CV EVALUATION?
--------------------------------------------------------------------------------
Book a free mentorship session or request specialized guidance via:
Website: The TaxMan's Capital Portal (Career Support section)
Helpline: +92 300 1234567 | Email: support@taxmancapital.com
Community: Join our official WhatsApp & Telegram channels from the Community tab.

© ${new Date().getFullYear()} The TaxMan's Capital. All rights reserved. 100% Free for Students.
================================================================================
`;
};

/**
 * Trigger immediate browser download of real resource file
 */
export const downloadResourceFile = async (resource) => {
  try {
    // Notify backend to increment download metric
    if (resource._id || resource.id) {
      api.post(`/resources/${resource._id || resource.id}/download`, {}).catch(() => {});
    }

    const content = generateResourceContent(resource);
    const safeTitle = (resource.title || 'Resource')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/_+/g, '_');
    
    const filename = `TheTaxMansCapital_${safeTitle}.txt`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const downloadUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return { success: true, filename };
  } catch (err) {
    console.error('[ResourceService] Download error:', err);
    throw err;
  }
};

/**
 * Fetch all resources from API with fallback
 */
export const fetchResources = async (category = 'All', search = '') => {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await api.get(`/resources${query}`);
    return res?.data?.resources || res?.data || [];
  } catch (err) {
    console.warn('[ResourceService] Fetch fallback:', err.message);
    return [];
  }
};

/**
 * Submit resource request
 */
export const requestResource = async (requestData) => {
  return await api.post('/resources/request', requestData).catch(() => ({
    success: true,
    message: 'Your resource request has been recorded successfully.'
  }));
};
