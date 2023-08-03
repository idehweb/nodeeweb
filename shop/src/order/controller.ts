import {
  AdminAccess,
  PUBLIC_ACCESS,
  controllersBatchRegister,
  registerEntityCRUD,
} from '@nodeeweb/core';
import { ControllerSchema } from '@nodeeweb/core';
import CartService from './cart.service';
import { AuthUserAccess } from '@nodeeweb/core';
import transactionService from './transaction.service';
import orderService from './order.service';

export default function registerController() {
  // api
  const controllerSchemas: ControllerSchema[] = [
    {
      method: 'get',
      url: '/cart',
      service: CartService.getCart,
      access: AuthUserAccess,
    },
    {
      method: 'post',
      url: '/cart',
      service: CartService.addToCart,
      access: AuthUserAccess,
    },
    {
      method: 'put',
      url: '/cart',
      service: CartService.editCart,
      access: AuthUserAccess,
    },
    {
      method: 'delete',
      url: '/cart/:productId',
      service: CartService.removeFromCart,
      access: AuthUserAccess,
    },
    {
      method: 'post',
      service: transactionService.createTransaction,
      url: '/transaction',
      access: AuthUserAccess,
    },
    {
      method: 'get',
      service: transactionService.paymentCallback,
      url: '/payment_callback/:orderId',
    },
    {
      method: 'get',
      service: transactionService.getPrice,
      url: '/price',
      access: AuthUserAccess,
    },
  ];

  controllersBatchRegister(controllerSchemas, {
    base_url: '/api/v1/order',
    from: 'ShopEntity',
  });

  // crud
  registerEntityCRUD(
    'order',
    {
      getOne: {
        controller: {
          access: AuthUserAccess,
        },
        crud: {
          parseFilter: orderService.getOneFilterParser,
          sendResponse: true,
          executeQuery: true,
          paramFields: {
            id: 'order',
          },
        },
      },
      getAll: {
        controller: {
          access: AuthUserAccess,
        },
        crud: {
          parseFilter: orderService.getAllFilterParser,
          sendResponse: true,
          executeQuery: true,
          sort: { updatedAt: -1 },
          paramFields: {
            limit: 'limit',
            offset: 'offset',
          },
        },
      },
      updateOne: {
        controller: {
          access: AdminAccess,
          service: orderService.updateOneAfter,
        },
        crud: {
          parseFilter: orderService.updateOneFilterParser,
          parseUpdate: orderService.updateOneParseBody,
          saveToReq: true,
          executeQuery: true,
          paramFields: {
            id: 'order',
          },
        },
      },
    },
    {
      from: 'ShopEntity',
    }
  );
}
