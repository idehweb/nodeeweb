import {
  CRUD_DEFAULT_REQ_KEY,
  PUBLIC_ACCESS,
} from '@nodeeweb/core/src/constants/String';
import { ControllerAccess } from '@nodeeweb/core/types/controller';
import { registerEntityCRUD } from '@nodeeweb/core/src/handlers/entity.handler';
import { PostCreateDTO, PostUpdateDTO } from '../../dto/in/post';

export default function registerController() {
  const access: ControllerAccess = { modelName: 'admin', role: PUBLIC_ACCESS };
  registerEntityCRUD(
    'post',
    {
      create: {
        controller: {
          access,
          validate: { dto: PostCreateDTO, reqPath: 'body' },
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
          validate: { dto: PostUpdateDTO, reqPath: 'body' },
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
