import { z } from 'zod';
import { ApiError } from '../utils/apiError.js';

export const registerSchema = z.object({
  name: z.string().min(2).optional(),
  fullName: z.string().min(2).optional(),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  username: z.string().min(2).optional(),
  phone: z.string().optional(),
  qualification: z.string().optional(),
  level: z.string().optional(),
  role: z.enum(['student', 'mentor', 'employer', 'admin', 'user']).optional().default('student')
}).transform((data) => ({
  ...data,
  name: data.name || data.fullName || data.email.split('@')[0],
  username: data.username || data.email.split('@')[0],
  role: data.role === 'user' ? 'student' : data.role
}));

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      const errorMessages = error.errors ? error.errors.map((e) => e.message) : [error.message];
      next(new ApiError(400, 'Invalid request input data', errorMessages));
    }
  };
};
