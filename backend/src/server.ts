import app from './app.js';
import config from './config/config.js';
import connectDB from './utils/connectMongoDb.js';
import logger from './utils/logger.js';

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
    await connectDB();

    app.listen(config.port, () => {
      logger.info(`🚀 My app is running! Process ID: ${process.pid}`);
      console.log(`Server is running on port ${config.port}`);
      console.log(`Environment: ${config.nodeEnv || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

await startServer();
