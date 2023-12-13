import {
  CRUD_DEFAULT_REQ_KEY,
  PUBLIC_ACCESS,
} from '@nodeeweb/core/src/constants/String';
import { ControllerAccess } from '@nodeeweb/core/types/controller';
import { registerEntityCRUD } from '@nodeeweb/core/src/handlers/entity.handler';
import { AdminAccess, controllersBatchRegister } from '@nodeeweb/core';
import { IDParam } from '@nodeeweb/core/dto/in/crud.dto';
import service from './service';
import { ActivityBody } from '../../dto/in/activity';

export default function registerController() {
  registerEntityCRUD(
    'activity',
    {
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
        controller: { access: AdminAccess },
      },
      getOne: {
        controller: {
          access: AdminAccess,
          validate: { dto: IDParam, reqPath: 'params' },
        },
      },
    },
    { from: 'ShopEntity' }
  );

  // update
  controllersBatchRegister(
    [
      {
        method: 'post',
        access: AdminAccess,
        validate: { reqPath: 'body', dto: ActivityBody },
        service: service.act,
        url: '/',
      },
    ],
    { base_url: '/api/v1/activity', from: 'ShopEntity' }
  );
}
