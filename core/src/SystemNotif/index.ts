import logger from '../handlers/log.handler';
import { registerSystemNotif } from '../handlers/systemNotif.handler';
import { UserRegisterNotif } from './UserRegisterNotif';

export async function registerCoreSystemNotifs() {
  // user-register
  const userRegister = new UserRegisterNotif();

  // register
  await registerSystemNotif(userRegister, { logger, from: 'CoreSystemNotifs' });
}
