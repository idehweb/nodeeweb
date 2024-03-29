import { AdminAccess } from '../handlers/auth.handler';
import { registerEntityCRUD } from '../handlers/entity.handler';
import { uploadSingle } from '../handlers/upload.handler';
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
            not_reduce: '$notReduce',
          }),
        },
        crud: {
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
            not_reduce: '$notReduce',
          }),
          service: service.updateAfter,
        },
        crud: {
          parseUpdate: service.updateBodyParser,
          saveToReq: true,
          executeQuery: false,
        },
      },
      deleteOne: {
        controller: {
          access: AdminAccess,
          service: service.deleteAfter,
        },
        crud: {
          forceDelete: true,
        },
      },
    },
    { from: 'CoreFileEntity' }
  );
}
