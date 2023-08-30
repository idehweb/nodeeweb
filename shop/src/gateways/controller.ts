import {
  CRUD_DEFAULT_REQ_KEY,
  PUBLIC_ACCESS,
} from '@nodeeweb/core/src/constants/String';
import { ControllerAccess } from '@nodeeweb/core/types/controller';
import { registerEntityCRUD } from '@nodeeweb/core/src/handlers/entity.handler';
import { controllerRegister } from '@nodeeweb/core/src/handlers/controller.handler';
import Service from './service';
import store from '../../store';
import {
  CorePluginType,
  SMSPluginContent,
  SMSPluginType,
} from '@nodeeweb/core/types/plugin';

export default function registerController() {
  const access: ControllerAccess = { modelName: 'admin', role: PUBLIC_ACCESS };

  controllerRegister(
    {
      method: 'get',
      service: async (req, res) => {
        const phone = req.query.phone;
        const plugin = store.plugins.get(
          CorePluginType.SMS
        ) as SMSPluginContent;
        const sendSMS = plugin.stack[0];
        const response = await sendSMS({
          to: phone as string,
          type: SMSPluginType.Manual,
          text: 'hello world!',
        });
        return res.json(response);
      },
      url: '/sms',
    },
    { base_url: '/api/v1/gateway' }
  );

  // crud
  registerEntityCRUD(
    'gateway',
    {
      create: {
        controller: {
          access,
        },
      },
      getCount: {
        controller: {
          access,
        },
      },
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
      deleteOne: {
        controller: {
          access,
        },
        crud: {
          forceDelete: true,
        },
      },
    },
    { from: 'ShopEntity' }
  );
}
