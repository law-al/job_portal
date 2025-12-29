import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: string;
    firstName?: string;
    lastName?: string;
    isVerified?: boolean;
    companyId?: string;
    companyRole?: string;
    accessToken?: string;
    refreshTokenHash?: string;
    accessTokenExpiresAt?: number;
    error?: string;
  }

  interface Session {
    user: {
      role?: string;
      firstName?: string;
      lastName?: string;
      isVerified?: boolean;
      companyId?: string;
      companyRole?: string;
      accessToken?: string;
      refreshTokenHash?: string;
      accessTokenExpiresAt?: number;
      error?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    firstName?: string;
    lastName?: string;
    isVerified?: boolean;
    companyId?: string;
    companyRole?: string;
    accessToken?: string;
    refreshTokenHash?: string;
    accessTokenExpiresAt?: number;
    error?: string;
  }
}
