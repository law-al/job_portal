/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions } from 'next-auth';

async function refreshAccessToken(token: any) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/auth/refresh/${token.refreshTokenHash}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'unauthorized');
    }

    const { data } = await response.json();

    return {
      ...token,
      accessToken: data.accessToken,
      accessTokenExpiresAt: Date.now() + 15 * 60 * 1000,
    };
  } catch (error: any) {
    return {
      ...token,
      error: error?.message || 'unauthorized',
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        try {
          const res = await fetch('http://localhost:3000/api/v1/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          const { data: user } = await res.json();
          if (res.ok && user) {
            return user;
          }
          return null;
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // OAuth provider (Google)
      if (account?.provider !== 'credentials') {
        try {
          const res = await fetch('http://localhost:3000/api/v1/auth/oauth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              role: 'USER',
              provider: account?.provider,
              providerId: account?.providerAccountId,
            }),
          });
          if (res.ok) {
            const { data } = await res.json();
            user.id = data.id || user.id;
            (user as any).role = data.role || 'USER';
            (user as any).isVerified = data.isVerified || false;
            return true;
          }
        } catch (error) {
          console.error('OAuth sign in error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = (user as any).id;
        token.isVerified = (user as any).isVerified;
        token.companyId = (user as any).companyId;
        token.accessToken = (user as any).accessToken;
        token.refreshTokenHash = (user as any).refreshTokenHash;
        token.accessTokenExpiresAt = Date.now() + 15 * 60 * 1000;
      }

      if (
        token.accessTokenExpiresAt &&
        Date.now() < token?.accessTokenExpiresAt
      ) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).isVerified = token.isVerified;
        (session.user as any).companyId = token.companyId;
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).refreshTokenHash = token.refreshTokenHash;
        (session.user as any).accessTokenExpiresAt = token.accessTokenExpiresAt;
        (session.user as any).error = token.error;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  debug: true,
};

export const handlers = NextAuth(authOptions);
