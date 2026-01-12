import { z } from 'zod';
import { ExperienceLevel, JobType } from './jobs.model.js';

// Experience entry schema
export const ExperienceEntrySchema = z.object({
  title: z.string().min(1, 'Job title is required').max(255),
  company: z.string().min(1, 'Company name is required').max(255),
  location: z.string().max(255).optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).nullable().optional(),
  description: z.string().max(2000).optional(),
  isCurrent: z.boolean().default(false),
});

// Education entry schema
export const EducationEntrySchema = z.object({
  degree: z.string().min(1, 'Degree is required').max(255),
  institution: z.string().min(1, 'Institution name is required').max(255),
  fieldOfStudy: z.string().max(255).optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).nullable().optional(),
  isCurrent: z.boolean().default(false),
});

// Certification entry schema
export const CertificationEntrySchema = z.object({
  name: z.string().min(1, 'Certification name is required').max(255),
  issuer: z.string().min(1, 'Issuer name is required').max(255),
  issueDate: z.string().or(z.date()),
  expiryDate: z.string().or(z.date()).nullable().optional(),
  credentialUrl: z.string().url().max(500).optional(),
});

// Profile schema for creating/updating
export const ProfileSchema = z.object({
  // Basic Information
  professionalHeadline: z.string().max(255).optional(),
  aboutMe: z.string().max(5000).optional(),
  phone: z.string().max(20).optional(),
  location: z.string().max(255).optional(),
  linkedin: z.url().max(255).optional().or(z.literal('')),
  github: z.url().max(255).optional().or(z.literal('')),
  portfolioUrl: z.string().url().max(255).optional().or(z.literal('')),
  resumeId: z.array(z.string()).default([]),

  // Professional Details
  skills: z.array(z.string().min(1).max(100)).default([]),
  expectedSalary: z.number().int().positive().optional(),
  expectedSalaryMax: z.number().int().positive().optional(),

  // Experience, Education, Certifications (as JSON arrays)
  experiences: z.array(ExperienceEntrySchema).optional(),
  education: z.array(EducationEntrySchema).optional(),
  certifications: z.array(CertificationEntrySchema).optional(),
});

// Partial profile schema for updates
export const UpdateProfileSchema = ProfileSchema.partial();

// Profile section update schemas (for grouped section updates)
export const ContactSchema = z.object({
  linkedin: z.string().url().max(255).optional().or(z.literal('')),
  github: z.string().url().max(255).optional().or(z.literal('')),
  location: z.string().max(255).optional(),
});

export const BasicInfoSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  professionalHeadline: z.string().max(255).optional(),
  aboutMe: z.string().max(5000).optional(),
});

export const SkillsSchema = z.object({
  skills: z.array(z.string().min(1).max(100)).default([]),
});

export const ExperiencesSchema = z.object({
  experiences: z.array(ExperienceEntrySchema).default([]),
});

export const EducationSchema = z.object({
  education: z.array(EducationEntrySchema).default([]),
});

export const CertificationsSchema = z.object({
  certifications: z.array(CertificationEntrySchema).default([]),
});

// Type exports
export type ProfileType = z.infer<typeof ProfileSchema>;
export type UpdateProfileType = z.infer<typeof UpdateProfileSchema>;
export type ExperienceEntryType = z.infer<typeof ExperienceEntrySchema>;
export type EducationEntryType = z.infer<typeof EducationEntrySchema>;
export type CertificationEntryType = z.infer<typeof CertificationEntrySchema>;
