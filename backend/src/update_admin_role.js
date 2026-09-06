import mongoose from 'mongoose';
import { User } from './models/User.js';

async function updateRoles() {
  await mongoose.connect('mongodb://127.0.0.1:27017/taxman_capital');
  const res = await User.updateMany(
    {
      $or: [
        { email: { $regex: 'sagheer', $options: 'i' } },
        { email: { $regex: 'admin', $options: 'i' } },
        { username: { $regex: 'sagheer', $options: 'i' } },
        { username: 'admin' }
      ]
    },
    { $set: { role: 'admin' } }
  );
  console.log('✅ Updated users count:', res.modifiedCount);
  await mongoose.disconnect();
}

updateRoles();
