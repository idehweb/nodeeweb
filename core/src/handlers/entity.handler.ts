import mongoose, { PopulateOptions } from 'mongoose';
import store from '../../store';
import { CRUD, CRUDCreatorOpt, MiddleWare, Req, Res } from '../../types/global';
import { NextFunction, Response } from 'express';
import { ControllerSchema } from '../../types/controller';
import {
  ControllerRegisterOptions,
  controllerRegister,
} from './controller.handler';
import { CRUD_DEFAULT_REQ_KEY } from '../constants/String';
import { isAsyncFunction } from 'util/types';
import { BadRequestError, GeneralError, NotFound } from '../../types/error';

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
    if (!result && httpCode !== 204)
      throw new NotFound(`${this.modelName} not found`);

    if (sendResponse && !saveToReq) {
      const data =
        typeof sendResponse === 'boolean'
          ? result
          : isAsyncFunction(sendResponse)
          ? await sendResponse(result)
          : sendResponse(result);
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
    executeQuery,
    saveToReq,
    sendResponse,
    project,
  }: CRUDCreatorOpt) {
    return async (req: Req, res: Response, next: NextFunction) => {
      const body = parseBody ? parseBody(req) : req.body;

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
  getAllCreator({ filter, parseFilter, ...opt }: CRUDCreatorOpt): MiddleWare {
    return async (req, res, next) => {
      const f = filter ?? parseFilter ? parseFilter(req) : {};
      if (!opt.sort) opt.sort = { createdAt: -1 };
      const query = this.model.find(f);
      return await this.baseCreator(query, req, res, next, opt);
    };
  }
  getOneCreator({
    filter,
    parseFilter,
    paramFields = { id: 'id' },
    ...opt
  }: CRUDCreatorOpt): MiddleWare {
    return async (req, res, next) => {
      const f =
        filter ?? parseFilter
          ? parseFilter(req)
          : {
              _id: new mongoose.Types.ObjectId(req.params[paramFields.id]),
            };
      const query = this.model.findOne(f);
      return await this.baseCreator(query, req, res, next, opt);
    };
  }
  getCountCreator({ filter, parseFilter, ...opt }: CRUDCreatorOpt): MiddleWare {
    return async (req, res, next) => {
      const f = filter ?? parseFilter ? parseFilter(req) : {};
      const query = this.model.countDocuments(f);
      return await this.baseCreator(query, req, res, next, opt);
    };
  }
  updateOneCreator({
    filter,
    parseFilter,
    update,
    parseUpdate,
    paramFields = { id: 'id' },
    ...opt
  }: CRUDCreatorOpt): MiddleWare {
    return async (req, res, next) => {
      const f =
        filter ?? parseFilter
          ? parseFilter(req)
          : {
              _id: new mongoose.Types.ObjectId(req.params[paramFields.id]),
            };
      const u = update ?? parseUpdate ? parseUpdate(req) : req.body;
      const query = this.model.findOneAndUpdate(f, u, { new: true });
      return await this.baseCreator(query, req, res, next, opt);
    };
  }
  deleteOneCreator({
    filter,
    parseFilter,
    forceDelete,
    update,
    parseUpdate,
    paramFields = { id: 'id' },
    ...opt
  }: CRUDCreatorOpt): MiddleWare {
    return async (req, res, next) => {
      const f = filter ??
        parseFilter(req) ?? {
          _id: new mongoose.Types.ObjectId(req.params[paramFields.id]),
        };
      const u = update ?? parseUpdate ? parseUpdate(req) : { active: false };
      const query = forceDelete
        ? this.model.deleteOne(f)
        : this.model.findOneAndUpdate(f, u);
      return await this.baseCreator(query, req, res, next, {
        ...opt,
        httpCode: 204,
      });
    };
  }
}

export type EntityCRUDOpt = {
  crud: Omit<CRUDCreatorOpt, 'httpCode'>;
  controller: Partial<ControllerSchema>;
};
export function registerEntityCRUD(
  modelName: string,
  opts: {
    [CRUD.CREATE]?: EntityCRUDOpt;
    [CRUD.GET_ALL]?: EntityCRUDOpt;
    [CRUD.GET_ONE]?: EntityCRUDOpt;
    [CRUD.UPDATE_ONE]?: EntityCRUDOpt;
    [CRUD.DELETE_ONE]?: EntityCRUDOpt;
    [CRUD.GET_COUNT]?: EntityCRUDOpt;
  },
  registerOpt: ControllerRegisterOptions
) {
  const schemas: ControllerSchema[] = [];
  const creator = new EntityCreator(modelName);
  for (const [name, opt] of Object.entries(opts).filter(([k, v]) => v)) {
    const cName = name as CRUD;
    schemas.push({
      method: opt.controller.method ?? translateCRUD2Method(cName),
      url: opt.controller.url ?? translateCRUD2Url(cName, opt.crud),
      access: opt.controller.access,
      service: [
        creator[translateCRUD2Creator(cName)](opt.crud),
        ...[opt.controller.service ?? []].flat(),
      ],
    });
  }

  schemas.forEach((s) => controllerRegister(s, registerOpt));
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
