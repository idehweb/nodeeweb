import { PUBLIC_ACCESS } from '@nodeeweb/core';
import { ControllerAccess, ControllerSchema } from '@nodeeweb/core';
import CartService from './cart.service';
import { AuthUserAccess } from '@nodeeweb/core';
import { controllerRegister } from '@nodeeweb/core';

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
  ];

  controllerSchemas.forEach((schema) =>
    controllerRegister(schema, {
      base_url: '/api/v1/order',
      from: 'ShopEntity',
    })
  );
}
