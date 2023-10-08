import {
  CRUD_DEFAULT_REQ_KEY,
  PUBLIC_ACCESS,
} from '@nodeeweb/core/src/constants/String';
import { ControllerAccess } from '@nodeeweb/core/types/controller';
import { registerEntityCRUD } from '@nodeeweb/core/src/handlers/entity.handler';
import { controllersBatchRegister } from '@nodeeweb/core/src/handlers/controller.handler';
import { AuthUserAccess } from '@nodeeweb/core/src/handlers/auth.handler';
import Service from './service-old';
import { uploadSingle } from '@nodeeweb/core/src/handlers/upload.handler';
import { getPublicDir } from '@nodeeweb/core/utils/path';
import { join } from 'path';

export default function registerController() {
  const access: ControllerAccess = { modelName: 'admin', role: PUBLIC_ACCESS };
  controllersBatchRegister(
    [
      {
        url: '/restart',
        method: 'post',
        access,
        service: Service.restart,
      },
      {
        url: '/functions/:offset/:limit',
        method: 'get',
        access,
        service: Service.functions,
      },
      {
        url: '/events/:offset/:limit',
        method: 'get',
        access,
        service: Service.events,
      },
      {
        url: '/plugins/rules/:plugin',
        method: 'get',
        access,
        service: Service.pluginRules,
      },
      {
        url: '/plugins/rules/:plugin',
        method: 'put',
        access,
        service: Service.updatePluginRules,
      },
      {
        url: '/customerStatus',
        method: 'get',
        access,
        service: Service.customerStatus,
      },
      {
        url: '/formStatus',
        method: 'get',
        access,
        service: Service.formStatus,
      },
      {
        url: '/configuration',
        method: 'put',
        access,
        service: Service.configuration,
      },
      {
        url: '/configuration',
        method: 'get',
        access,
        service: Service.getConfiguration,
      },
      {
        url: '/factore',
        method: 'get',
        access,
        service: Service.factore,
      },
      {
        url: '/plugins',
        method: 'get',
        access,
        service: Service.plugins,
      },
      {
        url: '/deActivePlugins',
        method: 'get',
        access,
        service: Service.deActivePlugins,
      },
      {
        url: '/market',
        method: 'get',
        access,
        service: Service.market,
      },
      {
        url: '/deactivatePlugin',
        method: 'put',
        access,
        service: Service.deactivatePlugin,
      },
      {
        url: '/activatePlugin',
        method: 'put',
        access,
        service: Service.activatePlugin,
      },
      {
        url: '/update',
        method: 'post',
        access,
        service: Service.update,
      },
      {
        url: '/fileUpload',
        method: 'post',
        access,
        service: [
          ...uploadSingle({
            type: 'all',
            dir_path: join(getPublicDir('files', true)[0], 'site_setting'),
            max_size_mb: 100,
            reduce: { quality: 0.8 },
          }),
          Service.fileUpload,
        ],
      },
      {
        url: '/:id',
        method: 'put',
        access,
        service: Service.update,
      },
    ],
    {
      base_url: '/admin/settings',
      from: 'ShopEntity',
    }
  );
  controllersBatchRegister(
    [
      {
        url: '/',
        method: 'get',
        access: AuthUserAccess,
        service: Service.last,
      },
    ],
    {
      base_url: '/customer/settings',
      from: 'ShopEntity',
    }
  );

  // crud
  registerEntityCRUD(
    'setting',
    {
      getOne: {
        controller: {
          access,
        },
      },
      getAll: {
        controller: {
          access,
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
          access,
        },
      },
    },

    { from: 'ShopEntity' }
  );
}
