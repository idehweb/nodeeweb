import {
  ControllerAccess,
  PUBLIC_ACCESS,
  controllersBatchRegister,
  registerEntityCRUD,
} from '@nodeeweb/core';
import Service from './service';

export default function registerController() {
  const access: ControllerAccess = { modelName: 'admin', role: PUBLIC_ACCESS };

  // custom api
  controllersBatchRegister(
    [
      {
        method: 'post',
        service: Service.login,
        url: '/login',
      },
      {
        method: 'post',
        service: Service.resetAdmin,
        url: '/resetAdmin',
        access,
      },
    ],
    { base_url: '/admin/admin', from: 'ShopEntity' }
  );

  registerEntityCRUD(
    'admin',
    {
      create: {
        controller: {
          access,
        },
        crud: {
          sendResponse: true,
          executeQuery: true,
          project: { password: 0 },
        },
      },
      updateOne: {
        controller: {
          access,
          url: '/',
        },
        crud: {
          sendResponse: true,
          executeQuery: true,
          parseFilter: (req) => ({ _id: req.user._id }),
        },
      },
    },
    { base_url: '/admin/admin', from: 'ShopEntity' }
  );
}
