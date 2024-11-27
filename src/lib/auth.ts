import OnboardingTemplate from '@/components/emailTemplates/OnboardingTemplate';
import prisma from '@/db';
import { compare } from 'bcrypt';
import { AuthOptions, Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { sendMail } from './resend';

export interface session extends Session {
  user: {
    id: string;
    email: string;
    firstName: string;
    profilePicture: string;
  };
}

interface token extends JWT {
  uid: string;
  jwtToken: string;
}

interface IUser {
  id: string;
  firstName: string;
  email: string;
  token: string;
  profilePicture: string;
}

export const authOptions: AuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      async profile(profile) {
        const { email, name, picture } = profile;
        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            accounts: true,
          },
        });

        if (user) {
          return user;
        }

        const newUser = await prisma.user.create({
          data: {
            email,
            firstName: name,
            profilePicture: picture,
            isVerified: true,
            accounts: {
              create: {
                provider: 'GOOGLE',
                providerAccountId: profile.sub,
                refreshToken: profile.refresh_token,
                accessToken: profile.access_token,
              },
            },
          },
        });

        await sendMail(email, 'Welcome to Kaizen', OnboardingTemplate());

        return newUser;
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials: any) {
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            accounts: true,
          },
        });

        if (user) {
          const hasEmailAccount = user.accounts.some((account) => account.provider === 'EMAIL');
          if (hasEmailAccount && user.password) {
            const isMatch = await compare(password, user.password);
            if (isMatch) {
              return user;
            }
          }
        }

        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || '',
  callbacks: {
    jwt: async ({ token, user }): Promise<JWT> => {
      const newToken: token = token as token;
      if (user) {
        newToken.uid = user.id;
        newToken.jwtToken = (user as IUser).token;
        newToken.profilePicture = (user as IUser).profilePicture;
        newToken.email = (user as IUser).email;
        newToken.firstName = (user as IUser).firstName;
      }
      return newToken;
    },
    session: async ({ session, token }: any) => {
      const newSession: session = session as session;
      if (newSession.user && token.uid) {
        newSession.user.id = token.uid as string;
        newSession.user.email = session.user?.email ?? '';
        newSession.user.firstName = token.firstName;
        newSession.user.profilePicture = token.profilePicture;
      }
      return newSession!;
    },
    redirect: async ({ url, baseUrl }) => {
      if (url.includes('/login') || url.includes('/signup')) {
        return `${baseUrl}/`;
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login',
  },
};
