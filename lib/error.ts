export const ERROR_CODES = {
  AUTH_UNAUTHORIZED: "AUTH_UNAUTHORIZED",
  VALIDATION_EMAIL_INVALID: "VALIDATION_EMAIL_INVALID",
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
