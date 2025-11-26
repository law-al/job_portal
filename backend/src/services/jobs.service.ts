import {
  createJobSchema,
  jobSchema,
  updateJobSchema,
} from '../models/jobs.model.js';
import { createJobSlug } from '../utils/createSlugs.js';
import { prisma } from '../utils/prismaClient.js';

export const CreateJob = async (body: any) => {
  try {
    const validatedBody = createJobSchema.parse(body);
    await prisma.job.create({
      data: {
        ...validatedBody,
        slug: createJobSlug(validatedBody.title, validatedBody.experienceLevel),
        salary_range: validatedBody.salary_range ?? null,
        deadline: validatedBody.deadline ?? null,
        slot: validatedBody.slot ?? null,
        pipelineStages: {
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
