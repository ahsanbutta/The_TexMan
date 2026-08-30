import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Catch Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error('🔥 UNCAUGHT EXCEPTION! Error:', err);
});

// Start HTTP API Server
const server = app.listen(PORT, () => {
  console.log(`
============================================================
🚀 The TaxMan's Capital Backend API Server
📡 Listening on: http://localhost:${PORT}
🩺 Health Check: http://localhost:${PORT}/api/health
🌍 Environment: ${process.env.NODE_ENV || 'development'}
============================================================
  `);

  // Connect to Database asynchronously
  connectDB();
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`⚠️ Port ${PORT} is already in use by another process. Please close the other process or set PORT in .env.`);
  } else {
    console.error('🔥 Server error:', err);
  }
});

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.error('🔥 UNHANDLED REJECTION! Error:', err.message);
});

// Graceful Termination
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down HTTP server cleanly.');
  server.close(() => {
    console.log('💥 Process terminated.');
  });
});
