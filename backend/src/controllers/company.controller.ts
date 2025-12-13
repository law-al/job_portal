import type { NextFunction, Request, Response } from 'express';
import { BadRequestException, NotFoundException, UnauthorizedException } from '../exceptions/exceptions.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import {
  ChangeMemberRole,
  CreateCompany,
  FindCompanyById,
  FindCompanyByUserID,
  FindCompanyMember,
  FindCompanyMembers,
  FindCompanyMembersV2,
  RemoveUserFromCompany,
  UpdateCompany,
  SuspendMember,
  UnsuspendMember,
  FindCompanyMemberWithUser,
} from '../services/company.service.js';
import type { CompanyRole } from '../generated/prisma/enums.js';
import { ErrorCodes } from '../exceptions/index.js';

// NOTE: REGISTER COMPANY
export const register = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    throw new BadRequestException('No file uploaded', ErrorCodes.FILE_UPLOAD_FAILED);
  }

  if (!req.body.name) {
    throw new BadRequestException('Company name must be provided', ErrorCodes.MISSING_COMPANY_ID);
  }

  const userId = (req.user as any).id;

  const result = await uploadToCloudinary(req.file.buffer, req.body.name);

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
// export const getCompany = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const { id } = req.params;
//   if (!id)
//     throw new BadRequestException(
//       'id must be provided',
//       ErrorCodes.MISSING_COMPANY_ID,
//     );

//   const company = await FindCompanyById(id);

//   res.status(200).json({
//     success: true,
//     message: 'success',
//     data: { company },
//   });
// };

// NOTE: GET COMPANY
export const getCompany = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.user as any).id;

  const company = await FindCompanyByUserID(userId);

  res.status(200).json({
    success: true,
    message: 'success',
    data: { company },
  });
};

// NOTE: UPDATE COMPANY
export const update = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.user as any).id;
  const { id: companyId } = req.params;

  if (!companyId) throw new BadRequestException('A company ID needs to be provided', ErrorCodes.MISSING_COMPANY_ID);

  const company = await FindCompanyById(companyId);

  if (company.createdBy !== userId) throw new UnauthorizedException('Operation not allowed');

  const updatedCompany = await UpdateCompany(company.id, req.body);

  res.status(200).json({
    success: true,
    message: 'company data updated successfully',
    data: { company: updatedCompany },
  });
};

// NOTE: GET COMPANY MEMBERS
export const getCompanyMembers = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) throw new BadRequestException('An id must be provided', ErrorCodes.MISSING_REQUIRED_FIELD);

  const members = await FindCompanyMembersV2(id);

  res.status(200).json({
    success: true,
    message: 'members sents successfully',
    data: members,
  });
};

// NOTE: GET COMPANY MEMBER (WITH USER DETAILS)
export const getCompanyMember = async (req: Request, res: Response, next: NextFunction) => {
  const { id: companyId, memberId } = req.params;

  if (!companyId) throw new BadRequestException('A company ID must be provided', ErrorCodes.MISSING_COMPANY_ID);
  if (!memberId) throw new BadRequestException('A member ID must be provided', ErrorCodes.MISSING_USER_ID);

  const member = await FindCompanyMemberWithUser(companyId, memberId);

  if (!member) throw new NotFoundException('member not found');

  res.status(200).json({
    success: true,
    message: 'member fetched successfully',
    data: member,
  });
};

// NOTE: CHANGE COMPANY USER ROLE
export const changeUserRole = async (req: Request, res: Response, next: NextFunction) => {
  const { id: companyId, memberId } = req.params;
  const role = req.body.role as CompanyRole;

  await ChangeMemberRole(companyId, memberId, role);

  res.status(200).json({
    success: true,
    message: 'user role changed successfully successfully',
  });
};

// NOTE: CHANGE COMPANY LOGO
export const changeCompanyLogo = async (req: Request, res: Response, next: NextFunction) => {
  const { id: companyId } = req.params;
  if (!companyId) throw new BadRequestException('An Id must be provided', ErrorCodes.MISSING_COMPANY_ID);
  if (!req.file) throw new BadRequestException('file must be provided', ErrorCodes.INVALID_FILE_TYPE);

  const company = await FindCompanyById(companyId);

  const result = await uploadToCloudinary(req.file.buffer, company.name);

  await UpdateCompany(company.id, { ...company, logo: result.secure_url });

  res.status(200).json({
    success: true,
    message: 'user logo changed successfully',
  });
};

// NOTE: REMOVE MEMBER FROM COMPANY
export const removeMember = async (req: Request, res: Response, next: NextFunction) => {
  const { id: companyId } = req.params;
  const { memberId } = req.params;

  if (!companyId) throw new BadRequestException('A company ID needs to be provided', ErrorCodes.MISSING_COMPANY_ID);

  if (!memberId) throw new BadRequestException('A member ID needs to be provided', ErrorCodes.MISSING_USER_ID);

  const company = await FindCompanyById(companyId);

  await RemoveUserFromCompany(companyId, memberId);

  res.status(200).json({
    success: true,
    message: 'user removed from company successfully',
  });
};

// NOTE: SUSPEND MEMBER
export const suspendMember = async (req: Request, res: Response, next: NextFunction) => {
  const { id: companyId, memberId } = req.params;

  if (!companyId) throw new BadRequestException('A company ID needs to be provided', ErrorCodes.MISSING_COMPANY_ID);
  if (!memberId) throw new BadRequestException('A member ID needs to be provided', ErrorCodes.MISSING_USER_ID);
  console.log('entered');
  await SuspendMember(companyId, memberId);

  res.status(200).json({
    success: true,
    message: 'member suspended successfully',
  });
};

// NOTE: UNSUSPEND MEMBER
export const unsuspendMember = async (req: Request, res: Response, next: NextFunction) => {
  const { id: companyId, memberId } = req.params;

  if (!companyId) throw new BadRequestException('A company ID needs to be provided', ErrorCodes.MISSING_COMPANY_ID);
  if (!memberId) throw new BadRequestException('A member ID needs to be provided', ErrorCodes.MISSING_USER_ID);

  await UnsuspendMember(companyId, memberId);

  res.status(200).json({
    success: true,
    message: 'member unsuspended successfully',
  });
};

// revoke invitation
