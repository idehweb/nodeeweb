import { registerEntityCRUD } from '@nodeeweb/core/src/handlers/entity.handler';
import { uploadSingle } from '@nodeeweb/core/src/handlers/upload.handler';
import { AdminAccess } from '@nodeeweb/core';
import service from './service';

export default function registerController() {
  //  crud
  registerEntityCRUD(
    'file',
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
              format: 'webp',
            },
          }),
        },
        crud: {
          executeQuery: true,
          sendResponse: true,
          parseBody: service.createBodyParser,
        },
      },
      updateOne: {
        controller: {
          access: AdminAccess,
          beforeService: uploadSingle({
            type: 'all',
            max_size_mb: 1024,
            reduce: {
              quality: 80,
              format: 'webp',
            },
          }),
          service: service.updateAfter,
        },
        crud: {
          executeQuery: false,
          saveToReq: true,
          parseUpdate: service.updateBodyParser,
        },
      },
      deleteOne: {
        controller: {
          access: AdminAccess,
          service: service.deleteAfter,
        },
        crud: {
          executeQuery: true,
          saveToReq: true,
          forceDelete: true,
        },
      },
    },
    { from: 'ShopEntity' }
  );
}
