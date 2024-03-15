import { PrismaAdapter } from "@auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import
{
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import bcrypt from 'bcrypt';

import { env } from "~/env";
import { db } from "~/server/db";
import CredentialsProvider from "next-auth/providers/credentials";

import { JWT } from "next-auth/jwt";


/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession
  {
    user: DefaultSession["user"] & {
      id: string;
      username: string;
      scope: string;
      // ...other properties
      // role: UserRole;
    };
  }

  interface User
  {
    username: string;
    scope: string;
    // ...other properties
    // role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, token })
    {
      if (token)
      {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.scope = token.scope as string;
        // session.user.role = user.role; <-- put other properties on the session here
      }
      return session;
    },

    jwt({ token, user }): JWT
    {
      console.log('jwt', token, user);
      // Before adding here you need to add to the session callback above
      // and you need to add to the user Type above.
      if (user)
      {
        token.id = user.id;
        token.scope = user.scope;
        token.username = user.username;
      }

      return token;
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers:
    [
      CredentialsProvider({
        name: 'Credentials',

        // The name to display on the sign in form (e.g. "Sign in with...")
        // `credentials` is used to generate a form on the sign in page.
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password" }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async authorize(credentials): Promise<any>
        {
          // Add logic here to look up the user from the credentials supplied
          // const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };

          const hashedPassword = bcrypt.hashSync(credentials!.password, 10);

          const account = await db.account.findFirst({
            where: {
              username: credentials?.username,
            }
          });

          console.log('password', account?.password);
          console.log('hashedPassword', hashedPassword);
          console.log('account', account);
          const compared = bcrypt.compareSync(credentials!.password, account!.password);
          if (account && compared)
          {
            // Any object returned will be saved in `user` property of the JWT
            console.log('success', account);
            return account;
          } else
            // If you return null then an error will be displayed advising the user to check their details.
            throw new Error('الإسم أو كلمة المرور خطأ');

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter


        },
      }),
      // DiscordProvider({
      //   clientId: env.DISCORD_CLIENT_ID,
      //   clientSecret: env.DISCORD_CLIENT_SECRET,
      // }),
      /**
       * ...add more providers here.
       *
       * Most other providers require a bit more work than the Discord provider. For example, the
       * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
       * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
       *
       * @see https://next-auth.js.org/providers/github
       */
    ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60

  }
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) =>
{
  return getServerSession(ctx.req, ctx.res, authOptions);
};
