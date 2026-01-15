import app from './app.js';
import config from './config/config.js';
import cleanUpQueue from './queues/cleanUp.queue.js';
import connectDB from './utils/connectMongoDb.js';
import logger from './utils/logger.js';
import { connectRedis } from './utils/redis.js';

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    await connectRedis();

    // Initialize the cleanup queue (schedules the recurring job)
    // This needs to run in the server process to schedule jobs
    cleanUpQueue;

    // Start the server
    app.listen(config.port, () => {
      logger.info(`🚀 My app is running! Process ID: ${process.pid}`);
      console.log(`Server is running on port ${config.port}`);
      console.log(`Environment: ${config.nodeEnv || 'development'}`);
      console.log('Queue jobs are scheduled. Start workers with: pnpm dev:worker');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

await startServer();
