import {
  PUBLIC_ACCESS,
  controllersBatchRegister,
  registerEntityCRUD,
} from '@nodeeweb/core';
import { ControllerAccess, ControllerSchema } from '@nodeeweb/core';
import CartService from './cart.service';
import { AuthUserAccess } from '@nodeeweb/core';
import { controllerRegister } from '@nodeeweb/core';
import transactionService from './transaction.service';

export default function registerController() {
  const access: ControllerAccess = { modelName: 'admin', role: PUBLIC_ACCESS };

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
      service: transactionService.getPrice,
      url: '/price',
      access: AuthUserAccess,
    },
  ];

  controllersBatchRegister(controllerSchemas, {
    base_url: '/api/v1/order',
    from: 'ShopEntity',
  });
}
