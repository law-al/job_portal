import type { NextFunction, Request, Response } from 'express';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '../exceptions/exceptions.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import {
  ChangeMemberRole,
  CreateCompany,
  FindCompanyById,
  FindCompanyMember,
  FindCompanyMembers,
  RemoveUserFromCompany,
  UpdateCompany,
} from '../services/company.service.js';
import type { CompanyRole } from '../generated/prisma/enums.js';

// NOTE: REGISTER COMPANY
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.file) {
    throw new BadRequestException('No file uploaded');
  }

  if (!req.body.name) {
    throw new BadRequestException('Company name must be provided');
  }

  const userId = req.user.id;

  const sanitizedName = req.body.name
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .replace(/\s+/g, '_');

  const folder = `${sanitizedName}/logos`;

  const publicId = `${sanitizedName}_${new Date()
    .toISOString()
    .replace(/[:.]/g, '-')}`;

  const result = await uploadToCloudinary(req.file.buffer, folder, publicId);

  await CreateCompany({
    ...req.body,
    logo: result.secure_url,
    userId,
  });

  res.status(201).json({
    success: true,
    message: 'Company registered successfully',
    data: { logoUrl: result.secure_url },
  });
};

// NOTE: GET COMPANY
export const getCompany = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  if (!id) throw new BadRequestException('id must be provided');

  const company = await FindCompanyById(id);

  res.status(200).json({
    success: true,
    message: 'success',
    data: { company },
  });
};

// NOTE: UPDATE COMPANY
export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id: companyId } = req.params;

  if (!companyId)
    throw new BadRequestException('A company ID needs to be provided');

  const company = await FindCompanyById(companyId);

  if (company.createdBy !== req.user.id)
    throw new UnauthorizedException('Operation not allowed');

  const updatedCompany = await UpdateCompany(company.id, req.body);

  res.status(200).json({
    success: true,
    message: 'company data updated successfully',
    data: { company: updatedCompany },
  });
};

// NOTE: GET COMPANY MEMBERS
export const getCompanyMembers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  if (!id) throw new BadRequestException('An id must be provided');

  const members = await FindCompanyMembers(id);

  res.status(200).json({
    success: true,
    message: 'members sents successfully',
    data: { members },
  });
};

// NOTE: CHANGE COMPANY USER ROLE
export const changeUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id: companyId } = req.params;
  const { memberId } = req.params;
  console.log(req.body);
  const role = req.body.role as CompanyRole;

  const validRoles: CompanyRole[] = ['HR', 'INTERVIEWER', 'RECRUITER'];

  if (!validRoles.includes(role)) {
    throw new BadRequestException(
      'Invalid role. Must be HR, INTERVIEWER, or RECRUITER',
    );
  }

  if (!companyId)
    throw new BadRequestException('A company ID needs to be provided');

  if (!memberId)
    throw new BadRequestException('A member ID needs to be provided');

  const company = await FindCompanyById(companyId);
  const member = await FindCompanyMember(company.id, memberId);

  if (!member) throw new NotFoundException('member not found');

  if (member.role === role)
    throw new BadRequestException('role has to be different');

  console.log('Looking for:', {
    companyID: company.id,
    memberId: member.userId,
  });
  await ChangeMemberRole(company.id, member.userId, role);

  res.status(200).json({
    success: true,
    message: 'user role changed successfully successfully',
  });
};

// NOTE: CHANGE COMPANY LOGO
export const changeCompanyLogo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id: companyId } = req.params;
  if (!companyId) throw new BadRequestException('An Id must be provided');
  if (!req.file) throw new BadRequestException('file must be provided');

  const company = await FindCompanyById(companyId);

  const sanitizedName = company.name
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .replace(/\s+/g, '_');

  const folder = `${sanitizedName}/logos`;

  const publicId = `${sanitizedName}_${new Date()
    .toISOString()
    .replace(/[:.]/g, '-')}`;

  const result = await uploadToCloudinary(req.file.buffer, folder, publicId);

  await UpdateCompany(company.id, { ...company, logo: result.secure_url });

  res.status(200).json({
    success: true,
    message: 'user logo changed successfully',
  });
};

// NOTE: REMOVE MEMBER FROM COMPANY
export const removeMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id: companyId } = req.params;
  const { memberId } = req.params;

  if (!companyId)
    throw new BadRequestException('A company ID needs to be provided');

  if (!memberId)
    throw new BadRequestException('A member ID needs to be provided');

  const company = await FindCompanyById(companyId);

  await RemoveUserFromCompany(companyId, memberId);

  res.status(200).json({
    success: true,
    message: 'user removed from company successfully',
  });
};

// revoke invitation
