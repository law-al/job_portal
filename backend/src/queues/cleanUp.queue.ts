import { Queue } from 'bullmq';

const cleanUpQueue = new Queue('clean-up');

cleanUpQueue.add(
  'refresh-clean',
  {},
  {
    repeat: {
      pattern: '*/5 * * * * *', // Run every night at midnight
    },
  },
);

export default cleanUpQueue;
