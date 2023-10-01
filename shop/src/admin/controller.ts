import {
  AdminAccess,
  ControllerAccess,
  PUBLIC_ACCESS,
  controllersBatchRegister,
  registerEntityCRUD,
} from '@nodeeweb/core';
import { plainToInstance } from 'class-transformer';
import Service from './service';
import { CreateAdminBody, UpdateAdminBody } from '../../dto/in/user/admin';
import { UserParamVal } from '../../dto/in/user';

export default function registerController() {
  const access: ControllerAccess = { modelName: 'admin', role: PUBLIC_ACCESS };

  // custom api
  controllersBatchRegister(
    [
      {
        method: 'post',
        service: Service.login,
        url: '/login',
      },
      {
        method: 'post',
        service: Service.resetAdmin,
        url: '/resetAdmin',
        access,
      },
    ],
    { base_url: '/admin/admin', from: 'ShopEntity' }
  );

  registerEntityCRUD(
    'admin',
    {
      getCount: {
        controller: {
          access: AdminAccess,
        },
      },
      getOne: {
        controller: {
          access: AdminAccess,
          validate: { dto: UserParamVal, reqPath: 'params' },
        },
        crud: {
          parseFilter: Service.getOneParseFilter,
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
      create: {
        controller: {
          access,
          validate: { reqPath: 'body', dto: CreateAdminBody },
        },
        crud: {
          project: { password: 0 },
        },
      },
      updateOne: {
        controller: {
          access,
          validate: [
            { reqPath: 'body', dto: UpdateAdminBody },
            { dto: UserParamVal, reqPath: 'params' },
          ],
        },
        crud: {
          parseFilter: Service.getOneParseFilter,
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
}
