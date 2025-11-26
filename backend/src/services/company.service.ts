import { hashSync } from 'bcrypt';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '../exceptions/exceptions.js';
import type { CompanyRole } from '../generated/prisma/enums.js';
import {
  AcceptInviteSchema,
  RegisterCompanySchema,
  UpdateCompanySchema,
} from '../models/company.model.js';
import { createHash } from '../utils/createHash.js';
import logger from '../utils/logger.js';
import { prisma } from '../utils/prismaClient.js';
import crypto from 'crypto';

// NOTE: CREATE COMPANY
export const CreateCompany = async (body: RegisterCompanySchema) => {
  try {
    const validatedBody = RegisterCompanySchema.parse(body);

    const company = await prisma.company.create({
      data: {
        createdBy: validatedBody.userId,
        name: validatedBody.name,
        description: validatedBody.description,
        address: validatedBody.address,
        logo: validatedBody.logo,
        website: validatedBody.website,
      },
    });

    await prisma.userCompany.create({
      data: {
        companyId: company.id,
        userId: validatedBody.userId,
        role: 'COMPANY_ADMIN',
      },
    });

    logger.info('company successfully registered');
  } catch (error) {
    throw error;
  }
};

// NOTE: GET COMPANY
export const FindCompanyById = async (id: string) => {
  try {
    return await prisma.company.findUniqueOrThrow({
      where: {
        id,
      },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    throw new NotFoundException(`company with ${id} not found`);
  }
};

export const UpdateCompany = async (id: string, body: any) => {
  try {
    const validatedBody = UpdateCompanySchema.parse(body);
    return await prisma.company.update({
      where: {
        id,
      },
      data: { ...validatedBody },
    });
  } catch (error) {
    throw error;
  }
};

// NOTE: REMOVE USER FROM COMPANY
export const RemoveUserFromCompany = async (
  companyId: string,
  userId: string,
) => {
  try {
    await prisma.userCompany.delete({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

// NOTE: FIND COMPANY MEMBERS
export const FindCompanyMembers = async (id: string) => {
  try {
    const company = await prisma.company.findFirst({
      where: {
        id,
      },
    });

    if (!company)
      throw new NotFoundException(`company with id ${id} not found`);

    const members = await prisma.user.findMany({
      where: {
        company: {
          some: {
            companyId: company.id,
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    const invitations = await prisma.invitation.findMany({
      where: {
        companyId: company.id,
      },
      select: {
        email: true,
        status: true,
        createdAt: true,
      },
    });

    // Saple result
    /*
      {
        a@gmail.com => 'ACTICE'
        b@gmail.com => 'ACTICE'
        c@gmail.com => 'PENDING'
        d@gmail.com => 'ACTICE'
      }
    */
    const invitationMap = new Map(
      invitations.map((inv) => [
        inv.email,
        { status: inv.status, invitedAt: inv.createdAt },
      ]),
    );

    const membersAndStatus = members.map((member) => ({
      ...member,
      status: invitationMap.get(member.email)?.status || 'ACTIVE',
      invitedAt: invitationMap.get(member.email)?.invitedAt || null,
    }));

    const memberEmails = new Set(members.map((m) => m.email));
    const pendingInvites = invitations
      .filter((inv) => !memberEmails.has(inv.email))
      .map((inv) => ({
        id: null,
        firstName: null,
        lastName: null,
        email: inv.email,
        status: inv.status,
        invitedAt: inv.createdAt,
      }));

    const allMembersAndInvites = [...membersAndStatus, ...pendingInvites].sort(
      (a, b) => {
        if (!a.invitedAt) return 1;
        if (!b.invitedAt) return -1;
        return b.invitedAt.getTime() - a.invitedAt.getTime();
      },
    );

    return allMembersAndInvites;
  } catch (error) {
    throw error;
  }
};

// NOTE: FIND COMPANY MEMBER
export const FindCompanyMember = async (
  companyId: string,
  memberId: string,
) => {
  try {
    return await prisma.userCompany.findUnique({
      where: {
        userId_companyId: {
          companyId,
          userId: memberId,
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

// NOTE: CHANGE ROLE
export const ChangeMemberRole = async (
  companyId: string,
  userId: string,
  role: CompanyRole,
) => {
  console.log('Looking for:', { companyId, userId });
  try {
    await prisma.userCompany.update({
      where: {
        userId_companyId: {
          companyId,
          userId,
        },
      },
      data: {
        role,
      },
    });
  } catch (error) {
    throw error;
  }
};

// NOTE: INVITE USER
export const InviteUser = async (
  email: string,
  role: CompanyRole,
  companyId: string,
  invitedBy: string,
) => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

    // Check if company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true, name: true },
    });

    if (!company) {
      throw new NotFoundException(`Company with id ${companyId} not found`);
    }

    // Check if there's already a pending invitation for this email and company
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email,
        companyId,
        status: 'PENDING',
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (existingInvitation) {
      throw new ConflictException(
        'A pending invitation already exists for this email and company',
      );
    }

    // Check if user already exists and is already part of the company
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: {
        company: {
          where: { id: companyId },
        },
      },
    });

    if (existingUser && existingUser.company.length > 0) {
      throw new ConflictException('User is already a member of this company');
    }

    // Generate token
    const { token, hashedToken } = createHash();

    // Set expiration to 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        email,
        token,
        hashedToken,
        role,
        companyId,
        invitedBy,
        expiresAt,
      },
    });

    return {
      token,
      email: invitation.email,
      companyName: company.name,
      role: invitation.role,
    };
  } catch (error) {
    logger.error(`Error inviting user: ${error}`);
    throw error;
  }
};

// NOTE: ACCEPT INVITE
export const AcceptUser = async (body: any) => {
  try {
    const validatedBody = AcceptInviteSchema.parse(body);
    const hashedToken = crypto
      .createHash('sha256')
      .update(validatedBody.token)
      .digest('hex');

    const invitee = await prisma.invitation.findFirst({
      where: {
        hashedToken,
        status: 'PENDING',
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!invitee) {
      throw new BadRequestException('Invite link is invalid or has expired');
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: {
        email: invitee.email,
      },
    });

    // If user doesn't exist, create a new user
    if (!user) {
      user = await prisma.user.create({
        data: {
          firstName: validatedBody.firstName,
          lastName: validatedBody.lastName,
          email: invitee.email,
          password: hashSync(validatedBody.password, 12),
          isEmailVerified: true,
        },
      });

      logger.info(`New user created: ${user.email} via invitation`);
    } else {
      const existingMembership = await prisma.userCompany.findUnique({
        where: {
          userId_companyId: {
            userId: user.id,
            companyId: invitee.companyId,
          },
        },
      });

      if (existingMembership) {
        throw new ConflictException('User is already a member of this company');
      }
    }

    await prisma.userCompany.create({
      data: {
        userId: user.id,
        companyId: invitee.companyId,
        role: invitee.role,
      },
    });

    // Update invitation status
    await prisma.invitation.update({
      where: {
        id: invitee.id,
      },
      data: {
        acceptedAt: new Date(),
        status: 'ACCEPTED',
      },
    });

    logger.info(
      `User ${user.email} accepted invitation to company ${invitee.companyId}`,
    );

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      companyId: invitee.companyId,
      role: invitee.role,
    };
  } catch (error) {
    logger.error(`Error accepting invitation: ${error}`);
    throw error;
  }
};
