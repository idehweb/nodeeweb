import {
  ISystemNotif,
  SystemNotifModel,
} from '../../schema/systemNotif.schema';
import store from '../../store';
import { SystemNotif } from '../../types/systemNotif';

export abstract class CoreSystemNotif extends SystemNotif {
  get model(): SystemNotifModel {
    return store.db.model('systemNotif');
  }

  async save(notif: Partial<ISystemNotif> & { message: string }) {
    return await this.model.create({
      _id: this.id,
      type: this.type,
      from: this['constructor'].name,
      ...notif,
    });
  }
}
