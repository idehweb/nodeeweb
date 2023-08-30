import { controllerRegister } from '@nodeeweb/core/src/handlers/controller.handler';
import Service from './service';
import {
  AdminAccess,
  AuthUserAccess,
} from '@nodeeweb/core/src/handlers/auth.handler';
import { registerEntityCRUD } from '@nodeeweb/core';

export default function registerController() {
  // crud
  registerEntityCRUD(
    'form',
    {
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
      create: {
        controller: {
          access: AdminAccess,
        },
      },
      updateOne: {
        controller: {
          access: AdminAccess,
        },
      },
      deleteOne: {
        controller: {
          access: AdminAccess,
        },
        crud: {
          forceDelete: true,
        },
      },
    },
    { from: 'ShopEntity' }
  );
}
