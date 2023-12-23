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
import { call, safeJsonParse } from '../../utils/helpers';
import { CrudParamDto, MultiIDParam } from '../../dto/in/crud.dto';
import _, { isNil, lowerFirst, orderBy } from 'lodash';
import { ClassConstructor } from 'class-transformer';

export type SpecQueryParamsOut = {
  [k in '_limit' | '_sort' | '_offset']?: string | string[] | object;
};

function normalizeSort(sort = {}) {
  const flat = (sort = {} as any) => {
    return Array.isArray(sort) ? sort.pop() : sort;
  };
  const wellknown = (sort = {} as any) => {
    let newSort = sort;
    if (typeof newSort === 'string') {
      newSort = newSort.replace(/\b_?id\b/g, '_id');
    }
    return newSort;
  };
  return wellknown(flat(sort));
}

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

  private specQueryParams(
    reqQuery: Req['query'],
    queryFields?: CRUDCreatorOpt['queryFields']
  ): SpecQueryParamsOut {
    if (!queryFields) return {};

    let mapper: (key: string) => string | undefined;
    const defaultMapper = (key: string) =>
      ['sort', 'limit', 'offset'].includes(key) ? `_${key}` : null;

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

    return query;
  }

  async parseFilterQuery(opt: CRUDCreatorOpt, req: Req) {
    if (req.filter_query) return req.filter_query;

    const pf = opt.paramFields || { id: 'id', slug: 'slug' };

    const _internalFilter = () => {
      const extraFilter = safeJsonParse(req.query._filter || req.query.filter);
      const directFilters = Object.fromEntries(
        Object.entries(req.query).filter(
          ([k, v]) =>
            !['sort', 'filter', 'limit', 'offset', 'skip'].includes(k) &&
            !k.startsWith('_')
        )
      );
      return {
        ...directFilters,
        ...extraFilter,
        _id:
          pf?.id &&
          req.params[pf.id] &&
          new mongoose.Types.ObjectId(req.params[pf.id]),
        slug: req.params[pf?.slug],
        $expr: {
          $or: [
            { $eq: ['$active', true] },
            { $eq: ['missing', { $type: '$active' }] },
          ],
        },
      };
    };

    const f = opt.parseFilter
      ? await call(opt.parseFilter, req)
      : _internalFilter();

    for (const key in f) {
      if (f[key] === undefined) delete f[key];
    }

    req.filter_query = f;
    return f;
  }

  async parseUpdateQuery(opt: CRUDCreatorOpt, req: Req) {
    if (req.update_query) return req.update_query;
    const def =
      opt.type === CRUD.DELETE_ONE
        ? opt.forceDelete
          ? {}
          : { active: false }
        : req.body;
    const u = opt.parseUpdate ? await call(opt.parseUpdate, req) : def;
    req.update_query = u;
    return u;
  }

  async parseCreateQuery(opt: CRUDCreatorOpt, req: Req) {
    if (req.create_query) return req.create_query;
    const c = opt.parseBody ? await call(opt.parseBody, req) : req.body;
    req.create_query = c;
    return c;
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
    if (isNil(result)) throw new NotFound(`${this.modelName} not found`);
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
      httpCode = 200,
      autoSetCount,
      populate,
    }: Partial<CRUDCreatorOpt>
  ) {
    let result: any = query;
    if (project) query.projection(project);

    // populate
    if (populate) {
      if (!Array.isArray(populate)) populate = [populate];
      populate.forEach((p) => query.populate(p));
    }
    if (autoSetCount)
      res.setHeader(
        'X-Total-Count',
        await query.clone().countDocuments({}, { limit: null, skip: null })
      );
    if (executeQuery) result = await query.exec();

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

  createOneCreator({ executeQuery, project }: CRUDCreatorOpt) {
    return async (req: Req, res: Response, next: NextFunction) => {
      const body = await this.parseCreateQuery(arguments[0], req);
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
  getAllCreator({ queryFields, sort, ...opt }: CRUDCreatorOpt): MiddleWare {
    return async (req, res, next) => {
      // filter query
      const f = await this.parseFilterQuery(opt, req);

      // other query params
      const reqQuery = this.specQueryParams(req.query, queryFields);

      // init query
      const query = this.model.find(f);

      // sort
      const mySort: any = reqQuery._sort ?? sort ?? { createdAt: -1 };
      if (mySort) query.sort(normalizeSort(mySort));

      // skip and limit
      const offset = +(
        reqQuery._offset ??
        this.getFrom(
          req,
          [{ reqKey: 'params', objKey: opt.paramFields }],
          'offset',
          0
        )
      );

      const limit = +(
        reqQuery._limit ??
        this.getFrom(
          req,
          [
            { reqKey: 'query', objKey: queryFields },
            { reqKey: 'params', objKey: opt.paramFields },
          ],
          'limit',
          req.method === 'GET' ? 12 : 0
        )
      );
      if (offset) query.skip(offset);
      if (limit) query.limit(limit);

      return await this.baseCreator(query, req, res, next, opt);
    };
  }
  getOneCreator(opt: CRUDCreatorOpt): MiddleWare {
    return async (req, res, next) => {
      const f = await this.parseFilterQuery(opt, req);
      const query = this.model.findOne(f);
      return await this.baseCreator(query, req, res, next, opt);
    };
  }
  getCountCreator(opt: CRUDCreatorOpt): MiddleWare {
    return async (req, res, next) => {
      const f = await this.parseFilterQuery(opt, req);
      const query = this.model.countDocuments(f);
      return await this.baseCreator(query, req, res, next, opt);
    };
  }
  updateOneCreator(opt: CRUDCreatorOpt): MiddleWare {
    return async (req, res, next) => {
      const f = await this.parseFilterQuery(opt, req);
      const u = await this.parseUpdateQuery(opt, req);
      const query = this.model.findOneAndUpdate(f, u, { new: true });
      return await this.baseCreator(query, req, res, next, opt);
    };
  }
  deleteOneCreator(opt: CRUDCreatorOpt): MiddleWare {
    return async (req, res, next) => {
      const f = await this.parseFilterQuery(opt, req);
      const u = await this.parseUpdateQuery(opt, req);
      const query = opt.forceDelete
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

export function normalizeCrudOpt(
  opt: EntityCRUDOpt,
  modelName: string,
  crud: CRUD
) {
  // def controller
  opt.controller = opt.controller ?? {};

  // set default values
  opt.crud = _.merge({ ...defaultCrudOpt }, opt.crud ?? {}, {
    type: crud,
    model: modelName,
  });

  return opt;
}

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

    // normalize
    normalizeCrudOpt(opt, modelName, cName);

    const defValidator = detectDefaultParamValidation(cName, opt);

    // freeze options
    Object.freeze(opt);

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
):
  | 'createOneCreator'
  | 'getAllCreator'
  | 'getOneCreator'
  | 'updateOneCreator'
  | 'deleteOneCreator'
  | 'getCountCreator' {
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
export function translateCRUD2Url(
  name: CRUD,
  opt: Pick<CRUDCreatorOpt, 'paramFields'>
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
