import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  async (req) => {
    console.log("middlware called - - - - -- ")
    const token = await getToken({ req });
    const isAuth = !!token && !!token.uid; // Ensures `uid` exists, verifying a logged-in state
    const isAuthPage = ['/sign-in', '/sign-up'].some((path) =>
      req.nextUrl.pathname.startsWith(path)
    );

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Redirect unauthenticated users trying to access protected pages
    if (!isAuth && !isAuthPage) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      async authorized({ req, token }) {
        // Only allow requests if the user is authenticated
        return !!token?.uid;
      },
    },
  }
);

export const config = {
  matcher: [
    '/',
    '/sessions',
    '/home',
    '/sign-in',
    '/sign-up',
    '/live-session/:path*'  // Handles dynamic routes under /live-session
  ],
};
