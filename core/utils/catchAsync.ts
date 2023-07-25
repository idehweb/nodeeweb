import { NextFunction, Response } from 'express';
import { MiddleWare, MiddleWareError, Req } from '../types/global';
import { axiosError2String } from './helpers';

export const catchFn = <F extends Function>(
  fn: F,
  {
    self,
    onError,
  }: {
    self?: any;
    onError?: Function;
  } = {}
) => {
  const newFn = async (...args: any[]) => {
    try {
      let result = fn.call(self ?? this, ...args);
      while (result instanceof Promise) {
        result = await result;
      }
      return result;
    } catch (err) {
      if (onError) {
        const parsed = axiosError2String(err);
        let newError: Error;
        if (parsed.message) {
          newError = new Error(parsed.message);
          delete newError.stack;
        } else {
          newError = parsed.error;
        }
        return onError(newError, ...args);
      }
    }
  };

  return newFn as any as F;
};
export const catchMiddleware = <F extends MiddleWare>(
  fn: F,
  {
    self,
    onError,
  }: {
    self?: any;
    onError?: MiddleWareError;
  } = {}
) => {
  return catchFn(fn, { self, onError }) as F;
};

export function classCatchBuilder<CustomClass>(
  C: CustomClass,
  onError = (C as any).onError as (
    methodName: string,
    e: any,
    req: Req,
    res: Response,
    next: NextFunction
  ) => string
) {
  const methodNames = Object.getOwnPropertyNames(C).filter(
    (p) =>
      typeof C[p] === 'function' &&
      p !== 'constructor' &&
      p !== 'onError' &&
      !p.startsWith('_')
  );

  methodNames.forEach(
    (mn) =>
      (C[mn] = catchMiddleware(C[mn], {
        self: C,
        onError: onError
          ? (err, req, res, next) => onError(mn, err, req, res, next)
          : null,
      }))
  );
  return C;
}
