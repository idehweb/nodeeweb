import { IDParam } from '../../dto/in/crud.dto';
import { AdminAccess } from '../handlers/auth.handler';
import { registerEntityCRUD } from '../handlers/entity.handler';

export default function registerSystemNotifController() {
  // crud notif
  registerEntityCRUD(
    'systemNotif',
    {
      getAll: {
        controller: { access: AdminAccess },
        crud: {
          paramFields: {
            limit: 'limit',
            offset: 'offset',
          },
        },
      },
      getCount: {
        controller: { access: AdminAccess },
        crud: {
          paramFields: {
            limit: 'limit',
            offset: 'offset',
          },
        },
      },
      getOne: {
        controller: {
          access: AdminAccess,
          validate: { dto: IDParam, reqPath: 'body' },
        },
        crud: {
          paramFields: {
            id: 'id',
          },
        },
      },
    },
    { from: 'CoreEntity', base_url: '/api/v1/systemNotif/notif' }
  );
}
