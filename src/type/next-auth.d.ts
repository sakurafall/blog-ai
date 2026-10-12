import "next-auth";
import "next-auth/jwt";
import type { Role } from "@/lib/auth/roles";

declare module "next-auth" {
  interface User {
    role?: Role;
  }

  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: Role;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
  }
}