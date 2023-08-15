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
      },
      getAll: {
        controller: {
          access: AdminAccess,
        },
        crud: {
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
      },
      getOne: {
        controller: {
          access: AdminAccess,
        },
      },
    },
    { from: 'ShopEntity' }
  );
}
