import mongoose from 'mongoose';
import { AIActivityLog } from '../../models/AIActivityLog.js';

/**
 * Health check and database diagnostics tool
 */
export async function checkDatabaseHealthTool({ agentName = 'Database Management Agent', taskId = '' } = {}) {
  const readyState = mongoose.connection.readyState;
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  const statusStr = states[readyState] || 'Unknown';

  const stats = {
    connectionState: statusStr,
    isConnected: readyState === 1,
    dbName: mongoose.connection.name || 'taxman_capital',
    host: mongoose.connection.host || 'localhost',
    timestamp: new Date().toISOString()
  };

  await AIActivityLog.create({
    agent: agentName,
    taskId,
    action: 'DATABASE_HEALTH_CHECK',
    toolUsed: 'checkDatabaseHealthTool',
    input: {},
    output: stats,
    status: readyState === 1 ? 'success' : 'warning'
  });

  return stats;
}
