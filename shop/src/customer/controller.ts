import { registerEntityCRUD } from '@nodeeweb/core/src/handlers/entity.handler';
import Service from './service';
import {
  AdminAccess,
  AuthUserAccess,
  CustomerAccess,
  controllersBatchRegister,
} from '@nodeeweb/core';
import {
  CreateCustomerBody,
  UpdateCustomerBody,
  UpdatePasswordByOwn,
} from '../../dto/in/user/customer';
import { UserParamVal } from '../../dto/in/user';

export default function registerController() {
  // crud
  registerEntityCRUD(
    'customer',
    {
      getAll: {
        controller: {
          access: AdminAccess,
          service: Service.getAll,
        },
        crud: {
          parseFilter: Service.parseFilterForAllCustomer,
          autoSetCount: true,
          saveToReq: true,
          paramFields: {
            limit: 'limit',
            offset: 'offset',
          },
        },
      },
      getCount: {
        controller: {
          access: AdminAccess,
        },
      },
      updateOne: {
        controller: {
          access: AuthUserAccess,
          validate: [
            {
              dto: UpdateCustomerBody,
              reqPath: 'body',
            },
            { dto: UserParamVal, reqPath: 'params' },
          ],
        },
        crud: {
          parseFilter: Service.updateOneParseFilter,
          parseUpdate: Service.updateOneParseUpdate,
        },
      },
      getOne: {
        controller: {
          access: AuthUserAccess,
          validate: { dto: UserParamVal, reqPath: 'params' },
        },
        crud: { parseFilter: Service.getOneParseFilter },
      },
      create: {
        controller: {
          access: AdminAccess,
          validate: {
            dto: CreateCustomerBody,
            reqPath: 'body',
          },
        },
        crud: {
          parseBody: Service.createParseBody,
        },
      },
      deleteOne: {
        controller: { access: AdminAccess },
        crud: {
          forceDelete: true,
        },
      },
    },
    { from: 'ShopEntity' }
  );

  // update password
  controllersBatchRegister(
    [
      {
        method: 'patch',
        access: CustomerAccess,
        service: Service.updatePassword,
        validate: { dto: UpdatePasswordByOwn, reqPath: 'body' },
        url: 'updatePassword',
      },
    ],
    { base_url: '/api/v1/customer', from: 'ShopEntity' }
  );
}
