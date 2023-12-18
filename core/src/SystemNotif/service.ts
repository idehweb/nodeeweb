import { UpdateQuery } from 'mongoose';
import { SystemNotifUpdateBody } from '../../dto/in/systemNotif';
import { CRUD, Req } from '../../types/global';
import { ISystemNotif } from '../../schema/systemNotif.schema';
import { EntityCreator, normalizeCrudOpt } from '../handlers/entity.handler';

class Service {
  parseUpdateBody(req: Req) {
    const user = req.user;
    const body = req.body as SystemNotifUpdateBody;
    const update: UpdateQuery<ISystemNotif> = {};

    if (body.view) {
      update.$addToSet = {
        viewers: { _id: user._id },
      };
    }

    return update;
  }

  async parseFilter(req: Req) {
    const user = req.user;
    const { new: newItem, ...others } = req.query;
    req.query = others;
    let filter = await new EntityCreator('systemNotif').parseFilterQuery(
      normalizeCrudOpt({}, 'systemNotif', CRUD.UPDATE_ONE).crud,
      req
    );

    if (String(newItem).toLowerCase() === 'true')
      filter = { ...filter, 'viewers._id': { $ne: user._id } };

    return filter;
  }
}

export default new Service();
