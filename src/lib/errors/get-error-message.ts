import { AppError } from "./app-error";

export function getErrorMessage(error: unknown) {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "发生了未知错误";
}