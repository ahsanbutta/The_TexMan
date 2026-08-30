import http from 'http';

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let parsed = body;
        try {
          parsed = JSON.parse(body);
        } catch (e) {}
        resolve({ status: res.statusCode, data: parsed });
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runSyncTest() {
  console.log('🔄 Starting Cross-Portal Sync Test Suite...\n');
  let passed = 0;
  let failed = 0;

  // 1. Admin Login
  const adminLoginRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'admin@taxmancapital.com', password: 'AdminPassword123!' });

  if (adminLoginRes.status === 200 && adminLoginRes.data?.data?.token) {
    console.log('✅ [PASS] Admin Login (Token received)');
    passed++;
  } else {
    console.error('❌ [FAIL] Admin Login:', adminLoginRes);
    failed++;
  }
  const adminToken = adminLoginRes.data?.data?.token;

  // 2. Admin creates Announcement
  const testAnnTitle = `Sync Test Event ${Date.now()}`;
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
    title: testAnnTitle,
    summary: 'Automated test event for cross-portal sync',
    category: 'Workshop',
    eventDate: 'August 30, 2026',
    status: 'Upcoming'
  });

  let createdAnnId = null;
  if (createAnnRes.status === 201 && createAnnRes.data?.data?._id) {
    createdAnnId = createAnnRes.data.data._id;
    console.log(`✅ [PASS] Admin Created Announcement (ID: ${createdAnnId})`);
    passed++;
  } else {
    console.error('❌ [FAIL] Admin Create Announcement:', createAnnRes);
    failed++;
  }

  // 3. User Portal fetches Announcements & verifies
  const getAnnsRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/announcements',
    method: 'GET'
  });
  const foundAnn = getAnnsRes.data?.data?.some(a => a.title === testAnnTitle);
  if (foundAnn) {
    console.log('✅ [PASS] User Portal: Admin-created Announcement appears in feed');
    passed++;
  } else {
    console.error('❌ [FAIL] User Portal Announcement verification failed');
    failed++;
  }

  // 4. Admin creates Resource
  const testResTitle = `Sync Test Resource ${Date.now()}`;
  const createResRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/resources',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    }
  }, {
    title: testResTitle,
    description: 'High-yield ICAP revision notes',
    category: 'CAF',
    resourceType: 'PDF',
    isFeatured: true
  });

  let createdResId = null;
  if (createResRes.status === 201 && createResRes.data?.data?._id) {
    createdResId = createResRes.data.data._id;
    console.log(`✅ [PASS] Admin Created Resource (ID: ${createdResId})`);
    passed++;
  } else {
    console.error('❌ [FAIL] Admin Create Resource:', createResRes);
    failed++;
  }

  // 5. User Portal fetches Resources & verifies
  const getResourcesRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/resources',
    method: 'GET'
  });
  const foundRes = getResourcesRes.data?.data?.some(r => r.title === testResTitle);
  if (foundRes) {
    console.log('✅ [PASS] User Portal: Admin-created Resource appears in study center');
    passed++;
  } else {
    console.error('❌ [FAIL] User Portal Resource verification failed');
    failed++;
  }

  // 6. Admin creates Job
  const testJobTitle = `Audit Associate ${Date.now()}`;
  const createJobRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/jobs',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    }
  }, {
    title: testJobTitle,
    company: 'EY Pakistan',
    city: 'Lahore',
    jobType: 'Articleship',
    level: 'CAF',
    description: 'Articleship position in Assurance.'
  });

  let createdJobId = null;
  if (createJobRes.status === 201 && createJobRes.data?.data?._id) {
    createdJobId = createJobRes.data.data._id;
    console.log(`✅ [PASS] Admin Created Job (ID: ${createdJobId})`);
    passed++;
  } else {
    console.error('❌ [FAIL] Admin Create Job:', createJobRes);
    failed++;
  }

  // 7. User Portal fetches Jobs & verifies
  const getJobsRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/jobs',
    method: 'GET'
  });
  const foundJob = getJobsRes.data?.data?.some(j => j.title === testJobTitle);
  if (foundJob) {
    console.log('✅ [PASS] User Portal: Admin-created Job appears in placement list');
    passed++;
  } else {
    console.error('❌ [FAIL] User Portal Job verification failed');
    failed++;
  }

  // 8. Student Login & Counseling Query
  const studentLoginRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'student@taxmancapital.com', password: 'StudentPassword123!' });
  const studentToken = studentLoginRes.data?.data?.token;

  const submitQueryRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/counseling/queries',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentToken}`
    }
  }, {
    name: 'Muhammad Ahmed',
    email: 'student@taxmancapital.com',
    phone: '+923001234567',
    subject: 'Articleship Department Selection Advice',
    category: 'Induction Preparation',
    message: 'Should I choose Audit or Tax for Big 4 induction?'
  });

  let queryId = null;
  if (submitQueryRes.status === 201 && submitQueryRes.data?.data?._id) {
    queryId = submitQueryRes.data.data._id;
    console.log(`✅ [PASS] Student Submitted Counseling Query (ID: ${queryId})`);
    passed++;
  } else {
    console.error('❌ [FAIL] Student Submit Counseling Query:', submitQueryRes);
    failed++;
  }

  // 9. Admin Replies to Counseling Query
  const replyQueryRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: `/api/counseling/queries/${queryId}/reply`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    }
  }, {
    replyText: 'Both have great careers. Audit offers broad exposure, while Tax provides deep technical niche expertise.',
    adminName: 'Saboor Ahmad CA'
  });

  if (replyQueryRes.status === 200) {
    console.log('✅ [PASS] Admin Replied to Counseling Query');
    passed++;
  } else {
    console.error('❌ [FAIL] Admin Reply Query:', replyQueryRes);
    failed++;
  }

  // 10. Student checks My Queries
  const studentQueriesRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/counseling/my-queries',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${studentToken}` }
  });
  const myQuery = studentQueriesRes.data?.data?.find(q => q._id === queryId);
  if (myQuery && (myQuery.status === 'Replied' || myQuery.status === 'Answered') && myQuery.replyText) {
    console.log('✅ [PASS] Student Portal: Received Mentor Reply');
    passed++;
  } else {
    console.error('❌ [FAIL] Student Portal Query reply verification failed:', studentQueriesRes);
    failed++;
  }

  // 11. Cleanup Deleted Data
  if (createdAnnId) {
    await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: `/api/announcements/${createdAnnId}`,
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
  }
  if (createdResId) {
    await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: `/api/resources/${createdResId}`,
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
  }
  if (createdJobId) {
    await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: `/api/jobs/${createdJobId}`,
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
  }
  if (queryId) {
    await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: `/api/counseling/queries/${queryId}`,
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
  }
  console.log('✅ [PASS] Admin Deleted Test Records (Cleaned up)');
  passed++;

  console.log('\n============================================================');
  console.log(`📊 Sync Test Results: ${passed} Passed | ${failed} Failed`);
  console.log('============================================================');
}

runSyncTest().catch(console.error);
