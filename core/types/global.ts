import { NextFunction, Request, Response } from 'express';
import mongoose, { Document, Model, ObjectId } from 'mongoose';
import { CRUD_DEFAULT_REQ_KEY } from '../src/constants/String';
import { UserDocument } from './user';

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
  user?: UserDocument;
  modelName?: string;
  data?: any;
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
  parseFilter?: (
    req: Req
  ) => mongoose.FilterQuery<any> | Promise<mongoose.FilterQuery<any>>;
  parseUpdate?: (
    req: Req
  ) =>
    | mongoose.UpdateQuery<any>
    | Promise<mongoose.UpdateQuery<any>>
    | mongoose.UpdateWithAggregationPipeline
    | Promise<mongoose.UpdateWithAggregationPipeline>;
  parseBody?: (req: Req) => any | Promise<any>;
  paramFields?: {
    id?: string;
    offset?: string;
    limit?: string;
    slug?: string;
  };
  queryFields?:
    | {
        [key: string]: string;
      }
    | ((key: string) => string | undefined)
    | boolean;
  sort?: { [k: string]: mongoose.SortValues };
  project?: mongoose.ProjectionType<any>;
  executeQuery?: boolean;
  sendResponse?: boolean | ((result: any, req: Req) => any | Promise<any>);
  saveToReq?: boolean | string;
  httpCode?: number;
  forceDelete?: boolean;
  autoSetCount?: boolean;
  populate?: mongoose.PopulateOptions | mongoose.PopulateOptions[];
  type?: CRUD;
};

export enum CRUD {
  GET_ALL = 'getAll',
  GET_ONE = 'getOne',
  GET_COUNT = 'getCount',
  CREATE = 'create',
  UPDATE_ONE = 'updateOne',
  DELETE_ONE = 'deleteOne',
}

export interface SupervisorEmitter {
  id: string;
  emit(event: string, ...body: any[]): Promise<boolean>;
}

export interface Seo {
  getSitemap: MiddleWare;
  getPage: MiddleWare;
  initial: () => Promise<void> | void;
  clear: () => void;
  log: (...args: any[]) => void;
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
}
