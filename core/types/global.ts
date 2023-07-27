import { NextFunction, Request, Response } from 'express';
import mongoose, { Document, Model, ObjectId } from 'mongoose';
import { CRUD_DEFAULT_REQ_KEY } from '../src/constants/String';

export enum ENV {
  PRO = 'production',
  DEV = 'development',
  LOC = 'local',
}

export enum USE_ENV {
  NPM = 'npm-install',
  GIT = 'git-clone',
}

export type Req = Request & {
  props: any;
  file_path?: string;
  old_file_path?: string;
  file: Express.Multer.File;
  user?: Document & any;
  modelName?: string;
  [CRUD_DEFAULT_REQ_KEY]: any;
};

export type Res = Response;
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
  paramFields?: {
    id?: string;
    offset?: string;
    limit?: string;
  };
  queryFields?: {
    offset?: string;
    limit?: string;
    sort?: string;
  };
  sort?: { [k: string]: mongoose.SortValues };
  project?: mongoose.ProjectionType<any>;
  executeQuery?: boolean;
  sendResponse?: boolean | ((result: any) => any | Promise<any>);
  saveToReq?: boolean | string;
  httpCode?: number;
  forceDelete?: boolean;
  autoSetCount?: boolean;
  populate?: mongoose.PopulateOptions | mongoose.PopulateOptions[];
};

export enum CRUD {
  GET_ALL = 'getAll',
  GET_ONE = 'getOne',
  GET_COUNT = 'getCount',
  CREATE = 'create',
  UPDATE_ONE = 'updateOne',
  DELETE_ONE = 'deleteOne',
}
