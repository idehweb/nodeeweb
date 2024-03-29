import {
  CRUD_DEFAULT_REQ_KEY,
  PUBLIC_ACCESS,
} from '@nodeeweb/core/src/constants/String';
import { ControllerAccess } from '@nodeeweb/core/types/controller';
import { registerEntityCRUD } from '@nodeeweb/core/src/handlers/entity.handler';
import { CategoryCreateDTO, CategoryUpdateDTO } from '../../dto/in/category';

export default function registerController() {
  const access: ControllerAccess = { modelName: 'admin', role: PUBLIC_ACCESS };
  registerEntityCRUD(
    'category',
    {
      create: {
        controller: {
          access,
          validate: { dto: CategoryCreateDTO, reqPath: 'body' },
        },
      },
      getCount: {},
      getOne: {},
      getAll: {
        crud: {
          parseFilter(req) {
            if (req.query.filter && typeof req.query.filter === 'string') {
              return JSON.parse(req.query.filter);
            }
          },
          autoSetCount: true,
          paramFields: {
            limit: 'limit',
            offset: 'offset',
          },
        },
      },
      updateOne: {
        controller: {
          access,
          validate: { dto: CategoryUpdateDTO, reqPath: 'body' },
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
