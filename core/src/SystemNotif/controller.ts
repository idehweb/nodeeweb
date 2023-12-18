import { IDParam } from '../../dto/in/crud.dto';
import { SystemNotifUpdateBody } from '../../dto/in/systemNotif';
import { AdminAccess } from '../handlers/auth.handler';
import { registerEntityCRUD } from '../handlers/entity.handler';
import service from './service';

export default function registerSystemNotifController() {
  // crud notif
  registerEntityCRUD(
    'systemNotif',
    {
      getAll: {
        controller: { access: AdminAccess },
        crud: {
          parseFilter: service.parseFilter,
          paramFields: {
            limit: 'limit',
            offset: 'offset',
          },
        },
      },
      getCount: {
        controller: { access: AdminAccess },
        crud: {
          parseFilter: service.parseFilter,
          paramFields: {
            limit: 'limit',
            offset: 'offset',
          },
        },
      },
      getOne: {
        controller: {
          access: AdminAccess,
          validate: { dto: IDParam, reqPath: 'params' },
        },
        crud: {
          paramFields: {
            id: 'id',
          },
        },
      },
      updateOne: {
        controller: {
          access: AdminAccess,
          validate: { reqPath: 'body', dto: SystemNotifUpdateBody },
        },
        crud: {
          parseUpdate: service.parseUpdateBody,
        },
      },
    },
    { from: 'CoreEntity', base_url: '/api/v1/systemNotif/notif' }
  );
}
