import {
  CRUD_DEFAULT_REQ_KEY,
  PUBLIC_ACCESS,
} from '@nodeeweb/core/src/constants/String';
import { ControllerAccess } from '@nodeeweb/core/types/controller';
import { registerEntityCRUD } from '@nodeeweb/core/src/handlers/entity.handler';
import { controllersBatchRegister } from '@nodeeweb/core/src/handlers/controller.handler';
import Service from './service';
import { CreateProductBody, UpdateProductBody } from '../../dto/in/product';

export default function registerController() {
  const access: ControllerAccess = { modelName: 'admin', role: PUBLIC_ACCESS };
  // crud
  registerEntityCRUD(
    'product',
    {
      getAll: {
        crud: {
          parseFilter: Service.getAllFilterParser,
          autoSetCount: true,
          paramFields: {
            offset: 'offset',
            limit: 'limit',
          },
        },
      },
      getCount: {},
      getOne: {
        controller: {
          service: Service.getOneAfter,
        },
        crud: {
          populate: { path: 'productCategory' },
        },
      },
      create: {
        controller: {
          access,
          validate: {
            dto: CreateProductBody,
            reqPath: 'body',
          },
        },
        crud: {
          parseBody: Service.createBodyParser,
        },
      },
      updateOne: {
        controller: {
          access,
          validate: {
            reqPath: 'body',
            dto: UpdateProductBody,
          },
        },
        crud: {
          parseUpdate: Service.updateBodyParser,
        },
      },
      deleteOne: {
        controller: {
          access,
        },
        crud: {
          parseUpdate: () => ({ status: 'trash', active: false }),
        },
      },
    },
    { from: 'ShopEntity' }
  );
}
