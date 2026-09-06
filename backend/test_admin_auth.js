import { User } from './src/models/User.js';
import mongoose from 'dotenv';
import jwt from 'jsonwebtoken';

const BASE_URL = 'http://localhost:5000/api';

async function testAdminEndpoints() {
  const token = jwt.sign(
    { id: '65f000000000000000000001', email: 'sagheerahmad5767@gmail.com', role: 'admin' },
    'super_secret_production_jwt_taxman_capital_2026_key_secure',
    { expiresIn: '7d' }
  );

  console.log('Testing GET /api/admin/users with admin Bearer token ...');
  const res1 = await fetch(`${BASE_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('Status /api/admin/users:', res1.status);

  console.log('Testing GET /api/counseling/inquiries with admin Bearer token ...');
  const res2 = await fetch(`${BASE_URL}/counseling/inquiries`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('Status /api/counseling/inquiries:', res2.status);
}

testAdminEndpoints();
