import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/prisma/db";
import { ROLES, type Role } from "@/lib/auth/roles";

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
      
        // 查用户表
        const user = await db.orm.public.User.where({
          email,
        }).first();
      
        if (!user) {
          return null;
        }
      
        const passwordMatched = await bcrypt.compare(
          password,
          user.passwordHash,
        );
      
        if (!passwordMatched) {
          return null;
        }

        const role: Role =
          user.role === ROLES.ADMIN
            ? ROLES.ADMIN
            : ROLES.USER;
      
        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          role,
        };
      }
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
  
      return token;
    },
  
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
  
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});
