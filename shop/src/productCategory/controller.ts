import {
  CRUD_DEFAULT_REQ_KEY,
  PUBLIC_ACCESS,
} from '@nodeeweb/core/src/constants/String';
import { ControllerAccess } from '@nodeeweb/core/types/controller';
import { registerEntityCRUD } from '@nodeeweb/core/src/handlers/entity.handler';
import {
  ProductCategoryCreateDTO,
  ProductCategoryUpdateDTO,
} from '../../dto/in/productCategory';

export default function registerController() {
  const access: ControllerAccess = { modelName: 'admin', role: PUBLIC_ACCESS };
  registerEntityCRUD(
    'productCategory',
    {
      create: {
        controller: {
          access,
          validate: { dto: ProductCategoryCreateDTO, reqPath: 'body' },
        },
      },
      getCount: {},
      getOne: {},
      getAll: {
        crud: {
          paramFields: {
            limit: 'limit',
            offset: 'offset',
          },
        },
      },
      updateOne: {
        controller: {
          access,
          validate: { dto: ProductCategoryUpdateDTO, reqPath: 'body' },
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
