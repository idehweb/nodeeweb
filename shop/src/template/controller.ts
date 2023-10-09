import { AdminAccess } from '@nodeeweb/core';
import { registerEntityCRUD } from '@nodeeweb/core/src/handlers/entity.handler';
import templateService from './service';

export default function registerController() {
  registerEntityCRUD(
    'template',
    {
      create: {
        controller: {
          access: AdminAccess,
          service: templateService.afterCreate,
        },
        crud: {
          saveToReq: true,
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
      updateOne: {
        controller: {
          access: AdminAccess,
          service: templateService.afterUpdate,
        },
        crud: {
          saveToReq: true,
          executeQuery: false,
        },
      },
      deleteOne: {
        controller: {
          access: AdminAccess,
          service: templateService.afterDelete,
        },
        crud: {
          forceDelete: true,
          saveToReq: true,
        },
      },
    },
    { from: 'ShopEntity' }
  );
}
