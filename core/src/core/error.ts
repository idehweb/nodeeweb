import store from "../../store";
import { ErrorType } from "../../types/error";
import { MiddleWare, MiddleWareError } from "../../types/global";

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

export const errorHandler: MiddleWareError = (error, req, res, next) => {
  console.log("#Error", error);
  return res
    .status(500)
    .json({ status: "error", message: error.message, error });
};

export const notFoundHandler: MiddleWare = (req, res, next) => {
  return res.status(404).json({ status: "error", message: "path not found" });
};

export function setErrorPackage() {
  store.errorPackage = { general: errorHandler, notFound: notFoundHandler };
}
