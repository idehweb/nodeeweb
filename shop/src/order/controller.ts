import {
  AdminAccess,
  PUBLIC_ACCESS,
  controllerRegister,
  controllersBatchRegister,
  registerEntityCRUD,
} from '@nodeeweb/core';
import { ControllerSchema } from '@nodeeweb/core';
import CartService from './cart.service';
import { AuthUserAccess } from '@nodeeweb/core';
import transactionService from './transaction.service';
import orderService from './order.service';
import {
  AddToCartBody,
  DeleteCombParam,
  ModifyCombBody,
  ModifyCombParam,
  UpdateCartBody,
} from '../../dto/in/order/cart';
import { OrderIdParam, UpdateOrderBody } from '../../dto/in/order/order';
import postService from './post.service';
import { PostOptionQuery } from '../../dto/in/order/post';
import { CreateTransactionBody } from '../../dto/in/order/transaction';

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
      validate: { dto: AddToCartBody, reqPath: 'body' },
    },
    {
      method: 'put',
      url: '/cart',
      service: CartService.editCart,
      access: AuthUserAccess,
      validate: { dto: UpdateCartBody, reqPath: 'body' },
    },
    {
      method: 'delete',
      url: '/cart/:productId',
      service: CartService.removeFromCart,
      access: AuthUserAccess,
    },
    {
      method: 'put',
      url: '/cart/:productId/:combId',
      service: CartService.modifyComb,
      access: AuthUserAccess,
      validate: [
        { reqPath: 'params', dto: ModifyCombParam },
        { reqPath: 'body', dto: ModifyCombBody },
      ],
    },
    {
      method: 'delete',
      url: '/cart/:productId/:combId',
      service: CartService.deleteComb,
      access: AuthUserAccess,
      validate: { reqPath: 'params', dto: DeleteCombParam },
    },
    {
      method: 'put',
      url: '/cart/checkout',
      service: CartService.checkout,
      access: AuthUserAccess,
    },
    {
      method: 'post',
      service: transactionService.createTransaction,
      url: '/transaction',
      access: AuthUserAccess,
      validate: { reqPath: 'body', dto: CreateTransactionBody },
    },
    {
      method: 'get',
      service: transactionService.paymentCallback,
      url: '/payment_callback/:orderId',
    },
    {
      method: 'post',
      service: transactionService.paymentCallback,
      url: '/payment_callback/:orderId',
    },
    {
      method: 'get',
      service: transactionService.getPrice,
      url: '/price',
      access: AuthUserAccess,
    },
    {
      method: 'get',
      service: postService.get,
      url: '/post',
      access: AuthUserAccess,
      validate: { reqPath: 'query', dto: PostOptionQuery },
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
          sort: { updatedAt: -1 },
          queryFields: true,
          paramFields: {
            limit: 'limit',
            offset: 'offset',
          },
        },
      },
    },
    {
      from: 'ShopEntity',
    }
  );

  controllerRegister(
    {
      method: 'put',
      service: orderService.update,
      url: '/',
      access: AdminAccess,
      validate: [
        {
          reqPath: 'params',
          dto: OrderIdParam,
        },
        {
          reqPath: 'body',
          dto: UpdateOrderBody,
        },
      ],
    },
    {
      base_url: '/api/v1/order',
      from: 'ShopEntity',
    }
  );
}
