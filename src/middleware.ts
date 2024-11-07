import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  async (req) => {
    const token = await getToken({ req });
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/sign-in') || req.nextUrl.pathname.startsWith('/sign-up');

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/', req.url));
      }
      return null;
    } else if (req.nextUrl.pathname === '/') {
      // if (isAuth) {
      //   return NextResponse.redirect(new URL('/sessions', req.url));
      // }
    }

    if (!isAuth) {
      return NextResponse.redirect(new URL(`/sign-in`, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/',
    '/test',
    '/sign-in',
    '/sign-up',
    // '/live-session/:path*'  // This handles dynamic routes like /live-session/[id]
  ],
};
