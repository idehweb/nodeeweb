import {
  CRUD_DEFAULT_REQ_KEY,
  PUBLIC_ACCESS,
} from '@nodeeweb/core/src/constants/String';
import { ControllerAccess } from '@nodeeweb/core/types/controller';
import { registerEntityCRUD } from '@nodeeweb/core/src/handlers/entity.handler';
import { controllersBatchRegister } from '@nodeeweb/core/src/handlers/controller.handler';
import Service from './service';
import {
  AdminAccess,
  AuthUserAccess,
} from '@nodeeweb/core/src/handlers/auth.handler';
import { CreateProductBody } from '../../dto/in/product';

export default function registerController() {
  const access: ControllerAccess = { modelName: 'admin', role: PUBLIC_ACCESS };

  // custom simple controllers
  controllersBatchRegister(
    [
      {
        url: '/torob/:offset/:limit',
        method: 'get',
        service: Service.torob,
      },
      {
        url: '/?:offset/?:limit',
        method: 'get',
        service: Service.getAll,
      },
    ],
    { base_url: '/product', from: 'ShopEntity' }
  );

  // crud
  registerEntityCRUD(
    'product',
    {
      getAll: {
        controller: {
          access: AdminAccess,
        },
        crud: {
          autoSetCount: true,
          paramFields: {
            offset: 'offset',
            limit: 'limit',
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
          access: AuthUserAccess,
          service: Service.getOneAfter,
        },
        crud: {
          parseFilter: Service.getOneFilterParser,
        },
      },
      create: {
        controller: {
          access,
          validate: {
            dto: CreateProductBody,
            reqPath: 'body',
          },
          service: Service.createAfter,
        },
        crud: {
          parseBody: Service.createBodyParser,
        },
      },
      updateOne: {
        controller: {
          access,
          service: Service.updateAfter,
        },
        crud: {
          parseUpdate: Service.updateBodyParser,
        },
      },
      deleteOne: {
        controller: {
          access,
          service: Service.deleteAfter,
        },
        crud: {
          parseUpdate: () => ({ status: 'trash' }),
        },
      },
    },
    { from: 'ShopEntity' }
  );
}
