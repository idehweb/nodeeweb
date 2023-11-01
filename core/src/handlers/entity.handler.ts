import mongoose, { PopulateOptions } from 'mongoose';
import { isJSON } from 'class-validator';
import store from '../../store';
import { CRUD, CRUDCreatorOpt, MiddleWare, Req, Res } from '../../types/global';
import { NextFunction, Response } from 'express';
import { ControllerSchema } from '../../types/controller';
import {
  ControllerRegisterOptions,
  controllerRegister,
} from './controller.handler';
import { CRUD_DEFAULT_REQ_KEY } from '../constants/String';
import { BadRequestError, GeneralError, NotFound } from '../../types/error';
import { call } from '../../utils/helpers';
import { CrudParamDto, MultiIDParam } from '../../dto/in/crud.dto';
import _, { lowerFirst, orderBy } from 'lodash';
import { ClassConstructor } from 'class-transformer';

export function getEntityEventName(
  name: string,
  { pre, post, type }: { pre?: boolean; post?: boolean; type: CRUD }
) {
  return `${pre ? 'pre' : 'post'}-${type}-${name.toLocaleLowerCase()}`;
}
export class EntityCreator {
  constructor(private modelName: string) {}
  private get model() {
    return store.db.model(this.modelName);
  }

  private exportQueryParams(
    reqQuery: Req['query'],
    queryFields?: CRUDCreatorOpt['queryFields']
  ) {
    if (!queryFields) return {};

    let mapper: (key: string) => string | undefined;
    const defaultMapper = (key: string) =>
      ['sort', 'limit', 'offset', 'filter'].includes(key) ? `_${key}` : key;

    switch (typeof queryFields) {
      case 'function':
        mapper = queryFields;
        break;
      case 'object':
        mapper = (key) => queryFields[key];
        break;
      case 'boolean':
      default:
        mapper = defaultMapper;
        break;
    }

    const query: any = {};
    Object.entries(reqQuery).forEach(([k, v]) => {
      const newKey = mapper(k);
      if (!newKey) return;
      if (isJSON(v)) v = JSON.parse(v as any);
      query[newKey] = v;
    });

    return query as { [k: string]: string | string[] | object };
  }

  private async handleResult(
    req: Req,
    res: Response,
    next: NextFunction,
    {
      result,
      httpCode = 200,
      ...opt
    }: {
      result: any;
      httpCode: number;
    } & CRUDCreatorOpt
  ) {
    if (!result) throw new NotFound(`${this.modelName} not found`);
    const { sendResponse, saveToReq } = opt;

    if (sendResponse && !saveToReq) {
      const data =
        typeof sendResponse === 'boolean'
          ? result
          : await call(sendResponse, result, req);

      // call event
      this.postEntity(data, opt, req);
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
      paramFields,
      httpCode = 200,
      autoSetCount,
      queryFields,
      populate,
    }: Partial<CRUDCreatorOpt>
  ) {
    let result: any = query;
    const reqQuery = this.exportQueryParams(req.query, queryFields);
    const mySort: any = reqQuery['_sort'] ?? sort;
    if (mySort) query.sort(Array.isArray(mySort) ? mySort.pop() : mySort);
    if (project) query.projection(project);
    const offset = +(
      reqQuery['_offset'] ??
      this.getFrom(
        req,
        [{ reqKey: 'params', objKey: paramFields }],
        'offset',
        0
      )
    );

    const limit = +(
      reqQuery['_limit'] ??
      this.getFrom(
        req,
        [
          { reqKey: 'query', objKey: queryFields },
          { reqKey: 'params', objKey: paramFields },
        ],
        'limit',
        req.method === 'GET' ? 12 : 0
      )
    );
    if (offset) query.skip(offset);
    if (limit) query.limit(limit);

    // filter
    const filterFromQuery = Object.fromEntries(
      Object.entries(reqQuery).filter(([k, v]) => !k.startsWith('_'))
    );
    const directFilterQ: any = reqQuery._filter ?? {};
    query.setQuery({
      ...query.getQuery(),
      ...filterFromQuery,
      ...directFilterQ,
    });

    // populate
    if (populate) {
      if (!Array.isArray(populate)) populate = [populate];
      populate.forEach((p) => query.populate(p));
    }
    if (executeQuery) result = await query.exec();
    if (autoSetCount)
      res.setHeader(
        'X-Total-Count',
        await query.clone().countDocuments({}, { limit: null, skip: null })
      );

    // handle result and output
    await this.handleResult(req, res, next, {
      ...arguments[4],
      result,
      httpCode,
    });
  }

