import { signOut } from "@/auth";

export function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";

        await signOut({
          redirectTo: "/login",
        });
      }}
    >
      <button
        type="submit"
        className="text-sm text-gray-600 hover:text-gray-950"
      >
        退出登录
      </button>
    </form>
  );
}