import { DuplicateError, ErrorType, GeneralError } from '../types/error';

export function errorDetector(err: any): GeneralError {
  if (err instanceof GeneralError) return err;

  const { code, name, message, stack } = err ?? {};
  if (name === 'MongoServerError' || name === 'MongooseError') {
    if (code === 11000) return new DuplicateError(message, stack);
    return new GeneralError(message, 500, ErrorType.DB, undefined, stack);
  }
  return new GeneralError(message, 500, ErrorType.Unknown, undefined, stack);
}
