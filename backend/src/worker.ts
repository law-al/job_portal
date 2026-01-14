import connectDB from './utils/connectMongoDb.js';
import './workers/cleanUp.worker.js';
import initCleanUpWorker from './workers/cleanUp.worker.js';
import initEmailWorker from './workers/email.worker.js';

const startWorkers = async () => {
  try {
    await connectDB();
    await initEmailWorker();
    await initCleanUpWorker();
    console.log('Background Workers are running and waiting for jobs...');
  } catch (error) {
    console.error('Failed to start workers:', error);
    process.exit(1);
  }
};

await startWorkers();
