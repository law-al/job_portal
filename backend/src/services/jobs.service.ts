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

export const FindCompanyJobs = async (companyId: string) => {
  try {
    const jobs = await prisma.job.findMany({
      where: {
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

    return jobs;
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
