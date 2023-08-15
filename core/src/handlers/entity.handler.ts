import mongoose, { PopulateOptions } from 'mongoose';
import store from '../../store';
import { CRUD, CRUDCreatorOpt, MiddleWare, Req, Res } from '../../types/global';
import { NextFunction, Response } from 'express';
import { ControllerSchema } from '../../types/controller';
import {
  ControllerRegisterOptions,
  controllerRegister,
} from './controller.handler';
import { BASE_API_URL, CRUD_DEFAULT_REQ_KEY } from '../constants/String';
import { isAsyncFunction } from 'util/types';
import { BadRequestError, GeneralError, NotFound } from '../../types/error';
import { call } from '../../utils/helpers';
import { CrudParamDto } from '../../dto/in/crud.dto';
import { lowerFirst, orderBy } from 'lodash';

export class EntityCreator {
  constructor(private modelName: string) {}
  private get model() {
    return store.db.model(this.modelName);
  }

  private async handleResult(
    req: Req,
    res: Response,
    next: NextFunction,
    {
      result,
      saveToReq,
      sendResponse,
      httpCode = 200,
    }: {
      result: any;
      saveToReq: CRUDCreatorOpt['saveToReq'];
      sendResponse: CRUDCreatorOpt['sendResponse'];
      httpCode: number;
    }
  ) {
    if (!result) throw new NotFound(`${this.modelName} not found`);

    if (sendResponse && !saveToReq) {
      const data =
        typeof sendResponse === 'boolean'
          ? result
          : await call(sendResponse, result, req);
      return res.status(httpCode).json({ data });
    }

    // save to req
    req[
      !saveToReq || typeof saveToReq === 'boolean'
        ? CRUD_DEFAULT_REQ_KEY
        : saveToReq
    ] = result;
    return next();
  }

  private static onError(err: GeneralError, next: NextFunction) {
    return next(err);
  }

