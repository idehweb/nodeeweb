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
      },
      getOne: {
        controller: {
          access: AuthUserAccess,
        },
        crud: {
          parseFilter: discountService.getOneQueryParser,
          sendResponse: discountService.getOneTransform,
          paramFields: {
            id: 'discount',
          },
        },
      },

      getCount: {
        controller: {
          access: AdminAccess,
        },
      },
      getAll: {
        controller: {
          access: AdminAccess,
        },
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
          access: AdminAccess,
        },
        crud: {
          parseFilter: discountService.updateOneParseFilter,
          paramFields: {
            id: 'discount',
          },
        },
      },
      deleteOne: {
        controller: {
          access: AdminAccess,
        },
        crud: {
          forceDelete: true,
        },
      },
    },
    { from: 'ShopEntity' }
  );
}
