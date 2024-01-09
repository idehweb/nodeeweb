import { registerEntityCRUD } from '@nodeeweb/core/src/handlers/entity.handler';
import Service from './service';
import { AdminAccess } from '@nodeeweb/core';

export default function registerController() {
  //  crud
  registerEntityCRUD(
    'entry',
    {
      getAll: {
        controller: {
          access: AdminAccess,
        },
        crud: {
          autoSetCount: true,
          populate: { path: 'form', select: '_id slug title' },
          parseFilter: Service.getAllQuery,
          project: 'updatedAt trackingCode createdAt _id form',
          paramFields: {
            limit: 'limit',
            offset: 'offset',
          },
        },
      },
      create: {
        controller: {
          url: '/:form',
        },
        crud: {
          parseBody: Service.createOneBodyParser,
        },
      },
    },
    { from: 'ShopEntity' }
  );
}
