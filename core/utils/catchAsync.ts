import { NextFunction, Response } from 'express';
import { MiddleWare, MiddleWareError, Req } from '../types/global';
import { isAsyncFunction } from 'util/types';

export function catchFn<F extends Function>(
  fn: F,
  { self, onError }: { self?: any; onError?: any } = {}
) {
  return (async (...args: any[]) => {
    try {
      let result = fn.call(self ?? this, ...args);
      while (result instanceof Promise) {
        result = await result;
      }
      return result;
    } catch (err) {
      if (onError) {
        // logger.error('#CatchError', err);
        return onError(err, ...args);
      }
    }
  }) as any as F;
}
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
  const catchFn: MiddleWare = async (req, res, next) => {
    try {
      let result = fn.call(self ?? this, req, res, next);
      while (result instanceof Promise) {
        result = await result;
      }
      return result;
    } catch (err) {
      if (onError) {
        // logger.error('#CatchError', err);
        return onError(err, req, res, next);
      }
      return next(err);
    }
  };

  return catchFn as F;
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
