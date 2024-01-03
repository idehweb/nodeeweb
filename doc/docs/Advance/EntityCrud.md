---
sidebar_position: 4
---

# Entity Crud
In Nodeeweb each entities are handle with **Entity Crud** which register default **crud** controllers and services with a lot of options

## Table of Contents

- [Structure](#structure)
- [Default Options](#default-options)
- [Example](#example)

## Structure
there is a **Entity Creator** that create specific crud router, and we use `registerEntityCRUD` as it factory method to create, initiate and config.
```ts
function registerEntityCRUD(
  modelName: string,
  opts: EntityOpts,
  registerOpt: ControllerRegisterOptions & { order?: boolean }
)
```
opts defines **what** crud routes we have and **how** it must configure

```ts
type EntityOpts = {
  [CRUD.CREATE]?: EntityCRUDOpt;
  [CRUD.GET_ALL]?: EntityCRUDOpt;
  [CRUD.GET_ONE]?: EntityCRUDOpt;
  [CRUD.UPDATE_ONE]?: EntityCRUDOpt;
  [CRUD.DELETE_ONE]?: EntityCRUDOpt;
  [CRUD.GET_COUNT]?: EntityCRUDOpt;
};
export type EntityCRUDOpt = {
  crud?: Omit<CRUDCreatorOpt, 'httpCode'>;
  controller?: Partial<ControllerSchema> & {
    beforeService?: MiddleWare | MiddleWare[];
  };
}
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
  model?: string;
};

export enum CRUD {
  GET_ALL = 'getAll',
  GET_ONE = 'getOne',
  GET_COUNT = 'getCount',
  CREATE = 'create',
  UPDATE_ONE = 'updateOne',
  DELETE_ONE = 'deleteOne',
}
```

> by default deletion not **delete** entity only change active attribute into false
         

registerOpt use default **controller options** combine with `order` that show order of crud registration if set true follow this order:
1) Create
2) Get count
3) Get One
4) Get All
5) Update One
6) Delete One

otherwise order of opt initiate

## Default Options
Entity crud handler merge each options with default option

```ts
{
  executeQuery: true,
  sendResponse: true,
  saveToReq: false,
  autoSetCount: true,
  queryFields: true,
};
```


## Example
try to register **post** entity
```ts
const access = { modelName: 'admin', role: PUBLIC_ACCESS };
registerEntityCRUD(
    'post',
    {
      create: {
        controller: {
          access,
        },
      },
      getCount: {},
      getOne: {},
      getAll: {
        crud: {
          paramFields: {
            limit: 'limit',
            offset: 'offset',
          },
        },
      },
      updateOne: {
        controller: {
          access,
        },
      },
      deleteOne: {
        controller: {
          access,
        },
        crud: {
          forceDelete: true,
        },
      },
    },
    { from: 'ShopEntity' }
  );
```