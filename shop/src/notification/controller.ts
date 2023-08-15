import { registerEntityCRUD } from '@nodeeweb/core/src/handlers/entity.handler';
import { AdminAccess } from '@nodeeweb/core';
import { CreateNotification } from '../../dto/in/notification';
import Service from './service';

export default function registerController() {
  const service = new Service();
  // crud
  registerEntityCRUD(
    'notification',
    {
      create: {
        controller: {
          access: AdminAccess,
          validate: {
            dto: CreateNotification,
            reqPath: 'body',
          },
          service: service.afterCreate,
        },
        crud: {
          executeQuery: true,
          saveToReq: true,
        },
      },
      getAll: {
        controller: {
          access: AdminAccess,
        },
        crud: {
          executeQuery: true,
          sendResponse: true,
          autoSetCount: true,
          paramFields: {
            limit: 'limit',
            offset: 'offset',
          },
        },
      },
      getCount: {
        controller: {
          access: AdminAccess,
        },
        crud: {
          executeQuery: true,
          sendResponse: true,
        },
      },
      getOne: {
        controller: {
          access: AdminAccess,
        },
        crud: {
          executeQuery: true,
          sendResponse: true,
        },
      },
    },
    { from: 'ShopEntity' }
  );
}
