import type { NextAuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID ?? "",
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? "",
      authorization: {
        params: {
          scope: "read:user repo",
        },
      },
    }),
  ],
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.accessToken = token.accessToken as string | undefined;
      }

      return session;
    },
  },
};
