import { registerEntityCRUD } from '@nodeeweb/core/src/handlers/entity.handler';
import Service from './service';
import { AdminAccess, AuthUserAccess } from '@nodeeweb/core';

export default function registerController() {
  // crud
  registerEntityCRUD(
    'customer',
    {
      getAll: {
        controller: {
          access: AdminAccess,
          service: Service.getAll,
        },
        crud: {
          parseFilter: Service.parseFilterForAllCustomer,
          autoSetCount: true,
          saveToReq: true,
          executeQuery: true,
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
      updateOne: {
        controller: {
          access: AuthUserAccess,
        },
        crud: {
          parseFilter: Service.updateOneParseFilter,
          parseUpdate: Service.updateOneParseUpdate,
          executeQuery: true,
          sendResponse: true,
        },
      },
      getOne: {
        controller: {
          access: AuthUserAccess,
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
