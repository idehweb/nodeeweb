import { NextFunction, Request, Response } from "express";

export enum ENV {
  PRO = "production",
  DEV = "development",
  LOC = "local",
}

export enum USE_ENV {
  NPM = "npm-install",
  GIT = "git-clone",
}

export type Req = Request & {
  props: any;
};

export type MiddleWare = (req: Req, res: Response, next: NextFunction) => any;
export type MiddleWareError = (
  e: any,
  req: Req,
  res: Response,
  next: NextFunction
) => string;
