import { ErrorType } from "../../types/error";

export class GeneralError extends Error {
  isGeneral = true;
  type: string = ErrorType.General;
  constructor(
    public message: string,
    public code: number,
    type?: string,
    public additionType?: string
  ) {
    super(message);
    this.type = type ?? ErrorType.General;
    if (additionType) this.type = `${this.type}:${additionType}`;
  }
}

export class BadRequestError extends GeneralError {
  constructor(message: string, additionType?: string) {
    super(message, 400, ErrorType.BadRequest, additionType);
  }
}
export class ForbiddenError extends GeneralError {
  constructor(message: string, additionType?: string) {
    super(message, 403, ErrorType.Forbidden, additionType);
  }
}
export class UnauthorizedError extends GeneralError {
  constructor(message: string, additionType?: string) {
    super(message, 401, ErrorType.Unauthorized, additionType);
  }
}

export class DuplicateError extends BadRequestError {
  isDuplicate = true;
  constructor(message: string) {
    super(message, ErrorType.Duplication);
  }
}

export class ValidationError extends BadRequestError {
  isValidation = true;
  constructor(message: string, additionalType?: ErrorType) {
    super(message, additionalType);
  }
}

export class LimitError extends GeneralError {
  isLimit = true;
  constructor(message: string) {
    super(message, 429, ErrorType.Limitation);
  }
}
