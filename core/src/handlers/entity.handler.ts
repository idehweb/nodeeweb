import mongoose from "mongoose";
import store from "../../store";
import { CRUD, CRUDCreatorOpt, MiddleWare, Req } from "../../types/global";
import { NextFunction, Response } from "express";
import { ControllerSchema } from "../../types/controller";
import { controllerRegister } from "./controller.handler";

export class EntityCreator {
  constructor(private modelName: string) {}
  private get model() {
    return store.db.model(this.modelName);
  }
  private async baseCreator(
    query: mongoose.Query<any, any>,
    req: Req,
    res: Response,
    next: NextFunction,
    {
      execute,
      paginate,
      project,
      sort,
      reqParamField,
      code = 200,
    }: Partial<CRUDCreatorOpt>
  ) {
    let result: any = query;

    if (sort) query.sort(sort);
    if (project) query.projection(project);
    if (paginate) query.skip(paginate.skip ?? 0).limit(paginate.limit ?? 12);
    if (execute) result = await query.exec();

    if (reqParamField) {
      req[reqParamField] = result;
      return next();
    }

    return res.status(code).json({ data: result });
  }
  createOneCreator({
    parseBody,
    execute,
    reqParamField,
    project,
  }: CRUDCreatorOpt) {
    return async (req: Req, res: Response, next: NextFunction) => {
      const body = parseBody(req) ?? req.body;
      let doc = this.model.create(body);
      if (execute) {
        doc = (await doc)._doc;
        if (project) {
          Object.entries(project)
            .filter(([k, v]) => !v)
            .map(([k]) => delete doc[k]);
        }
      }
      if (reqParamField) {
        req[reqParamField] = doc;
        return next();
      }
      return res.status(201).json({ data: doc });
    };
  }
  getAllCreator({ filter, parseFilter, ...opt }: CRUDCreatorOpt): MiddleWare {
    return async (req, res, next) => {
      const f = filter ?? parseFilter(req) ?? {};
      if (!opt.sort) opt.sort = { createdAt: -1 };
      const query = this.model.find(f);
      return await this.baseCreator(query, req, res, next, opt);
    };
  }
  getOneCreator({
    filter,
    parseFilter,
    paramIdField = "id",
    ...opt
  }: CRUDCreatorOpt): MiddleWare {
    return async (req, res, next) => {
      const f = filter ??
        parseFilter(req) ?? {
          _id: new mongoose.Types.ObjectId(req.params[paramIdField]),
        };
      const query = this.model.findOne(f);
      return await this.baseCreator(query, req, res, next, opt);
    };
  }
  updateOneCreator({
    filter,
    parseFilter,
    update,
    parseUpdate,
    paramIdField = "id",
    ...opt
  }: CRUDCreatorOpt): MiddleWare {
    return async (req, res, next) => {
      const f = filter ??
        parseFilter(req) ??
        {} ?? { _id: new mongoose.Types.ObjectId(req.params[paramIdField]) };
      const u = update ?? parseUpdate(req) ?? {};
      const query = this.model.findOneAndUpdate(f, u, { new: true });
      return await this.baseCreator(query, req, res, next, opt);
    };
  }
  deleteOneCreator({
    filter,
    parseFilter,
    forceDelete,
    paramIdField = "id",
    ...opt
  }: CRUDCreatorOpt): MiddleWare {
    return async (req, res, next) => {
      const f = filter ??
        parseFilter(req) ?? {
          _id: new mongoose.Types.ObjectId(req.params[paramIdField]),
        };
      const query = forceDelete
        ? this.model.deleteOne(f)
        : this.model.findOneAndUpdate(f, { $set: { active: false } });
      return await this.baseCreator(query, req, res, next, {
        ...opt,
        code: 204,
      });
    };
  }
}

export type EntityCRUDOpt = {
  crud: CRUDCreatorOpt;
  controller: Partial<ControllerSchema>;
};
export function getEntityCRUD(
  modelName: string,
  opts: {
    [CRUD.CREATE]?: EntityCRUDOpt;
    [CRUD.GET_ALL]?: EntityCRUDOpt;
    [CRUD.GET_ONE]?: EntityCRUDOpt;
    [CRUD.UPDATE_ONE]?: EntityCRUDOpt;
    [CRUD.DELETE_ONE]?: EntityCRUDOpt;
  },
  base_url?: string
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

  schemas.forEach((s) => controllerRegister(s, { base_url }));
}

function translateCRUD2Creator(name: CRUD): keyof EntityCreator {
  switch (name) {
    case CRUD.CREATE:
      return "createOneCreator";
    case CRUD.GET_ALL:
      return "getAllCreator";
    case CRUD.GET_ONE:
      return "getOneCreator";
    case CRUD.UPDATE_ONE:
      return "updateOneCreator";
    case CRUD.DELETE_ONE:
      return "deleteOneCreator";
    default:
      throw new Error(`Invalid CRUD name : ${name}`);
  }
}
function translateCRUD2Method(name: CRUD): ControllerSchema["method"] {
  switch (name) {
    case CRUD.CREATE:
      return "post";
    case CRUD.GET_ALL:
      return "get";
    case CRUD.GET_ONE:
      return "get";
    case CRUD.UPDATE_ONE:
      return "put";
    case CRUD.DELETE_ONE:
      return "delete";
    default:
      throw new Error(`Invalid CRUD name : ${name}`);
  }
}
function translateCRUD2Url(
  name: CRUD,
  opt: CRUDCreatorOpt
): ControllerSchema["url"] {
  switch (name) {
    case CRUD.CREATE:
    case CRUD.GET_ALL:
      return "/";
    case CRUD.GET_ONE:
    case CRUD.UPDATE_ONE:
    case CRUD.DELETE_ONE:
      return `/:${opt.paramIdField ?? "id"}`;
    default:
      throw new Error(`Invalid CRUD name : ${name}`);
  }
}
