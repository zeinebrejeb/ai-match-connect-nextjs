import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value; 
  const protectedPaths = ['/dashboard', '/candidate-profile', '/jobs', '/recruiter-ai-search', '/recruiter-profile'];
  const isProtectedRoute = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

  // if (isProtectedRoute) {
  //   if (!accessToken) {
  //     const loginUrl = new URL('/auth', request.url);
  //     loginUrl.searchParams.set('redirect', request.nextUrl.pathname); 
  //     return NextResponse.redirect(loginUrl);
  //   }

  // }

  // if (request.nextUrl.pathname.startsWith('/auth') && accessToken) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};