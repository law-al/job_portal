import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/auth';

export async function proxy(request: Request) {
  const pathname = new URL(request.url).pathname;
  const session = await getServerSession(authOptions);

  // 1. Block logged-in users from login/register
  if (session && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. Block unauthenticated users from admin/dashboard
  if (
    !session &&
    (pathname.startsWith('/dashboard') || pathname.startsWith('/admin'))
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. USER cannot see admin
  if (
    session &&
    session.user.role === 'USER' &&
    pathname.startsWith('/admin')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 4. COMPANY cannot see user dashboard
  if (
    session &&
    session.user.role === 'COMPANY' &&
    pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  console.log('middleware ran');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/dashboard',
    '/dashboard/:path*',
    '/admin',
    '/admin/:path*',
  ],
};