  private getFrom(
    req: Req,
    objs: { reqKey: string; objKey: any }[],
    key: string,
    def: any
  ) {
    for (const { reqKey, objKey, ...others } of objs) {
      if (objKey?.[key]) return req[reqKey][objKey[key]];
    }
    return def;
  }
  private async baseCreator(
    query: mongoose.Query<any, any>,
    req: Req,
    res: Response,
    next: NextFunction,
    {
      executeQuery,
      project,
      sort,
      saveToReq,
      sendResponse,
      paramFields,
      httpCode = 200,
      autoSetCount,
      queryFields,
      populate,
    }: Partial<CRUDCreatorOpt>
  ) {
    let result: any = query;
    let mySort: any =
      sort ?? queryFields?.sort ? req.query[queryFields?.sort] : undefined;
    if (mySort) query.sort(mySort);
    if (project) query.projection(project);

    const offset = +this.getFrom(
      req,
      [
        { reqKey: 'query', objKey: queryFields },
        { reqKey: 'params', objKey: paramFields },
      ],
      'offset',
      0
    );

    const limit = +this.getFrom(
      req,
      [
        { reqKey: 'query', objKey: queryFields },
        { reqKey: 'params', objKey: paramFields },
      ],
      'limit',
      req.method === 'GET' ? 12 : 0
    );
    if (offset) query.skip(offset);
    if (limit) query.limit(limit);

    // populate
    if (populate) {
      if (!Array.isArray(populate)) populate = [populate];
      populate.forEach((p) => query.populate(p));
    }

    if (executeQuery) result = await query.exec();
    if (autoSetCount)
      res.setHeader('X-Total-Count', await query.clone().countDocuments());

    // handle result and output
    await this.handleResult(req, res, next, {
      result,
      saveToReq,
      sendResponse,
      httpCode,
    });
  }
  createOneCreator({
    parseBody,
    executeQuery = true,
    saveToReq = false,
    sendResponse = true,
    project,
  }: CRUDCreatorOpt) {
    return async (req: Req, res: Response, next: NextFunction) => {
      const body = parseBody ? await call(parseBody, req) : req.body;
      if (!body)
        return EntityCreator.onError(
          new BadRequestError('body must exist'),
          next
        );

      let doc = this.model.create(body);
      if (executeQuery) {
        doc = (await doc)._doc;
        if (project) {
          Object.entries(project)
            .filter(([k, v]) => !v)
            .map(([k]) => delete doc[k]);
        }
      }

      // handle result and output
      this.handleResult(req, res, next, {
        result: doc,
        saveToReq,
        sendResponse,
        httpCode: 201,
      });
    };
  }
  getAllCreator({ parseFilter, ...opt }: CRUDCreatorOpt): MiddleWare {
    return async (req, res, next) => {
      const f = parseFilter ? await call(parseFilter, req) : {};
      if (!opt.sort) opt.sort = { createdAt: -1 };
      const query = this.model.find(f);
      return await this.baseCreator(query, req, res, next, opt);
    };
  }
  getOneCreator({
    parseFilter,
    paramFields = { id: 'id' },
    ...opt
  }: CRUDCreatorOpt): MiddleWare {
    return async (req, res, next) => {
      const f = parseFilter
        ? await call(parseFilter, req)
        : {
            _id: new mongoose.Types.ObjectId(req.params[paramFields.id]),
          };
      const query = this.model.findOne(f);
      return await this.baseCreator(query, req, res, next, opt);
    };
  }
  getCountCreator({ parseFilter, ...opt }: CRUDCreatorOpt): MiddleWare {
    return async (req, res, next) => {
      const f = parseFilter ? await call(parseFilter, req) : {};
      const query = this.model.countDocuments(f);
      return await this.baseCreator(query, req, res, next, opt);
    };
  }
  updateOneCreator({
    parseFilter,
    parseUpdate,
    paramFields = { id: 'id' },
    ...opt
  }: CRUDCreatorOpt): MiddleWare {
    return async (req, res, next) => {
      const f = parseFilter
        ? await call(parseFilter, req)
        : {
            _id: new mongoose.Types.ObjectId(req.params[paramFields.id]),
          };
      const u = parseUpdate ? await call(parseUpdate, req) : req.body;
      const query = this.model.findOneAndUpdate(f, u, { new: true });
      return await this.baseCreator(query, req, res, next, opt);
    };
  }
  deleteOneCreator({
    parseFilter,
    forceDelete,
    parseUpdate,
    paramFields = { id: 'id' },
    ...opt
  }: CRUDCreatorOpt): MiddleWare {
    return async (req, res, next) => {
      const f = parseFilter
        ? await call(parseFilter, req)
        : {
            _id: new mongoose.Types.ObjectId(req.params[paramFields.id]),
          };
      const u = parseUpdate ? await call(parseUpdate, req) : { active: false };
      const query = forceDelete
        ? this.model.findOneAndDelete(f)
        : this.model.findOneAndUpdate(f, u);
      return await this.baseCreator(query, req, res, next, {
        ...opt,
        httpCode: 204,
      });
    };
  }
}

export type EntityCRUDOpt = {
  crud?: Omit<CRUDCreatorOpt, 'httpCode'>;
  controller?: Partial<ControllerSchema> & {
    beforeService?: MiddleWare | MiddleWare[];
  };
};
type EntityOpts = {
  [CRUD.CREATE]?: EntityCRUDOpt;
  [CRUD.GET_ALL]?: EntityCRUDOpt;
  [CRUD.GET_ONE]?: EntityCRUDOpt;
  [CRUD.UPDATE_ONE]?: EntityCRUDOpt;
  [CRUD.DELETE_ONE]?: EntityCRUDOpt;
  [CRUD.GET_COUNT]?: EntityCRUDOpt;
};
export function registerEntityCRUD(
  modelName: string,
  opts: EntityOpts,
  registerOpt: ControllerRegisterOptions & { order?: boolean }
) {
  const schemas: ControllerSchema[] = [];
  const creator = new EntityCreator(modelName);
  const ordered =
    registerOpt.order || registerOpt.order == undefined ? order(opts) : opts;
  const base_url =
    registerOpt.base_url === undefined
      ? `${store.env.BASE_API_URL}/${lowerFirst(modelName)}`
      : registerOpt.base_url;

  for (const [name, opt] of Object.entries(ordered).filter(([k, v]) => v)) {
    const cName = name as CRUD;
    opt.controller = opt.controller ?? {};
    opt.crud = opt.crud ?? {};
    schemas.push({
      method: opt.controller.method ?? translateCRUD2Method(cName),
      url: opt.controller.url ?? translateCRUD2Url(cName, opt.crud),
      access: opt.controller.access,
      service: [
        ...[opt.controller.beforeService ?? []].flat(),
        creator[translateCRUD2Creator(cName)](opt.crud),
        ...[opt.controller.service ?? []].flat(),
      ],
      validate: canUseDefaultParamValidation(cName, opt)
        ? { reqPath: 'params', dto: CrudParamDto }
        : opt.controller.validate,
    });
  }

  schemas.forEach((s) => controllerRegister(s, { ...registerOpt, base_url }));
}

