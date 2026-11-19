import type { ErrorCode } from "./error-codes";

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
  ) {
    super(message);

    this.name = "AppError";
  }
}