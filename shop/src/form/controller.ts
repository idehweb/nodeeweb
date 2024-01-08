import { controllerRegister } from '@nodeeweb/core/src/handlers/controller.handler';
import Service from './service';
import {
  AdminAccess,
  AuthUserAccess,
} from '@nodeeweb/core/src/handlers/auth.handler';
import { registerEntityCRUD } from '@nodeeweb/core';
import { FormCreateDTO, FormUpdateDTO } from '../../dto/in/form';

export default function registerController() {
  // crud
  registerEntityCRUD(
    'form',
    {
      getOne: {},
      getAll: {
        crud: {
          paramFields: {
            limit: 'limit',
            offset: 'offset',
          },
        },
      },
      getCount: {},
      create: {
        controller: {
          access: AdminAccess,
          validate: { dto: FormCreateDTO, reqPath: 'body' },
        },
      },
      updateOne: {
        controller: {
          access: AdminAccess,
          validate: { dto: FormUpdateDTO, reqPath: 'body' },
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
