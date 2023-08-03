import {
  OPTIONAL_LOGIN,
  PUBLIC_ACCESS,
} from '@nodeeweb/core/src/constants/String';
import { ControllerAccess } from '@nodeeweb/core/types/controller';
import { registerEntityCRUD } from '@nodeeweb/core/src/handlers/entity.handler';
import Service from './service';
import { AdminAccess, OptUserAccess } from '@nodeeweb/core';

export default function registerController() {
  // create , update , getAll  ,getOne
  registerEntityCRUD(
    'page',
    {
      getCount: {
        controller: {
          access: AdminAccess,
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
          access: OptUserAccess,
          service: Service.getOneAfter,
        },
        crud: {
          executeQuery: true,
          saveToReq: true,
          parseFilter: Service.getOneFilterParser,
          paramFields: {
            id: 'page',
          },
        },
      },
      getAll: {
        controller: {
          access: AdminAccess,
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
          access: AdminAccess,
          service: Service.createAfter,
        },
        crud: {
          executeQuery: true,
          saveToReq: true,
        },
      },
      updateOne: {
        controller: {
          access: AdminAccess,
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
