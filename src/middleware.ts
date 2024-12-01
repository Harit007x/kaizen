import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  async (req) => {
    const token = await getToken({ req });
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup');

    if (isAuthPage) {
      if (isAuth) {
        const callbackUrl = req.nextUrl.searchParams.get('callbackUrl');
        if (callbackUrl) {
          return NextResponse.redirect(new URL(callbackUrl, req.url));
        }
        return NextResponse.redirect(new URL('/', req.url));
      }
      return null;
    }

    if (req.nextUrl.pathname === '/') {
      if (isAuth) {
        const previousPage = req.cookies.get('previousPage')?.value;
        if (
          previousPage &&
          previousPage !== '/' &&
          !previousPage.startsWith('/login') &&
          !previousPage.startsWith('/signup')
        ) {
          const response = NextResponse.redirect(new URL(previousPage, req.url));
          response.cookies.delete('previousPage');
          return response;
        }

        return NextResponse.redirect(new URL('/inbox', req.url));
      }
      return NextResponse.next();
    }

    if (!isAuth) {
      let loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
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
  matcher: ['/', '/inbox', '/test', '/login', '/signup', '/project/:path*'],
};
