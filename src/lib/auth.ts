import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    // ─── Email / Password ───────────────────────────────────────────
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("[AUTH] Missing credentials");
          return null;
        }

        try {
          await connectToDatabase();
          const email = credentials.email.toLowerCase();
          const user = await User.findOne({ email });

          if (!user) {
            console.warn(`[AUTH] User not found: ${email}`);
            return null;
          }

          if (!user.password) {
            console.warn(`[AUTH] User has no password (perhaps OAuth only?): ${email}`);
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            console.warn(`[AUTH] Invalid password for: ${email}`);
            return null;
          }

          console.log(`[AUTH] Successful login: ${email}`);
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } catch (error: any) {
          console.error(`[AUTH] Error in authorize: ${error.message}`);
          return null;
        }
      },
    }),

    // ─── Google OAuth (activate by setting env vars) ────────────────
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // For OAuth providers, upsert the user into MongoDB
      if (account && account.provider !== 'credentials') {
        await connectToDatabase();
        await User.findOneAndUpdate(
          { email: user.email! },
          {
            $setOnInsert: {
              name: user.name,
              email: user.email,
              image: user.image,
              provider: account.provider,
            },
          },
          { upsert: true, new: true }
        );
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) token.id = dbUser._id.toString();
      }
      return token;
    },

    async session({ session, token }) {
      if (token.id) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },

  pages: {
    signIn: '/', // We handle sign-in via modal, redirect back to home
  },

  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};
