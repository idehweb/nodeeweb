import {
  OPTIONAL_LOGIN,
  PUBLIC_ACCESS,
} from '@nodeeweb/core/src/constants/String';
import { ControllerAccess } from '@nodeeweb/core/types/controller';
import { registerEntityCRUD } from '@nodeeweb/core/src/handlers/entity.handler';
import Service from './service';
import { AdminAccess, OptUserAccess } from '@nodeeweb/core';
import { PageBody, PageUpdate } from '../../dto/in/page';

export default function registerController() {
  // create , update , getAll  , getOne , deleteOne
  registerEntityCRUD(
    'page',
    {
      getCount: {
        controller: {
          access: AdminAccess,
        },
      },
      getOne: {
        controller: {
          access: OptUserAccess,
        },
        crud: {
          parseFilter: Service.getOneFilter,
        },
      },
      getAll: {
        controller: {
          access: AdminAccess,
        },
        crud: {
          autoSetCount: true,
          queryFields: true,
          paramFields: {
            limit: 'limit',
            offset: 'offset',
          },
        },
      },
      create: {
        controller: {
          access: AdminAccess,
          service: Service.createAfter,
          validate: { reqPath: 'body', dto: PageBody },
        },
        crud: {
          saveToReq: true,
        },
      },
      updateOne: {
        controller: {
          access: AdminAccess,
          service: Service.updateAfter,
          validate: { dto: PageUpdate, reqPath: 'body' },
        },
        crud: {
          executeQuery: false,
          saveToReq: true,
        },
      },
      deleteOne: {
        controller: {
          access: AdminAccess,
          service: Service.deleteAfter,
        },
        crud: {
          executeQuery: true,
          saveToReq: true,
        },
      },
    },
    { from: 'ShopEntity' }
  );
}
