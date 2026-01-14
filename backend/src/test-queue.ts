import { Queue, Worker } from 'bullmq';

// 1. Create a Queue
const myQueue = new Queue('test-queue', {
  // Added cos redis is not installed locally, but on docker, so this is a way to connect to the docker redis service
  connection: { host: '127.0.0.1', port: 6379 },
});

// 2. Create a Worker (The Chef)
const worker = new Worker(
  'test-queue',
  async (job: any) => {
    console.log('Processing job:', job.data);
    return 'Done!';
  },
  {
    connection: { host: '127.0.0.1', port: 6379 },
  },
);

// 3. Add a job to the queue (The Ticket)
async function addJob() {
  await myQueue.add('simpleJob', { message: 'Hello from BullMQ!' });
  console.log('Job added!');
}

addJob();
