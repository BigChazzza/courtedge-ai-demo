import type { NextAuthOptions } from 'next-auth';
import OktaProvider from 'next-auth/providers/okta';

export const authOptions: NextAuthOptions = {
  providers: [
    OktaProvider({
      clientId: process.env.NEXT_PUBLIC_OKTA_CLIENT_ID!,
      clientSecret: process.env.OKTA_CLIENT_SECRET || 'placeholder-for-pkce',
      issuer: process.env.NEXT_PUBLIC_OKTA_ISSUER!,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.idToken = token.idToken as string;
      session.user = {
        ...session.user,
        id: token.sub as string,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};
