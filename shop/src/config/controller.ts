import { AdminAccess, controllerRegister } from '@nodeeweb/core';
import { configService } from '@nodeeweb/core/src/config/service';
import { ShopConfigBody } from '../../dto/config';

export default function registerController() {
  controllerRegister(
    {
      method: 'put',
      url: '/system',
      service: configService.update,
      access: AdminAccess,
      validate: {
        dto: ShopConfigBody,
        reqPath: 'body',
      },
    },
    { from: 'ShopEntity', base_url: '/api/v1/config' }
  );
}
