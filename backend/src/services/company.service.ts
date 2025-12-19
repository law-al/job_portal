import { hashSync } from 'bcrypt';
import { NotFoundException, BadRequestException, ConflictException } from '../exceptions/exceptions.js';
import type { CompanyRole } from '../generated/prisma/enums.js';
import { AcceptInviteSchema, RegisterCompanySchema, UpdateCompanySchema } from '../models/company.model.js';
import { createHash } from '../utils/createHash.js';
import logger from '../utils/logger.js';
import { prisma } from '../utils/prismaClient.js';
import crypto from 'crypto';
import { ErrorCodes } from '../exceptions/index.js';
import type { User } from '../generated/prisma/browser.js';

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
        role: 'ADMIN',
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

// NOTE: FIND COMPANY BY USER ID
export const FindCompaniesByUserID = async (id: string) => {
  try {
    const companies = await prisma.userCompany.findMany({
      where: {
        userId: id,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return companies;
  } catch (error) {
    throw error;
  }
};

// NOTE: FIND COMPANY BY USER ID
// Returns the first company the user is a member of (any role)
export const FindCompanyByUserID = async (id: string) => {
  try {
    const companyMember = await prisma.userCompany.findFirst({
      where: {
        userId: id,
        status: 'ACTIVE', // Only get active memberships
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc', // Get the first/oldest company membership
      },
    });

    return companyMember;
  } catch (error) {
    throw error;
  }
};

// NOTE: REMOVE USER FROM COMPANY
export const RemoveUserFromCompany = async (companyId: string, userId: string) => {
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

// NOTE: FIND COMPANY MEMBERS V2
export const FindCompanyMembersV2 = async (id: string) => {
  try {
    const company = await prisma.company.findFirst({
      where: {
        id,
      },
    });

    if (!company) throw new NotFoundException(`company with id ${id} not found`);

    const members = await prisma.userCompany.findMany({
      where: {
        companyId: company.id,
        role: {
          not: 'ADMIN',
        },
      },
      select: {
        createdAt: true,
        id: true,
        role: true,
        status: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return members;
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

    if (!company) throw new NotFoundException(`company with id ${id} not found`);

    const members = await prisma.userCompany.findMany({
      where: {
        companyId: company.id,
        role: {
          not: 'ADMIN',
        },
      },
      select: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        role: true,
        createdAt: true,
      },
    });

    const invitations = await prisma.invitation.findMany({
      where: {
        companyId: company.id,
      },
      select: {
        email: true,
        status: true,
        role: true,
        createdAt: true,
      },
    });

    // Sample result
    /*
      {
        a@gmail.com => 'ACTICE'
        b@gmail.com => 'ACTICE'
        c@gmail.com => 'PENDING'
        d@gmail.com => 'ACTICE'
      }
    */
    const invitationMap = new Map(invitations.map((inv) => [inv.email, { status: inv.status, invitedAt: inv.createdAt }]));

    const membersAndStatus = members.map((member) => ({
      id: member.user.id,
      email: member.user.email,
      role: member.role,
      status: invitationMap.get(member.user.email)?.status || 'ACTIVE',
      createdAt: invitationMap.get(member.user.email)?.invitedAt || null,
    }));

    const memberEmails = new Set(members.map((m) => m.user.email));
    const pendingInvites = invitations
      .filter((inv) => !memberEmails.has(inv.email))
      .map((inv) => ({
        id: null,
        email: inv.email,
        role: inv.role,
        status: inv.status,
        createdAt: inv.createdAt,
      }));

    const allMembersAndInvites = [...membersAndStatus, ...pendingInvites].sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    return allMembersAndInvites;
  } catch (error) {
    throw error;
  }
};

// NOTE: FIND COMPANY MEMBER
export const FindCompanyMember = async (companyId: string, memberId: string) => {
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

// NOTE: FIND COMPANY MEMBER WITH USER DETAILS
export const FindCompanyMemberWithUser = async (companyId: string, memberId: string) => {
  try {
    return await prisma.userCompany.findUnique({
      where: {
        userId_companyId: {
          companyId,
          userId: memberId,
        },
      },
      select: {
        id: true,
        role: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
            isActive: true,
          },
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

// NOTE: CHANGE ROLE
export const ChangeMemberRole = async (companyId: string | undefined, memberId: string | undefined, role: any) => {
  if (!companyId) throw new BadRequestException('A company ID needs to be provided', ErrorCodes.MISSING_COMPANY_ID);
  if (!memberId) throw new BadRequestException('A member ID needs to be provided', ErrorCodes.MISSING_USER_ID);
  const validRoles = ['HR', 'INTERVIEWER', 'RECRUITER'];

  if (!validRoles.includes(role)) {
    throw new BadRequestException('Invalid role. Must be HR, INTERVIEWER, or RECRUITER', ErrorCodes.BAD_GATEWAY);
  }

  try {
    await prisma.userCompany.update({
      where: {
        userId_companyId: {
          companyId,
          userId: memberId,
        },
        role: {
          not: 'ADMIN',
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

// NOTE: SUSPEND MEMBER
export const SuspendMember = async (companyId: string, userId: string) => {
  try {
    const member = await prisma.userCompany.findUnique({
      where: {
        userId_companyId: {
          companyId,
          userId,
        },
      },
    });

    if (!member) throw new NotFoundException('member not found');

    if (member.role === 'ADMIN') {
      throw new BadRequestException('Cannot suspend an admin user', ErrorCodes.OPERATION_NOT_ALLOWED);
    }

    await prisma.userCompany.update({
      where: {
        userId_companyId: {
          companyId,
          userId,
        },
      },
      data: {
        status: 'SUSPENDED',
      },
    });
  } catch (error) {
    throw error;
  }
};

// NOTE: UNSUSPEND MEMBER
export const UnsuspendMember = async (companyId: string, userId: string) => {
  try {
    const member = await prisma.userCompany.findUnique({
      where: {
        userId_companyId: {
          companyId,
          userId,
        },
      },
    });

    if (!member) throw new NotFoundException('member not found');

    await prisma.userCompany.update({
      where: {
        userId_companyId: {
          companyId,
          userId,
        },
      },
      data: {
        status: 'ACTIVE',
      },
    });
  } catch (error) {
    throw error;
  }
};

// NOTE: INVITE USER
export const InviteUser = async (email: string, role: CompanyRole, companyId: string, invitedBy: string) => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format', ErrorCodes.INVALID_INPUT);
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
      throw new ConflictException('A pending invitation already exists for this email and company');
    }

    // Check if user already exists and is already part of ANY company
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: {
        company: {
          where: {
            status: 'ACTIVE', // Only check active memberships
          },
        },
      },
    });

    if (existingUser && existingUser.company.length > 0) {
      // Check if user is already part of this specific company
      const isPartOfThisCompany = existingUser.company.some((uc) => uc.companyId === companyId);

      if (isPartOfThisCompany) {
        throw new ConflictException('User is already a member of this company');
      }

      // User is part of a different company
      throw new ConflictException('User is already a member of another company. A user can only be associated with one company at a time.');
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

// NOTE: CHECK INVITE TOKEN

export const CheckInviteToken = async (token: string) => {
  try {
    const { hashedToken } = createHash(token);

    const invitation = await prisma.invitation.findFirst({
      where: {
        hashedToken,
        expiresAt: {
          gte: new Date(),
        },
        status: 'PENDING',
      },
      select: {
        id: true,
        email: true,
        role: true,
        companyId: true,
      },
    });

    if (!invitation) throw new BadRequestException('Invitation link expired', ErrorCodes.VERIFICATION_EXPIRED);

    return invitation;
  } catch (error) {
    throw error;
  }
};

export const AcceptInvitedUser = async ({ email, password }: { email: string; password?: string }, token: string) => {
  try {
    if (!email && !token) {
      throw new BadRequestException('Missing required identifier: either email or token must be provided.', ErrorCodes.BAD_REQUEST);
    }

    const invitation = await prisma.invitation.findFirst({
      where: {
        token,
      },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found or the token is invalid.', ErrorCodes.TOKEN_INVALID);
    }

    let user: User;

    const result = await prisma.$transaction(async (tx) => {
      if (password) {
        user = await tx.user.create({
          data: {
            email,
            role: 'USER',
            password: hashSync(password, 12),
            isVerified: true,
          },
        });
      } else {
        const result = await tx.user.findFirst({
          where: {
            email,
          },
        });
        if (!result) throw new NotFoundException('Password is required', ErrorCodes.NOT_FOUND);
        user = result;
      }

      // Check if user is already a member of any other company
      const existingCompanyMembership = await tx.userCompany.findFirst({
        where: {
          userId: user.id,
          status: 'ACTIVE', // Only check active memberships
          companyId: {
            not: invitation.companyId, // Exclude the company from the invitation
          },
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (existingCompanyMembership) {
        throw new ConflictException(`User is already a member of ${existingCompanyMembership.company.name}. A user can only be associated with one company at a time.`);
      }

      await tx.userCompany.upsert({
        where: {
          userId_companyId: {
            userId: user.id,
            companyId: invitation.companyId,
          },
        },
        update: {
          role: invitation.role,
          status: 'ACTIVE', // Ensure status is active when updating
        },
        create: {
          userId: user.id,
          companyId: invitation.companyId,
          role: invitation.role,
        },
      });

      await tx.invitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          hashedToken: null,
          expiresAt: null,
          acceptedAt: new Date(),
          status: 'ACCEPTED',
          token: null,
        },
        select: {
          id: true,
          email: true,
          role: true,
          companyId: true,
        },
      });

      return user;
    });
  } catch (error) {
    throw error;
  }
};