  preEntityCreator(opt: CRUDCreatorOpt): MiddleWare {
    return (req, res, next) => {
      store.event.emit(
        getEntityEventName(this.modelName, { pre: true, type: opt.type }),
        opt,
        req
      );
      return next();
    };
  }

  postEntity(data: any, opt: CRUDCreatorOpt, req: Req) {
    store.event.emit(
      getEntityEventName(this.modelName, { post: true, type: opt.type }),
      data,
      opt,
      req
    );
  }

  createOneCreator({
    parseBody,
    executeQuery,
    saveToReq,
    sendResponse,
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
        ...arguments[0],
        result: doc,
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
    paramFields: pf = { id: 'id', slug: 'slug' },
    ...opt
  }: CRUDCreatorOpt): MiddleWare {
    return async (req, res, next) => {
      const f = parseFilter
        ? await call(parseFilter, req)
        : {
            _id:
              pf.id &&
              req.params[pf.id] &&
              new mongoose.Types.ObjectId(req.params[pf.id]),
            slug: req.params[pf.slug],
          };

      for (const key in f) {
        if (f[key] === undefined) delete f[key];
      }

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
    paramFields: pf = { id: 'id', slug: 'slug' },
    ...opt
  }: CRUDCreatorOpt): MiddleWare {
    return async (req, res, next) => {
      const f = parseFilter
        ? await call(parseFilter, req)
        : {
            _id:
              pf.id &&
              req.params[pf.id] &&
              new mongoose.Types.ObjectId(req.params[pf.id]),
            slug: req.params[pf.slug],
          };

      for (const key in f) {
        if (f[key] === undefined) delete f[key];
      }

      const u = parseUpdate ? await call(parseUpdate, req) : req.body;
      const query = this.model.findOneAndUpdate(f, u, { new: true });
      return await this.baseCreator(query, req, res, next, opt);
    };
  }
  deleteOneCreator({
    parseFilter,
    forceDelete,
    parseUpdate,
    paramFields: pf = { id: 'id', slug: 'slug' },
    ...opt
  }: CRUDCreatorOpt): MiddleWare {
    return async (req, res, next) => {
      const f = parseFilter
        ? await call(parseFilter, req)
        : {
            _id:
              pf.id &&
              req.params[pf.id] &&
              new mongoose.Types.ObjectId(req.params[pf.id]),
            slug: req.params[pf.slug],
          };

      for (const key in f) {
        if (f[key] === undefined) delete f[key];
      }

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

const defaultCrudOpt: Omit<CRUDCreatorOpt, 'httpCode'> = {
  executeQuery: true,
  sendResponse: true,
  saveToReq: false,
  autoSetCount: true,
  queryFields: true,
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

    // set default values
    opt.crud = _.merge({ ...defaultCrudOpt }, opt.crud ?? {}, { type: cName });

    const defValidator = detectDefaultParamValidation(cName, opt);

    schemas.push({
      method: opt.controller.method ?? translateCRUD2Method(cName),
      url: opt.controller.url ?? translateCRUD2Url(cName, opt.crud),
      access: opt.controller.access,
      service: [
        creator.preEntityCreator(opt.crud),
        ...[opt.controller.beforeService ?? []].flat(),
        creator[translateCRUD2Creator(cName)](opt.crud),
        ...[opt.controller.service ?? []].flat(),
      ],
      validate: defValidator
        ? { reqPath: 'params', dto: defValidator }
        : opt.controller.validate,
    });
  }

  schemas.forEach((s) => controllerRegister(s, { ...registerOpt, base_url }));
}

function translateCRUD2Creator(
  name: CRUD
): Exclude<keyof EntityCreator, 'postEntity'> {
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
      const identifier = opt.paramFields?.id ?? opt.paramFields?.slug ?? 'id';
      return `/:${identifier}`;
    default:
      throw new Error(`Invalid CRUD name : ${name}`);
  }
}

function detectDefaultParamValidation(
  name: CRUD,
  opt: EntityCRUDOpt
): ClassConstructor<unknown> | null {
  const canUse =
    opt.controller.validate === undefined &&
    [CRUD.UPDATE_ONE, CRUD.DELETE_ONE, CRUD.GET_ONE].includes(name) &&
    (!opt.crud?.paramFields ||
      ['id', 'slug'].includes(opt.crud?.paramFields.id));

  return !canUse
    ? null
    : !opt.crud?.paramFields ||
      (opt.crud.paramFields.id && opt.crud.paramFields.slug)
    ? MultiIDParam
    : CrudParamDto;
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
