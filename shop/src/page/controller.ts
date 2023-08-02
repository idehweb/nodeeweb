import {
  OPTIONAL_LOGIN,
  PUBLIC_ACCESS,
} from '@nodeeweb/core/src/constants/String';
import { ControllerAccess } from '@nodeeweb/core/types/controller';
import { registerEntityCRUD } from '@nodeeweb/core/src/handlers/entity.handler';
import Service from './service';

export default function registerController() {
  const access: ControllerAccess = { modelName: 'admin', role: PUBLIC_ACCESS };

  // create , update , getAll  ,getOne
  registerEntityCRUD(
    'page',
    {
      getCount: {
        controller: {
          access,
          service: (req, res) => {
            res.json({
              success: true,
              count: req.crud,
            });
          },
        },
        crud: { executeQuery: true, sendResponse: false, saveToReq: true },
      },
      getOne: {
        controller: {
          access: [
            {
              role: OPTIONAL_LOGIN,
              modelName: 'customer',
            },
            {
              role: OPTIONAL_LOGIN,
              modelName: 'admin',
            },
          ],
          service: Service.getOneAfter,
        },
        crud: {
          executeQuery: true,
          saveToReq: true,
          parseFilter: Service.getOneFilterParser,
        },
      },
      getAll: {
        controller: {
          access,
          service: (req, res) => res.json(req.crud),
        },
        crud: {
          parseFilter(req) {
            if (req.query.filter && typeof req.query.filter === 'string') {
              return JSON.parse(req.query.filter);
            }
          },
          autoSetCount: true,
          saveToReq: true,
          executeQuery: true,
          paramFields: {
            limit: 'limit',
            offset: 'offset',
          },
        },
      },
      create: {
        controller: {
          access,
          service: Service.createAfter,
        },
        crud: {
          executeQuery: true,
          saveToReq: true,
        },
      },
      updateOne: {
        controller: {
          access,
          service: Service.updateAfter,
        },
        crud: {
          executeQuery: true,
          saveToReq: true,
        },
      },
    },
    { from: 'ShopEntity' }
  );
}
