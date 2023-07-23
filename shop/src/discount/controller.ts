import {
  CRUD_DEFAULT_REQ_KEY,
  PUBLIC_ACCESS,
} from '@nodeeweb/core/src/constants/String';
import { ControllerAccess } from '@nodeeweb/core/types/controller';
import { registerEntityCRUD } from '@nodeeweb/core/src/handlers/entity.handler';
import { controllerRegister } from '@nodeeweb/core/src/handlers/controller.handler';
import {
  AdminAccess,
  AuthUserAccess,
} from '@nodeeweb/core/src/handlers/auth.handler';
import discountService from './service';

export default function registerController() {
  // crud
  registerEntityCRUD(
    'discount',
    {
      create: {
        controller: {
          access: AdminAccess,
        },
        crud: {
          executeQuery: true,
          sendResponse: true,
        },
      },
      getOne: {
        controller: {
          access: AuthUserAccess,
        },
        crud: {
          parseFilter: discountService.getOneQueryParser,
          executeQuery: true,
          sendResponse: discountService.getOneTransform,
          paramFields: {
            id: 'discount',
          },
        },
      },

      getCount: {
        controller: {
          access: AdminAccess,
          service: (req, res) => {
            res.json({
              success: true,
              count: req[CRUD_DEFAULT_REQ_KEY],
            });
          },
        },
        crud: { executeQuery: true, sendResponse: false, saveToReq: true },
      },
      getAll: {
        controller: {
          access: AdminAccess,
          service: (req, res) => res.json(req[CRUD_DEFAULT_REQ_KEY]),
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
      updateOne: {
        controller: {
          access: AdminAccess,
          service(req, res) {
            res.json(req[CRUD_DEFAULT_REQ_KEY]);
          },
        },
        crud: {
          executeQuery: true,
          saveToReq: true,
        },
      },
      deleteOne: {
        controller: {
          access: AdminAccess,
        },
        crud: {
          executeQuery: true,
          saveToReq: true,
          forceDelete: true,
        },
      },
    },
    { base_url: '/api/v1/discount', from: 'ShopEntity' }
  );
}
