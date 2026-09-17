"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/login/actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    login,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="mt-8 space-y-6"
    >
      {state.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium"
        >
          邮箱
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium"
        >
          密码
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
      >
        {pending ? "登录中..." : "登录"}
      </button>
    </form>
  );
}