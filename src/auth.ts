import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const result = loginSchema.safeParse(credentials);

        if (!result.success) {
          return null;
        }

        const { email, password } = result.data;

        if (
          email !== process.env.ADMIN_EMAIL ||
          password !== process.env.ADMIN_PASSWORD
        ) {
          return null;
        }

        return {
          id: "admin",
          email,
          name: "Admin",
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },
});
