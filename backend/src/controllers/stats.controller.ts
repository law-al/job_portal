import type { Request, Response } from 'express';
import { GetDashboardStats } from '../services/stats.services.js';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const { id: companyId } = req.params;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required',
      });
    }

    const stats = await GetDashboardStats(companyId);

    return res.status(200).json({
      success: true,
      message: 'Dashboard stats retrieved successfully',
      data: stats,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve dashboard stats',
    });
  }
};
