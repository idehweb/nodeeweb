import {
  CRUD_DEFAULT_REQ_KEY,
  PUBLIC_ACCESS,
} from '@nodeeweb/core/src/constants/String';
import { ControllerAccess } from '@nodeeweb/core/types/controller';
import { registerEntityCRUD } from '@nodeeweb/core/src/handlers/entity.handler';
import { controllerRegister } from '@nodeeweb/core/src/handlers/controller.handler';
import { uploadSingle } from '@nodeeweb/core/src/handlers/upload.handler';
import { AdminAccess } from '@nodeeweb/core';
import service from './service';

export default function registerController() {
  //  crud
  registerEntityCRUD(
    'media',
    {
      getAll: {
        controller: {
          access: AdminAccess,
        },
        crud: {
          executeQuery: true,
          sendResponse: true,
          autoSetCount: true,
          paramFields: {
            limit: 'limit',
            offset: 'offset',
          },
          sort: { createdAt: -1 },
        },
      },
      create: {
        controller: {
          access: AdminAccess,
          beforeService: uploadSingle({
            type: 'all',
            max_size_mb: 1024,
            reduce: {
              quality: 80,
            },
          }),
        },
        crud: {
          executeQuery: true,
          sendResponse: true,
          parseBody: service.createBodyParser,
        },
      },
    },
    { base_url: '/api/v1/media', from: 'ShopEntity' }
  );
}
