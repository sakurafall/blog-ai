"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export type LoginState = {
  error?: string;
};

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin/posts",
    });

    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "邮箱或密码错误",
      };
    }

    throw error;
  }
}