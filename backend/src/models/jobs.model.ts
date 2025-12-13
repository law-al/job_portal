import { z } from 'zod';

// Enums matching your Prisma schema
const UserRole = z.enum(['JOB_SEEKER', 'COMPANY', 'OTHER']);

const InvitationStatus = z.enum(['PENDING', 'ACCEPTED', 'EXPIRED', 'CANCELLED']);

const CompanyRole = z.enum(['COMPANY_ADMIN', 'HR', 'RECRUITER', 'INTERVIEWER', 'OTHER']);

const JobType = z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'TEMPORARY', 'SEASONAL', 'REMOTE', 'HYBRID', 'IN_OFFICE', 'FREELANCE', 'VOLUNTEER', 'CONSULTANT']);

const JobStatus = z.enum(['OPEN', 'CLOSE']);

const ExperienceLevel = z.enum(['INTERN', 'ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD']);

const pipelineStageSchema = z.object({
  id: z.uuid().optional(), // Optional for creation
  name: z.string().min(1).max(100),
  order: z.number().int().min(0),
});

// Main job schema
const jobSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  slug: z.string().max(255),
  createdBy: z.string().uuid(),
  title: z.string().max(255),
  description: z.string(),
  location: z.string().max(255),
  salary_range: z.string().max(255).nullable().optional(),
  jobType: JobType.default('FULL_TIME'),
  status: JobStatus.default('OPEN'),
  experienceLevel: ExperienceLevel.default('MID'),
  deadline: z.coerce.date().nullable().optional(),
  isRemote: z.boolean().default(false),
  slot: z.number().optional(),
  pipelineName: z.string().max(255).nullable().optional(),
  pipelineStages: z.array(pipelineStageSchema).default([]),
});

const createJobSchema = jobSchema.omit({ id: true, slug: true, status: true }).extend({
  pipelineName: z.string().max(255).optional(),
});

const updateJobSchema = jobSchema.partial().required({ id: true });

export { jobSchema, createJobSchema, updateJobSchema, UserRole, InvitationStatus, CompanyRole, JobType, JobStatus, ExperienceLevel };
