import { createJobSchema, jobSchema, updateJobSchema } from '../models/jobs.model.js';
import { createJobSlug } from '../utils/createSlugs.js';
import { prisma } from '../utils/prismaClient.js';
import { NotFoundException } from '../exceptions/exceptions.js';

// NOTE: FIND EXISTING PIPELINE BY NAME
// Searches for a job with the matching pipelineName in the same company
// Returns the pipeline stages if found
export const FindPipelineByName = async (companyId: string, pipelineName: string) => {
  try {
    if (!pipelineName || !pipelineName.trim()) {
      return null;
    }

    // Find a job in the same company with matching pipelineName
    const job = await prisma.job.findFirst({
      where: {
        companyId,
        pipelineName: pipelineName.trim(),
      },
      include: {
        pipelineStages: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Get the most recent one if multiple exist
      },
    });

    // If found, return the pipeline stages
    if (job && job.pipelineStages.length > 0) {
      return job.pipelineStages.map((stage) => ({
        name: stage.name,
        order: stage.order,
      }));
    }

    return null;
  } catch (error) {
    throw error;
  }
};

export const CreateJob = async (body: any) => {
  try {
    const validatedBody = createJobSchema.parse(body);

    // Determine which pipeline stages to use
    let pipelineStagesToUse = validatedBody.pipelineStages || [];

    // If pipelineName is provided, try to find and reuse existing pipeline
    if (validatedBody.pipelineName && validatedBody.pipelineName.trim()) {
      const existingPipeline = await FindPipelineByName(validatedBody.companyId, validatedBody.pipelineName);
      if (existingPipeline && existingPipeline.length > 0) {
        pipelineStagesToUse = existingPipeline;
      }
    }

    await prisma.job.create({
      data: {
        ...validatedBody,
        slug: createJobSlug(validatedBody.title, validatedBody.experienceLevel),
        salary_range: validatedBody.salary_range ?? null,
        deadline: validatedBody.deadline ?? null,
        slot: validatedBody.slot ?? null,
        pipelineName: validatedBody.pipelineName?.trim() || null,
        pipelineStages: {
          createMany: {
            data: pipelineStagesToUse.map((pipelineStage) => ({
              name: pipelineStage.name,
              order: pipelineStage.order,
            })),
          },
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

export const UpdateJob = async (id: string, body: any) => {
  try {
    const validatedBody = jobSchema.omit({ id: true, slug: true }).parse(body);
    await prisma.job.update({
      where: {
        id,
      },
      data: {
        ...validatedBody,
        slug: createJobSlug(validatedBody.title, validatedBody.experienceLevel),
        salary_range: validatedBody.salary_range ?? null,
        deadline: validatedBody.deadline ?? null,
        slot: validatedBody.slot ?? null,
        pipelineName: validatedBody.pipelineName?.trim() || null,
        pipelineStages: {
          deleteMany: {
            jobId: id,
          },
          createMany: {
            data: validatedBody.pipelineStages.map((pipelineStage) => ({
              name: pipelineStage.name,
              order: pipelineStage.order,
            })),
          },
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

export const FindJobBySlug = async (slug: string) => {
  try {
    return await prisma.job.findUnique({
      where: {
        slug,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const FindJobId = async (id: string) => {
  try {
    return await prisma.job.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    throw error;
  }
};

// Public: Get a single job by slug with similar jobs
export const GetJobWithSimilar = async (slug: string) => {
  try {
    const job = await prisma.job.findUnique({
      where: { slug },
      include: {
        company: {
          select: {
            description: true,
            id: true,
            name: true,
            logo: true,
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException(`job with slug ${slug} not found`);
    }

    const similarJobs = await prisma.job.findMany({
      where: {
        id: {
          not: job.id,
        },
        status: 'OPEN',
        isClosed: false,
        OR: [
          // Same company
          { companyId: job.companyId },
          // Same job type
          { jobType: job.jobType },
          // Same location (case-insensitive)
          {
            location: {
              equals: job.location,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 6,
    });

    return { job, similarJobs };
  } catch (error) {
    throw error;
  }
};

export const CloseJob = async (id: string) => {
  try {
    await prisma.job.update({
      where: {
        id,
      },
      data: {
        status: 'CLOSE',
        isClosed: true,
        closedAt: new Date(),
      },
    });
  } catch (error) {
    throw error;
  }
};

export const OpenJob = async (id: string) => {
  try {
    await prisma.job.update({
      where: {
        id,
      },
      data: {
        status: 'OPEN',
        isClosed: false,
        closedAt: null,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const DeleteJob = async (id: string) => {
  try {
    await prisma.job.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const FindCompanyJobs = async (
  companyId: string,
  options?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  },
) => {
  try {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      companyId,
    };

    // Add filters
    if (options?.status) {
      where.status = options.status;
    }

    if (options?.search) {
      where.OR = [
        {
          title: {
            contains: options.search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: options.search,
            mode: 'insensitive',
          },
        },
        {
          location: {
            contains: options.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          applications: {
            select: {
              id: true,
            },
          },
          pipelineStages: {
            select: {
              name: true,
              order: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.job.count({ where }),
    ]);

    return {
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw error;
  }
};

export const FindCompanyJob = async (companyId: string, slug: string) => {
  try {
    const job = await prisma.job.findFirst({
      where: {
        slug,
        companyId,
      },
      include: {
        applications: true,
        pipelineStages: {
          select: {
            name: true,
            order: true,
          },
        },
      },
    });

    return job;
  } catch (error) {
    throw error;
  }
};

// Get all unique pipeline names for a company
export const FindCompanyPipelines = async (companyId: string) => {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        companyId,
        pipelineName: {
          not: null,
        },
      },
      select: {
        pipelineName: true,
      },
      distinct: ['pipelineName'],
      orderBy: {
        pipelineName: 'asc',
      },
    });

    return jobs.map((job) => job.pipelineName).filter((name): name is string => name !== null);
  } catch (error) {
    throw error;
  }
};

// Get pipeline stages by pipeline name
export const GetPipelineStages = async (companyId: string, pipelineName: string) => {
  try {
    const pipeline = await FindPipelineByName(companyId, pipelineName);
    return pipeline;
  } catch (error) {
    throw error;
  }
};

export const GetPipelineStagesByJobId = async (jobId: string) => {
  try {
    const pipeline = await prisma.pipelineStage.findMany({
      where: {
        jobId,
      },
      orderBy: {
        order: 'asc',
      },
    });
    return pipeline;
  } catch (error) {
    throw error;
  }
};

// Get all jobs (public endpoint for job seekers)
export const GetAllJobs = async (options?: {
  page?: number;
  limit?: number;
  status?: 'OPEN' | 'CLOSE';
  jobType?: string;
  experienceLevel?: string;
  location?: string;
  isRemote?: boolean;
  search?: string;
}) => {
  try {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      status: options?.status || 'OPEN', // Default to only open jobs
      isClosed: false,
    };

    // Add filters
    if (options?.jobType) {
      where.jobType = options.jobType;
    }

    if (options?.experienceLevel) {
      where.experienceLevel = options.experienceLevel;
    }

    if (options?.location) {
      where.location = {
        contains: options.location,
        mode: 'insensitive',
      };
    }

    if (options?.isRemote !== undefined) {
      where.isRemote = options.isRemote;
    }

    if (options?.search) {
      where.OR = [
        {
          title: {
            contains: options.search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: options.search,
            mode: 'insensitive',
          },
        },
        {
          company: {
            name: {
              contains: options.search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
          _count: {
            select: {
              applications: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.job.count({ where }),
    ]);

    return {
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw error;
  }
};
