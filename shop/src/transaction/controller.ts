import {
  AdminAccess,
  AuthUserAccess,
  controllerRegister,
  controllersBatchRegister,
  registerEntityCRUD,
} from '@nodeeweb/core';
import service from './service';
import {
  TransactionCreateBody,
  TransactionUpdateBody,
} from '../../dto/in/transaction';
import paymentService from './payment.service';
import { IDParam, MultiIDParam } from '@nodeeweb/core/dto/in/crud.dto';
export default function registerTransactionController() {
  registerEntityCRUD(
    'transaction',
    {
      create: {
        controller: {
          access: AdminAccess,
          validate: { reqPath: 'body', dto: TransactionCreateBody },
          beforeService: service.beforeCreate,
          service: service.afterCreate,
        },
        crud: {
          saveToReq: true,
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
        controller: {
          access: AuthUserAccess,
          validate: { dto: IDParam, reqPath: 'params' },
        },
        crud: { parseFilter: service.parseGetOneFilter },
      },
      updateOne: {
        controller: {
          access: AdminAccess,
          validate: { dto: TransactionUpdateBody, reqPath: 'body' },
          service: service.afterUpdate,
        },
        crud: {
          parseFilter: service.parseUpdateFilter,
          parseUpdate: service.parseUpdateBody,
          saveToReq: true,
        },
      },
      deleteOne: {
        controller: { access: AdminAccess },
      },
    },
    { base_url: '/api/v1/transaction', from: 'ShopEntity' }
  );

  controllersBatchRegister(
    [
      {
        method: 'get',
        service: paymentService.paymentCallback,
        url: '/payment_callback/:transactionId',
      },
      {
        method: 'post',
        service: paymentService.paymentCallback,
        url: '/payment_callback/:transactionId',
      },
    ],
    { base_url: '/api/v1/transaction', from: 'ShopEntity' }
  );
}
