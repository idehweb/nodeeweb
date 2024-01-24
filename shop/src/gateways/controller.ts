import { PUBLIC_ACCESS } from '@nodeeweb/core/src/constants/String';
import { ControllerAccess } from '@nodeeweb/core/types/controller';
import { registerEntityCRUD } from '@nodeeweb/core/src/handlers/entity.handler';
import { AuthUserAccess, OptUserAccess } from '@nodeeweb/core';
import Service from './service';
import { GatewayQuery } from '../../dto/in/gateway';

export default function registerController() {
  const access: ControllerAccess[] = OptUserAccess;
  const service = new Service();
  // crud
  registerEntityCRUD(
    'gateway',
    {
      getCount: {
        controller: {
          access,
          validate: { reqPath: 'query', dto: GatewayQuery },
        },
        crud: {
          parseFilter: service.getParseFilter,
        },
      },
      getOne: {
        controller: {
          access,
          validate: { reqPath: 'query', dto: GatewayQuery },
        },
        crud: {
          parseFilter: service.getParseFilter,
          project: service.getProject(),
        },
      },
      getAll: {
        controller: {
          access,
          validate: { reqPath: 'query', dto: GatewayQuery },
        },
        crud: {
          paramFields: {
            limit: 'limit',
            offset: 'offset',
          },
          parseFilter: service.getParseFilter,
          project: service.getProject(),
        },
      },
    },
    { from: 'ShopEntity', dbModel: 'plugin' }
  );
}
