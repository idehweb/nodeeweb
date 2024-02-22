import {
  CRUD_DEFAULT_REQ_KEY,
  PUBLIC_ACCESS,
} from '@nodeeweb/core/src/constants/String';
import { ControllerAccess } from '@nodeeweb/core/types/controller';
import { registerEntityCRUD } from '@nodeeweb/core/src/handlers/entity.handler';
import { CampaignCreateDTO, CampaignUpdateDTO } from '../../dto/in/campaign';

export default function registerController() {
  const access: ControllerAccess = { modelName: 'admin', role: PUBLIC_ACCESS };
  registerEntityCRUD(
    'Campaign',
    {
      create: {
        controller: {
          access,
          validate: { dto: CampaignCreateDTO, reqPath: 'body' },
        },
      },
      getCount: {},
      getOne: {},
      getAll: {
        crud: {
          paramFields: {
            limit: 'limit',
            offset: 'offset',
          },
        },
      },
      updateOne: {
        controller: {
          access,
          validate: { dto: CampaignUpdateDTO, reqPath: 'body' },
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
