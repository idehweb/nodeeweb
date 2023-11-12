import {
  AdminAccess,
  AuthUserAccess,
  controllersBatchRegister,
  registerEntityCRUD,
} from '@nodeeweb/core';
import service from './service';
import {
  TransactionCreateBody,
  TransactionUpdateBody,
} from '../../dto/in/transaction';
export default function registerTransactionController() {
  registerEntityCRUD(
    'transaction',
    {
      create: {
        controller: {
          access: AdminAccess,
          validate: { reqPath: 'body', dto: TransactionCreateBody },
        },
        crud: {
          parseBody: service.parseCreateBody,
        },
      },
      getAll: {
        controller: { access: AuthUserAccess },
        crud: {
          parseFilter: service.parseGetAllFilter,
          paramFields: { offset: 'offset', limit: 'limit' },
        },
      },
      getCount: {
        controller: { access: AuthUserAccess },
        crud: {
          parseFilter: service.parseCountFilter,
        },
      },
      getOne: {
        controller: { access: AuthUserAccess },
        crud: { parseFilter: service.parseGetOneFilter },
      },
      updateOne: {
        controller: {
          access: AdminAccess,
          validate: { dto: TransactionUpdateBody, reqPath: 'body' },
        },
        crud: {
          parseBody: service.parseUpdateBody,
        },
      },
      deleteOne: {
        controller: { access: AdminAccess },
      },
    },
    { base_url: '/api/v1/transaction', from: 'ShopEntity' }
  );
}
