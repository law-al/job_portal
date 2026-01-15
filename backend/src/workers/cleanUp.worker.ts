import { Worker } from 'bullmq';
import { deleteExpiredTokens } from '../services/refreshToken.service.js';
import { connection } from '../utils/redis.js';

type JobName = 'refresh-clean';

function initCleanUpWorker() {
  const cleanUpWorker = new Worker(
    'clean-up',
    async (job) => {
      try {
        const name = job.name as JobName;

        switch (name) {
          case 'refresh-clean': {
            await deleteExpiredTokens();
            break;
          }
        }

        console.log('Clean up success');
      } catch (error) {
        console.log('Clean up error', error);
        throw error;
      }
    },
    { connection },
  );

  cleanUpWorker.on('completed', (job) => {
    console.log(`${job.name} completed`);
  });

  return cleanUpWorker;
}

export default initCleanUpWorker;
