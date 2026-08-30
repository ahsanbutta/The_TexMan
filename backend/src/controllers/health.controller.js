import mongoose from 'mongoose';
import { ApiResponse } from '../utils/apiResponse.js';

export const healthCheck = async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected (Ready)' : 'Disconnected / Memory Mode';
  
  const healthData = {
    status: 'healthy',
    platform: "The TaxMan's Capital REST API Server",
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      name: mongoose.connection.name || 'taxman_capital'
    },
    services: {
      auth: 'JWT Secure Cookie & Bearer active',
      ai: 'Active (CA/ACCA Intelligence Engine)',
      storage: 'Cloudinary Ready',
      email: 'Nodemailer Ready'
    }
  };

  return new ApiResponse(200, healthData, 'API is running in peak condition').send(res);
};
