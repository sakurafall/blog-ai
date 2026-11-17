import { auth } from "@/auth";
import { isAdmin } from "@/lib/auth/permissions";
import { AppError } from "@/lib/errors/app-error";
import { ERROR_CODES } from "@/lib/errors/error-codes";

export async function requireAdmin() {
  const session = await auth();

  // 检查是否登录
  if (!session?.user) {
    throw new AppError(
      ERROR_CODES.UNAUTHORIZED,
      "请先登录",
    );
  }

  // 检查是否是管理员
  if (!isAdmin(session.user.role)) {
    throw new AppError(
      ERROR_CODES.FORBIDDEN,
      "你没有权限执行这个操作",
    );
  }

  return session;
}