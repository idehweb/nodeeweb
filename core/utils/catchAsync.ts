import { NextFunction, Response } from "express";
import { MiddleWare, MiddleWareError, Req } from "../types/global";
import { isAsyncFunction } from "util/types";
import { log } from "../src/handlers/log.handler";

export function catchFn<F extends () => Promise<any>>(
  fn: F,
  { self, onError }
) {
  return (async () => {
    try {
      return await fn.call(self ?? this);
    } catch (err) {
      if (onError) {
        log("#CatchError", err);
        return onError.call(self ?? this, err);
      }
    }
  }) as F;
}
export function catchMiddleware<F extends MiddleWare>(
  fn: F,
  {
    self,
    onError,
  }: {
    self?: any;
    onError?: MiddleWareError;
  } = {}
) {
  const catchFn: MiddleWare = async (req, res, next) => {
    try {
      if (isAsyncFunction(fn))
        return await fn.call(self ?? this, req, res, next);
      else return fn.call(self ?? this, req, res, next);
    } catch (err) {
      if (onError) {
        log("#CatchError", err);
        return onError(err, req, res, next);
      }
      return next(err);
    }
  };

  return catchFn as F;
}

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
      typeof C[p] === "function" &&
      p !== "constructor" &&
      p !== "onError" &&
      !p.startsWith("_")
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
