import { Store } from '../../store';
import { UserDocument } from '../../types/user';
import { catchFn } from '../../utils/catchAsync';
import { AuthEvents } from '../auth/authGateway.strategy';
import logger from '../handlers/log.handler';
import { CoreSystemNotif } from './CoreSystemNotif';

export const USER_REGISTER_NOTIF_ID = 'user-register-core';
export const USER_REGISTER_NOTIF_TYPE = 'user-register';

export class UserRegisterNotif extends CoreSystemNotif {
  id = USER_REGISTER_NOTIF_ID;
  type = USER_REGISTER_NOTIF_TYPE;

  onRegister = catchFn(async (user: UserDocument) => {
    await this.save({ message: 'user register' });
  });

  async register(store: Store) {
    store.event.on(AuthEvents.AfterRegister, this.onRegister);
  }
  async unregister(store: Store) {
    store.event.removeListener(AuthEvents.AfterRegister, this.onRegister);
  }
  onError(err: Error, ...args: any[]) {
    logger.error('[UserRegisterSystemNotif]', 'rase error', err);
  }
}
