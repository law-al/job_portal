import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/auth';

export async function proxy(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const session = await getServerSession(authOptions);
  console.log(session?.user.companyId);

  // 1. Logged-in users shouldn't see login/register
  if (session && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 3. USER cannot see admin
  if (session && !session.user.companyId && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 4. COMPANY should always be on /admin — but DON'T redirect /admin → /admin
  if (session && session?.user.role === 'COMPANY' && (pathname === '/' || pathname.startsWith('/dashboard'))) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/dashboard/:path*', '/admin/:path*', '/'],
};
