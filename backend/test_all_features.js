import http from 'http';

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runComprehensiveTest() {
  console.log('============================================================');
  console.log('🧪 RUNNING COMPREHENSIVE BACKEND & PORTAL AUDIT TEST SUITE');
  console.log('============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(name, condition) {
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name}`);
      failed++;
    }
  }

  // 1. Admin Login
  const loginRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: 'admin@taxmancapital.com',
    password: 'AdminPassword123!'
  });

  const adminToken = loginRes.data?.data?.token;
  assert('Admin Authentication (JWT Received)', !!adminToken);

  // 2. Admin Profile Update Test
  const updateProfileRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/profile',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    }
  }, {
    full_name: 'Saboor Ahmad',
    username: 'saboornoor',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
  });

  assert('Admin Profile Update (name & username saved)', updateProfileRes.status === 200 && updateProfileRes.data?.data?.name === 'Saboor Ahmad');

  // Verify persistence by fetching /api/auth/me
  const meRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });

  assert('Admin Profile Verified via /api/auth/me (DB Persistence)', meRes.data?.data?.username === 'saboornoor' && meRes.data?.data?.name === 'Saboor Ahmad');

  // 3. Resource CRUD Test
  const createRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/resources',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    }
  }, {
    title: 'Audit Trainee Master Guide 2026',
    description: 'Complete syllabus and test questions for PwC & EY Pakistan.',
    category: 'CAF',
    resourceType: 'PDF',
    download_url: 'https://taxmancapital.com/files/audit_trainee_guide.pdf'
  });

  const resourceId = createRes.data?.data?._id || createRes.data?.data?.id;
  assert('Resource Creation in DB', createRes.status === 201 && !!resourceId);

  // Fetch Resources (Admin List & User Portal)
  const getRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/resources',
    method: 'GET'
  });

  const foundResource = getRes.data?.data?.find?.(r => (r._id || r.id) === resourceId);
  assert('Resource Appears in Portal Feed & Admin List', !!foundResource);

  // Increment Resource Download
  const downloadRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: `/api/resources/${resourceId}/download`,
    method: 'POST'
  });
  assert('Resource Download Tracking', downloadRes.status === 200);

  // Delete Resource
  const deleteRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: `/api/resources/${resourceId}`,
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert('Resource Deletion from DB', deleteRes.status === 200);

  // 4. Notifications & Inquiries Delete Test
  const submitInquiry = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/counseling/queries',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Hamza Khan',
    email: 'hamza.k@gmail.com',
    phone: '+92 321 7654321',
    level: 'CAF',
    category: 'Interview Preparation',
    message: 'How should I answer why I want to join Audit in KPMG?'
  });

  const queryId = submitInquiry.data?.data?._id || submitInquiry.data?.data?.id;
  assert('Student Inquiry Submission', submitInquiry.status === 201 && !!queryId);

  // Admin Reply
  const replyInquiry = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: `/api/counseling/queries/${queryId}/reply`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    }
  }, {
    replyText: 'Highlight understanding of ICAP audit standards and KPMG global audit methodology.'
  });
  assert('Admin Answered Counseling Inquiry', replyInquiry.status === 200);

  // Admin Delete Inquiry
  const deleteInquiryRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: `/api/counseling/queries/${queryId}`,
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert('Admin Deleted Inquiry Message', deleteInquiryRes.status === 200);

  // 5. Events & Announcements Test
  const createAnnRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/announcements',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    }
  }, {
    title: 'ICAP Autumn 2026 Induction Webinar',
    summary: 'Live session with partners from Big 4 firms.',
    content: 'Exclusive 2-hour webinar on articleship opportunities and CV screening.',
    category: 'Event'
  });

  const annId = createAnnRes.data?.data?._id || createAnnRes.data?.data?.id;
  assert('Event/Announcement Created in DB', createAnnRes.status === 201 && !!annId);

  // Fetch Announcements
  const getAnnRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/announcements',
    method: 'GET'
  });

  const foundAnn = getAnnRes.data?.data?.find?.(a => (a._id || a.id) === annId);
  assert('Event Appears in Admin Feed & User Portal', !!foundAnn);

  // Delete Announcement
  const deleteAnnRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: `/api/announcements/${annId}`,
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert('Event/Announcement Deleted from DB', deleteAnnRes.status === 200);

  console.log('\n============================================================');
  console.log(`📊 FINAL TEST AUDIT RESULTS: ${passed} Passed | ${failed} Failed`);
  console.log('============================================================\n');
}

runComprehensiveTest();
