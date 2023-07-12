import { MiddleWare, MiddleWareError } from "./global";

export enum ErrorType {
  Duplication = "DUPLICATE",
  Validation = "VALIDATION",
  Timeout = "TIMEOUT",
  DB = "DB",
  Unknown = "UNKNOWN",
  Not_Found = "NOT_FOUND",
  General = "GENERAL",
  Limitation = "LIMITATION",
  Guard = "GUARD",
  INVALID_CODE = "INVALID_CODE",
  TOKEN_INVALID = "TOKEN_INVALID",
  DEPRECATE_VERSION = "DEPRECATE_VERSION",
  BadRequest = "BAD_REQUEST",
  Forbidden = "FORBIDDEN",
  Unauthorized = "UNAUTHORIZED",
}

export type ErrorPackageFn = {
  general: MiddleWareError;
  notFound: MiddleWare;
};
