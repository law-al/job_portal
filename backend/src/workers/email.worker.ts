import { Worker } from 'bullmq';
import { connection } from '../utils/redis.js';
import { sendForgetPasswordEmail, sendInvitationEmail, sendVerificationEmail } from '../services/mail.service.js';
import logger from '../utils/logger.js';

type JobName = 'verification' | 'forgot-password' | 'invite';

interface VerificationData {
  email: string;
  token: string;
}

interface InviteData {
  email: string;
  token: string;
  companyName: string;
  role: string;
}

function initEmailWorker() {
  const emailWorker = new Worker(
    'emails',
    async (job) => {
      try {
        const name = job.name as JobName;
        switch (name) {
          case 'verification': {
            const data = job.data as VerificationData;
            await sendVerificationEmail(data.email, data.token);
            break;
          }

          case 'forgot-password': {
            const data = job.data as VerificationData;
            await sendForgetPasswordEmail(data.email, data.token);
            break;
          }

          case 'invite': {
            const data = job.data as InviteData;
            await sendInvitationEmail(data.email, data.token, data.companyName, data.role);
            break;
          }

          default: {
            logger.error('Job Type not specified');
            return;
          }
        }

        console.log('Email has been sent');
      } catch (error) {
        // Log the error, optionally retry
        logger.error('Failed to process email job', error);
        throw error;
      }
    },
    { connection },
  );

  emailWorker.on('completed', (job) => {
    console.log(`Job ${job.id} has completed!`);
  });

  emailWorker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} has failed with ${err.message}`);
  });

  return emailWorker;
}

export default initEmailWorker;