function translateCRUD2Creator(name: CRUD): keyof EntityCreator {
  switch (name) {
    case CRUD.CREATE:
      return 'createOneCreator';
    case CRUD.GET_ALL:
      return 'getAllCreator';
    case CRUD.GET_ONE:
      return 'getOneCreator';
    case CRUD.UPDATE_ONE:
      return 'updateOneCreator';
    case CRUD.DELETE_ONE:
      return 'deleteOneCreator';
    case CRUD.GET_COUNT:
      return 'getCountCreator';
    default:
      throw new Error(`Invalid CRUD name : ${name}`);
  }
}
function translateCRUD2Method(name: CRUD): ControllerSchema['method'] {
  switch (name) {
    case CRUD.CREATE:
      return 'post';
    case CRUD.GET_ALL:
    case CRUD.GET_ONE:
    case CRUD.GET_COUNT:
      return 'get';
    case CRUD.UPDATE_ONE:
      return 'put';
    case CRUD.DELETE_ONE:
      return 'delete';
    default:
      throw new Error(`Invalid CRUD name : ${name}`);
  }
}
function translateCRUD2Url(
  name: CRUD,
  opt: CRUDCreatorOpt
): ControllerSchema['url'] {
  switch (name) {
    case CRUD.GET_COUNT:
      return '/count';
    case CRUD.CREATE:
      return '/';
    case CRUD.GET_ALL:
      let extra = '';
      if (opt.paramFields?.offset)
        extra += `/:${opt.paramFields.offset}([0-9]+)?`;
      if (opt.paramFields?.limit)
        extra += `/:${opt.paramFields.limit}([0-9]+)?`;
      return `/${extra}`;
    case CRUD.GET_ONE:
    case CRUD.UPDATE_ONE:
    case CRUD.DELETE_ONE:
      return `/:${opt.paramFields?.id ?? 'id'}`;
    default:
      throw new Error(`Invalid CRUD name : ${name}`);
  }
}

function canUseDefaultParamValidation(name: CRUD, opt: EntityCRUDOpt) {
  return (
    opt.controller.validate === undefined &&
    [CRUD.UPDATE_ONE, CRUD.DELETE_ONE, CRUD.GET_ONE].includes(name) &&
    (!opt.crud.paramFields || opt.crud.paramFields.id === 'id')
  );
}

function order(opts: EntityOpts): EntityOpts {
  return Object.fromEntries(
    Object.entries(opts)
      .map(([k, v]) => {
        let score: number;
        switch (k) {
          case CRUD.CREATE:
            score = 0;
            break;
          case CRUD.GET_COUNT:
            score = 1;
            break;
          case CRUD.GET_ONE:
            score = 2;
            break;
          case CRUD.GET_ALL:
            score = 3;
            break;
          case CRUD.UPDATE_ONE:
            score = 4;
            break;
          case CRUD.DELETE_ONE:
            score = 5;
            break;
        }
        v['score'] = score;
        return [k, v] as [string, EntityCRUDOpt];
      })
      .sort(([, v1], [, v2]) => v1['score'] - v2['score'])
  );
}
