import {
  OPTIONAL_LOGIN,
  PUBLIC_ACCESS,
} from '@nodeeweb/core/src/constants/String';
import { ControllerAccess } from '@nodeeweb/core/types/controller';
import { registerEntityCRUD } from '@nodeeweb/core/src/handlers/entity.handler';
import Service from './service';
import { AdminAccess, OptUserAccess } from '@nodeeweb/core';

export default function registerController() {
  // create , update , getAll  ,getOne
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
          service: Service.getOneAfter,
        },
        crud: {
          parseFilter: Service.getOneFilterParser,
          paramFields: {
            id: 'page',
          },
        },
      },
      getAll: {
        controller: {
          access: AdminAccess,
        },
        crud: {
          parseFilter(req) {
            if (req.query.filter && typeof req.query.filter === 'string') {
              return JSON.parse(req.query.filter);
            }
          },
          autoSetCount: true,
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
        },
      },
      updateOne: {
        controller: {
          access: AdminAccess,
          service: Service.updateAfter,
        },
      },
    },
    { from: 'ShopEntity' }
  );
}
