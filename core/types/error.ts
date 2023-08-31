import { MiddleWare, MiddleWareError } from './global';

export enum ErrorType {
  Duplication = 'DUPLICATE',
  Validation = 'VALIDATION',
  Timeout = 'TIMEOUT',
  DB = 'DB',
  Unknown = 'UNKNOWN',
  Not_Found = 'NOT_FOUND',
  General = 'GENERAL',
  Limitation = 'LIMITATION',
  Guard = 'GUARD',
  INVALID_CODE = 'INVALID_CODE',
  TOKEN_INVALID = 'TOKEN_INVALID',
  DEPRECATE_VERSION = 'DEPRECATE_VERSION',
  BadRequest = 'BAD_REQUEST',
  Forbidden = 'FORBIDDEN',
  Unauthorized = 'UNAUTHORIZED',
  NotImplement = 'NotImplement',
  Unavailable = 'Unavailable',
  SMS = 'SMS',
}

export type ErrorPackageFn = {
  general?: MiddleWareError;
  notFound?: MiddleWare;
};

export class GeneralError extends Error {
  isGeneral = true;
  type: string = ErrorType.General;
  constructor(
    public message: string,
    public code: number,
    type?: string,
    public additionType?: string,
    stack?: string
  ) {
    super(message);
    this.type = type ?? ErrorType.General;
    if (additionType) this.type = `${this.type}:${additionType}`;
    if (stack) this.stack = stack;
  }
}

export class BadRequestError extends GeneralError {
  constructor(message: string, additionType?: string, stack?: string) {
    super(message, 400, ErrorType.BadRequest, additionType, stack);
  }
}
export class ForbiddenError extends GeneralError {
  constructor(message: string, additionType?: string, stack?: string) {
    super(message, 403, ErrorType.Forbidden, additionType, stack);
  }
}
export class UnauthorizedError extends GeneralError {
  constructor(message?: string, additionType?: string, stack?: string) {
    super(
      message ?? 'unauthorized',
      401,
      ErrorType.Unauthorized,
      additionType,
      stack
    );
  }
}

export class DuplicateError extends BadRequestError {
  isDuplicate = true;
  constructor(message: string, stack?: string) {
    super(message, ErrorType.Duplication, stack);
  }
}

export class ValidationError extends BadRequestError {
  isValidation = true;
  constructor(message: string, additionalType?: ErrorType, stack?: string) {
    super(message, additionalType, stack);
  }
}

export class LimitError extends GeneralError {
  isLimit = true;
  constructor(message: string, stack?: string) {
    super(message, 429, ErrorType.Limitation, undefined, stack);
  }
}

export class NotImplement extends GeneralError {
  isNotImplement = true;
  constructor(message?: string, stack?: string) {
    super(
      message ?? 'not implement yet',
      500,
      ErrorType.NotImplement,
      undefined,
      stack
    );
  }
}

export class NotFound extends GeneralError {
  isNotfound = true;
  constructor(message?: string, stack?: string) {
    super(message ?? 'no found', 404, ErrorType.Not_Found, undefined, stack);
  }
}

export class SendSMSError extends GeneralError {
  isSMS = true;
  constructor(message: string | boolean, stack?: string) {
    super(
      typeof message === 'string' ? message : 'send sms error',
      500,
      ErrorType.SMS,
      undefined,
      stack
    );
  }
}

export class SimpleError extends Error {
  isSimple = true;
  constructor(message?: string, stack?: string) {
    super(message);
    if (stack) this.stack = stack;
  }
}
