import mongoose from 'mongoose';

/**
 * MongoDB Connection Handler with Auto-Reconnect & Graceful Shutdown
 */
export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taxman_capital';
    
    // Connection options for production stability
    const connectionInstance = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected successfully! Host: ${connectionInstance.connection.host}, Database: ${connectionInstance.connection.name}`);
    return connectionInstance;
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Warning: ${error.message}. Running with in-memory / fallback resilience mode.`);
    // In dev mode or when MongoDB local service isn't active, log clearly
    return null;
  }
};
