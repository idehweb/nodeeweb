import { NextFunction, Request, Response } from "express";
import mongoose, { Document, Model, ObjectId } from "mongoose";

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
  file_path?: string;
  user?: Document & any;
};

export type MiddleWare = (req: Req, res: Response, next: NextFunction) => any;
export type MiddleWareError = (
  e: any,
  req: Req,
  res: Response,
  next: NextFunction
) => any;

export type CRUDCreatorOpt = {
  filter?: mongoose.FilterQuery<any>;
  parseFilter?: (req: Req) => mongoose.FilterQuery<any>;
  update?: mongoose.UpdateQuery<any> | mongoose.UpdateWithAggregationPipeline;
  parseUpdate?: (
    req: Req
  ) => mongoose.UpdateQuery<any> | mongoose.UpdateWithAggregationPipeline;
  parseBody?: (req: Req) => any;
  paginate?: {
    limit?: number;
    skip?: number;
  };
  sort?: { [k: string]: mongoose.SortValues };
  project?: mongoose.ProjectionType<any>;
  execute?: boolean;
  reqParamField?: string;
  code?: number;
  forceDelete?: boolean;
};

export enum CRUD {
  GET_ALL = "getAll",
  GET_ONE = "getOne",
  CREATE = "create",
  UPDATE_ONE = "updateOne",
  DELETE_ONE = "deleteOne",
}
