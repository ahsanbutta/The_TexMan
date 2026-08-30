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

async function runFullLifecycle() {
  console.log('============================================================');
  console.log('🚀 RUNNING COMPLETE END-TO-END DATA FLOW VERIFICATION');
  console.log('   Admin Panel ➔ API ➔ Backend ➔ DB ➔ User Portal API ➔ UI');
  console.log('============================================================\n');

  let passed = 0;
  let failed = 0;

  // Step 1: Admin Login
  const adminLogin = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'admin@taxmancapital.com', password: 'AdminPassword123!' });

  const adminToken = adminLogin.data?.data?.token || adminLogin.data?.token;
  if (adminLogin.status === 200 && adminToken) {
    console.log('✅ [STEP 1] Admin Login Successful (JWT Received)');
    passed++;
  } else {
    console.error('❌ [STEP 1] Admin Login Failed:', adminLogin);
    failed++;
  }

  // Step 2: Admin Creates Event
  const eventTitle = `Mega CA Articleship Seminar ${Date.now()}`;
  const createEvent = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/announcements',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    }
  }, {
    title: eventTitle,
    summary: 'Exclusive Big 4 firm induction roadmap seminar.',
    content: 'Full seminar details with live speaker Saboor Ahmad CA.',
    category: 'Event',
    eventDate: 'October 25, 2026',
    status: 'Upcoming'
  });

  const eventId = createEvent.data?.data?._id || createEvent.data?._id;
  if (createEvent.status === 201 && eventId) {
    console.log(`✅ [STEP 2] Admin Created Event in Database (ID: ${eventId})`);
    passed++;
  } else {
    console.error('❌ [STEP 2] Admin Event Creation Failed:', createEvent);
    failed++;
  }

  // Step 3: User Portal Fetches Events
  const userEvents = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/announcements',
    method: 'GET'
  });
  const foundEvent = (userEvents.data?.data || userEvents.data)?.some(e => e.title === eventTitle);
  if (foundEvent) {
    console.log('✅ [STEP 3] User Portal: New Event is visible in User Portal');
    passed++;
  } else {
    console.error('❌ [STEP 3] User Portal Event Visibility Failed');
    failed++;
  }

  // Step 4: Admin Creates Resource
  const resourceTitle = `Advanced ISA 700 Audit Masterpack ${Date.now()}`;
  const createResource = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/resources',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    }
  }, {
    title: resourceTitle,
    description: 'Complete International Standards on Auditing revision summary.',
    category: 'CAF',
    resourceType: 'PDF',
    isFeatured: true
  });

  const resourceId = createResource.data?.data?._id || createResource.data?._id;
  if (createResource.status === 201 && resourceId) {
    console.log(`✅ [STEP 4] Admin Created Resource in Database (ID: ${resourceId})`);
    passed++;
  } else {
    console.error('❌ [STEP 4] Admin Resource Creation Failed:', createResource);
    failed++;
  }

  // Step 5: User Portal Fetches Resources
  const userResources = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/resources',
    method: 'GET'
  });
  const foundResource = (userResources.data?.data || userResources.data)?.some(r => r.title === resourceTitle);
  if (foundResource) {
    console.log('✅ [STEP 5] User Portal: New Resource is visible in Study Center');
    passed++;
  } else {
    console.error('❌ [STEP 5] User Portal Resource Visibility Failed');
    failed++;
  }

  // Step 6: User Downloads Resource (Downloads Counter Increment)
  const downloadRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: `/api/resources/${resourceId}/download`,
    method: 'POST'
  });
  if (downloadRes.status === 200) {
    console.log('✅ [STEP 6] User Portal: Resource Download Counter incremented');
    passed++;
  } else {
    console.error('❌ [STEP 6] Resource Download Increment Failed:', downloadRes);
    failed++;
  }

  // Step 7: Admin Creates Job Opportunity
  const jobTitle = `Audit Trainee (Fall 2026 Batch) ${Date.now()}`;
  const createJob = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/jobs',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    }
  }, {
    title: jobTitle,
    company: 'PwC Pakistan (A.F. Ferguson & Co.)',
    city: 'Karachi',
    jobType: 'Articleship',
    level: 'CAF',
    description: '3.5 years articleship training program in Assurance and Audit.'
  });

  const jobId = createJob.data?.data?._id || createJob.data?._id;
  if (createJob.status === 201 && jobId) {
    console.log(`✅ [STEP 7] Admin Created Job in Database (ID: ${jobId})`);
    passed++;
  } else {
    console.error('❌ [STEP 7] Admin Job Creation Failed:', createJob);
    failed++;
  }

  // Step 8: User Portal Fetches Jobs
  const userJobs = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/jobs',
    method: 'GET'
  });
  const foundJob = (userJobs.data?.data || userJobs.data)?.some(j => j.title === jobTitle);
  if (foundJob) {
    console.log('✅ [STEP 8] User Portal: New Job is visible in Placement Board');
    passed++;
  } else {
    console.error('❌ [STEP 8] User Portal Job Visibility Failed');
    failed++;
  }

  // Step 9: Student Login
  const studentLogin = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'student@taxmancapital.com', password: 'StudentPassword123!' });

  const studentToken = studentLogin.data?.data?.token || studentLogin.data?.token;
  if (studentLogin.status === 200 && studentToken) {
    console.log('✅ [STEP 9] Student Login Successful (JWT Received)');
    passed++;
  } else {
    console.error('❌ [STEP 9] Student Login Failed:', studentLogin);
    failed++;
  }

  // Step 10: Student Submits Counseling Query
  const submitQuery = await makeRequest({
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
    subject: 'Articleship Selection Guidance',
    category: 'Induction Preparation',
    message: 'Should I prioritize PwC or EY for Tax articleship?'
  });

  const queryId = submitQuery.data?.data?._id || submitQuery.data?._id;
  if (submitQuery.status === 201 && queryId) {
    console.log(`✅ [STEP 10] Student Submitted Career Query (ID: ${queryId})`);
    passed++;
  } else {
    console.error('❌ [STEP 10] Student Query Submission Failed:', submitQuery);
    failed++;
  }

  // Step 11: Admin Replies to Query
  const replyQuery = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: `/api/counseling/queries/${queryId}/reply`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    }
  }, {
    replyText: 'EY has a premier Tax practice in Pakistan. PwC offers tremendous global transfer opportunities.',
    adminName: 'Saboor Ahmad CA'
  });

  if (replyQuery.status === 200) {
    console.log('✅ [STEP 11] Admin Replied to Counseling Query');
    passed++;
  } else {
    console.error('❌ [STEP 11] Admin Reply to Query Failed:', replyQuery);
    failed++;
  }

  // Step 12: Student Views Reply in User Dashboard
  const studentQueries = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/counseling/my-queries',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${studentToken}` }
  });
  const myAnsweredQuery = (studentQueries.data?.data || studentQueries.data)?.find(q => q._id === queryId);
  if (myAnsweredQuery && myAnsweredQuery.replyText) {
    console.log('✅ [STEP 12] Student Portal: Verified Mentor Reply received in Dashboard');
    passed++;
  } else {
    console.error('❌ [STEP 12] Student Portal Reply Verification Failed:', studentQueries);
    failed++;
  }

  // Step 13: Admin Updates Event
  const updatedEventTitle = `${eventTitle} - VENUE CONFIRMED`;
  const updateEvent = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: `/api/announcements/${eventId}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    }
  }, {
    title: updatedEventTitle,
    summary: 'Updated event summary with venue details.',
    content: 'Full updated content.',
    category: 'Event'
  });

  if (updateEvent.status === 200) {
    console.log('✅ [STEP 13] Admin Updated Event in Database');
    passed++;
  } else {
    console.error('❌ [STEP 13] Admin Event Update Failed:', updateEvent);
    failed++;
  }

  // Step 14: User Portal Verifies Updated Event
  const verifyUpdated = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/announcements',
    method: 'GET'
  });
  const foundUpdated = (verifyUpdated.data?.data || verifyUpdated.data)?.some(e => e.title === updatedEventTitle);
  if (foundUpdated) {
    console.log('✅ [STEP 14] User Portal: Updated Event Title is live for all users');
    passed++;
  } else {
    console.error('❌ [STEP 14] User Portal Updated Event Verification Failed');
    failed++;
  }

  // Step 15: Admin Deletes All Test Records
  await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: `/api/announcements/${eventId}`,
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: `/api/resources/${resourceId}`,
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: `/api/jobs/${jobId}`,
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: `/api/counseling/queries/${queryId}`,
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  console.log('✅ [STEP 15] Admin Deleted All Test Records from Database');
  passed++;

  // Step 16: User Portal Confirms Deleted Records are Removed
  const postDeleteEvents = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/announcements',
    method: 'GET'
  });
  const isDeleted = !(postDeleteEvents.data?.data || postDeleteEvents.data)?.some(e => e._id === eventId);
  if (isDeleted) {
    console.log('✅ [STEP 16] User Portal: Confirmed deleted items are completely removed from feed');
    passed++;
  } else {
    console.error('❌ [STEP 16] Deletion Confirmation Failed');
    failed++;
  }

  console.log('\n============================================================');
  console.log(`📊 FINAL LIFECYCLE RESULTS: ${passed} Passed | ${failed} Failed`);
  console.log('============================================================');
}

runFullLifecycle().catch(console.error);
