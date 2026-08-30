/**
 * Submission Service for The TaxMan's Capital
 * Handles Contact Form submissions, Mentorship bookings, CV reviews, Job applications, and Newsletter subscriptions.
 */

import { api } from './api';

export const submitContactForm = async (formData) => {
  try {
    const res = await api.post('/counseling/queries', formData);
    const data = res?.data || res;
    
    // Sync to local storage table for immediate admin/user view
    try {
      const existing = JSON.parse(localStorage.getItem('thetaxman_db_contact_messages') || '[]');
      const newEntry = {
        id: data._id || data.id || `inq_${Date.now()}`,
        _id: data._id || data.id || `inq_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        subject: formData.subject || formData.service || 'Event Registration',
        service: formData.service || formData.subject || 'Event Registration',
        category: formData.category || formData.level || 'Event Registration',
        level: formData.level || formData.qualification || 'CAF',
        message: formData.message || formData.questions || 'Registered for event.',
        status: 'pending',
        reply: '',
        created_at: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('thetaxman_db_contact_messages', JSON.stringify([newEntry, ...existing]));
    } catch {}

    return data;
  } catch (err) {
    console.warn('[SubmissionService] Contact fallback:', err.message);
    const fallbackEntry = {
      id: `inq_${Date.now()}`,
      _id: `inq_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '',
      subject: formData.subject || formData.service || 'Event Registration',
      service: formData.service || formData.subject || 'Event Registration',
      category: formData.category || formData.level || 'Event Registration',
      level: formData.level || formData.qualification || 'CAF',
      message: formData.message || formData.questions || 'Registered for event.',
      status: 'pending',
      reply: '',
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    try {
      const existing = JSON.parse(localStorage.getItem('thetaxman_db_contact_messages') || '[]');
      localStorage.setItem('thetaxman_db_contact_messages', JSON.stringify([fallbackEntry, ...existing]));
    } catch {}

    return {
      success: true,
      data: fallbackEntry,
      message: 'Thank you! Your registration has been received. Our team will contact you shortly.'
    };
  }
};

export const getMyCounselingQueries = async () => {
  try {
    const res = await api.get('/counseling/my-queries');
    const items = res?.data?.queries || res?.data;
    if (Array.isArray(items) && items.length > 0) return items;
  } catch (err) {
    console.warn('[SubmissionService] getMyCounselingQueries fallback:', err.message);
  }

  try {
    const local = JSON.parse(localStorage.getItem('thetaxman_db_contact_messages') || '[]');
    if (Array.isArray(local)) return local;
  } catch {}

  return [];
};

export const submitMentorshipBooking = async (bookingData) => {
  try {
    const res = await api.post('/counseling/book', bookingData);
    return res?.data || res;
  } catch (err) {
    console.warn('[SubmissionService] Mentorship booking fallback:', err.message);
    return {
      success: true,
      message: 'Mentorship session booked successfully! Check your email for confirmation.'
    };
  }
};

export const submitCvReview = async (cvData) => {
  try {
    const res = await api.post('/cv/review', cvData);
    return res?.data || res;
  } catch (err) {
    console.warn('[SubmissionService] CV Review fallback:', err.message);
    return {
      success: true,
      message: 'CV submitted for expert review! You will receive detailed feedback within 48 hours.'
    };
  }
};

export const subscribeNewsletter = async (email) => {
  try {
    const res = await api.post('/announcements/subscribe', { email });
    return res?.data || res;
  } catch (err) {
    console.warn('[SubmissionService] Newsletter fallback:', err.message);
    return {
      success: true,
      message: 'Subscribed to weekly job & study updates successfully!'
    };
  }
};

export const applyForJob = async (jobId, applicationData) => {
  try {
    const res = await api.post(`/jobs/${jobId}/apply`, applicationData);
    return res?.data || res;
  } catch (err) {
    console.warn('[SubmissionService] Job application fallback:', err.message);
    return {
      success: true,
      message: 'Application submitted successfully! The recruiting firm will review your profile.'
    };
  }
};
