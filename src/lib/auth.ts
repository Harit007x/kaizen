import { compare } from 'bcrypt';
import { AuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

import OnboardingTemplate from '@/components/emailTemplates/OnboardingTemplate';
import prisma from '@/db';

import { sendMail } from './resend';

interface CustomToken extends JWT {
  uid: string;
  jwtToken: string;
  firstName: string;
  profilePicture: string;
  email?: string;
}

interface IUser {
  id: string;
  firstName: string;
  email: string;
  token: string;
  profilePicture: string;
  password: string;
}

export const authOptions: AuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      async profile(profile) {
        const { email, name, picture, sub } = profile;
        const user = await prisma.user.findFirst({
          where: {
            accounts: {
              some: { providerAccountId: sub },
            },
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
              },
            },
          },
        });

        await prisma.workspace.create({
          data: {
            title: 'My Projects',
            userWorkspaces: {
              create: {
                userId: newUser.id,
              },
            },
          },
        });

        const inboxWorkspace = await prisma.workspace.create({
          data: {
            title: 'Inbox',
            userWorkspaces: {
              create: {
                userId: newUser.id,
              },
            },
          },
        });

        await prisma.project.create({
          data: {
            name: 'Inbox',
            workspaceId: inboxWorkspace.id,
            userId: newUser.id,
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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null; // Add null check
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            accounts: true,
          },
        });

        if (user) {
          if (user.password) {
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
    jwt: async ({ token, user }): Promise<CustomToken> => {
      if (user) {
        const typedUser = user as IUser;
        return {
          ...token,
          uid: typedUser.id,
          jwtToken: typedUser.token,
          profilePicture: typedUser.profilePicture,
          email: typedUser.email,
          firstName: typedUser.firstName,
        };
      }
      return token as CustomToken;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.uid as string;
        session.user.firstName = token.firstName as string;
        session.user.profilePicture = token.profilePicture as string;
      }
      return session;
    },
    redirect: async ({ url, baseUrl }) => {
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/inbox`;
      }

      if (url.startsWith('/login') || url.startsWith('/signup')) {
        return `${baseUrl}/inbox`;
      }

      if (url.startsWith(baseUrl)) return url;

      return `${baseUrl}/inbox`;
    },
  },
  pages: {
    signIn: '/login',
  },
};
