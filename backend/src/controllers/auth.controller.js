import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { emailService } from '../services/email.service.js';

// Cookie options for production security
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: (Number(process.env.JWT_COOKIE_EXPIRES_DAYS) || 7) * 24 * 60 * 60 * 1000
};

/**
 * Register a new User (Student / Mentor / Employer)
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, username, phone, qualification, level, role } = req.body;

  // Check if email already registered
  const existingEmail = await User.findOne({ email: email.toLowerCase() });
  if (existingEmail) {
    throw new ApiError(409, 'An account with this email address already exists. Please log in.');
  }

  // Derive username if not explicitly given
  const derivedUsername = username || email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(100 + Math.random() * 900);

  // Check if username taken
  const existingUsername = await User.findOne({ username: derivedUsername });
  const finalUsername = existingUsername ? `${derivedUsername}_${Date.now().toString().slice(-4)}` : derivedUsername;

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    username: finalUsername,
    password,
    phone: phone || '',
    qualification: qualification || 'CAF',
    level: level || qualification || 'CAF',
    role: role || 'student'
  });

  const token = user.generateAuthToken();

  // Send welcome email in background
  emailService.sendWelcomeEmail(user).catch(console.error);

  // Set httpOnly session cookie
  res.cookie('taxman_session', token, cookieOptions);
  res.cookie('token', token, cookieOptions);

  const userData = user.toObject();
  delete userData.password;

  return new ApiResponse(
    201,
    { user: userData, token },
    'Registration successful! Welcome to The TaxMan\'s Capital.'
  ).send(res);
});

/**
 * Login User
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Please provide both email and password.');
  }

  // Find user in database and explicitly select password
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
  if (!user) {
    throw new ApiError(401, 'No account found with this email. Please sign up first.');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account is deactivated. Please contact support.');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Invalid credentials. Incorrect password.');
  }

  const token = user.generateAuthToken();

  // Set httpOnly session cookie
  res.cookie('taxman_session', token, cookieOptions);
  res.cookie('token', token, cookieOptions);

  const userData = user.toObject();
  delete userData.password;

  return new ApiResponse(
    200,
    { user: userData, token },
    `Welcome back, ${user.name}!`
  ).send(res);
});

/**
 * Logout User
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('taxman_session', cookieOptions);
  res.clearCookie('token', cookieOptions);

  return new ApiResponse(200, null, 'Logged out successfully.').send(res);
});

/**
 * Get Current Active User Profile
 * GET /api/auth/me
 */
export const getMe = asyncHandler(async (req, res) => {
  return new ApiResponse(200, req.user, 'Active user session profile retrieved.').send(res);
});

/**
 * Update Current User Profile
 * PUT /api/auth/profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    'name',
    'fullName',
    'full_name',
    'username',
    'phone',
    'city',
    'bio',
    'institution',
    'papersCleared',
    'qualification',
    'level',
    'skills',
    'interests',
    'profileImage',
    'avatarUrl',
    'avatar_url',
    'cvUrl'
  ];

  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      if (field === 'fullName' || field === 'full_name') {
        updates.name = req.body[field];
      } else if (field === 'avatarUrl' || field === 'avatar_url') {
        updates.profileImage = req.body[field];
      } else if (field === 'username') {
        const cleanUsername = req.body.username.trim().toLowerCase();
        if (cleanUsername) {
          // Check if username taken by another user with different email / id
          const existing = await User.findOne({ username: cleanUsername });
          if (
            existing &&
            existing.email?.toLowerCase() !== req.user.email?.toLowerCase() &&
            existing._id?.toString() !== req.user._id?.toString() &&
            existing._id?.toString() !== req.user.id?.toString()
          ) {
            throw new ApiError(400, 'This username is already taken. Please choose another one.');
          }
          updates.username = cleanUsername;
        }
      } else {
        updates[field] = req.body[field];
      }
    }
  }

  let updatedUser = null;
  if (req.user._id && mongoose.Types.ObjectId.isValid(req.user._id)) {
    updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    }).select('-password');
  } else if (req.user.email) {
    updatedUser = await User.findOneAndUpdate({ email: req.user.email.toLowerCase() }, updates, {
      new: true,
      runValidators: true
    }).select('-password');
  }

  if (!updatedUser) {
    updatedUser = {
      ...req.user,
      ...updates
    };
  }

  const userObj = updatedUser.toObject ? updatedUser.toObject() : { ...updatedUser };
  userObj.avatar_url = userObj.profileImage || userObj.avatarUrl || userObj.avatar_url;

  return new ApiResponse(200, userObj, 'Profile updated successfully.').send(res);
});

/**
 * Change Password
 * PUT /api/auth/change-password
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Please provide both current and new password.');
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, 'New password must be at least 6 characters long.');
  }

  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(400, 'Current password entered is incorrect.');
  }

  user.password = newPassword;
  await user.save();

  return new ApiResponse(200, null, 'Password changed successfully.').send(res);
});
