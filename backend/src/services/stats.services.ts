import { prisma } from '../utils/prismaClient.js';
import { startOfMonth, subMonths } from 'date-fns';

export const GetDashboardStats = async (companyId: string) => {
  try {
    const CURRENT_MONTH_START = startOfMonth(new Date());
    const LAST_MONTH_START = startOfMonth(subMonths(new Date(), 1));

    // Get Total User
    const totalUsers = await prisma.userCompany.count({
      where: {
        companyId,
        status: 'ACTIVE',
      },
    });

    // Get Last Month User Counts
    const totalUsersPreviousMonth = await prisma.userCompany.count({
      where: {
        companyId,
        status: 'ACTIVE',
        createdAt: {
          lt: CURRENT_MONTH_START,
        },
      },
    });

    // Count active jobs (OPEN status)
    const activeJobs = await prisma.job.count({
      where: {
        companyId,
        status: 'OPEN',
        isClosed: false,
      },
    });

    const activeJobsPreviousMonth = await prisma.job.count({
      where: {
        companyId,
        status: 'OPEN',
        isClosed: false,
        createdAt: {
          lt: CURRENT_MONTH_START,
        },
      },
    });

    // Count new applications (created this month)
    const newApplications = await prisma.application.count({
      where: {
        companyId,
        createdAt: {
          gte: CURRENT_MONTH_START,
        },
      },
    });

    const newApplicationsLastMonth = await prisma.application.count({
      where: {
        companyId,
        createdAt: {
          gte: LAST_MONTH_START,
          lt: CURRENT_MONTH_START,
        },
      },
    });

    const calculateChange = (current: number, previous: number): { value: string; positive: boolean } => {
      if (previous === 0) {
        return { value: current > 0 ? '+100%' : '0%', positive: current > 0 };
      }
      const change = ((current - previous) / previous) * 100;
      const sign = change >= 0 ? '+' : '';
      return {
        value: `${sign}${change.toFixed(1)}% from last month`,
        positive: change >= 0,
      };
    };

    const usersChange = calculateChange(totalUsers, totalUsersPreviousMonth);
    const jobsChange = calculateChange(activeJobs, activeJobsPreviousMonth);
    const applicationsChange = calculateChange(newApplications, newApplicationsLastMonth);

    return {
      totalUsers: {
        value: totalUsers.toLocaleString(),
        change: usersChange.value,
        positive: usersChange.positive,
      },
      activeJobs: {
        value: activeJobs.toLocaleString(),
        change: jobsChange.value,
        positive: jobsChange.positive,
      },
      newApplications: {
        value: newApplications.toLocaleString(),
        change: applicationsChange.value,
        positive: applicationsChange.positive,
      },
    };
  } catch (error) {
    throw error;
  }
};
