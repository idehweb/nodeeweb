import { SystemNotif } from '../../types/systemNotif';
import logger from '../handlers/log.handler';
import { registerSystemNotif } from '../handlers/systemNotif.handler';
import { LogNotif } from './LogNotif';
import { UserRegisterNotif } from './UserRegisterNotif';
import registerSystemNotifController from './controller';

export async function registerCoreSystemNotifs() {
  const notifObservers: SystemNotif[] = [
    // user-register
    new UserRegisterNotif(),

    // log
    // new LogNotif(),
  ];

  // register
  for (const observer of notifObservers) {
    await registerSystemNotif(observer, { logger, from: 'CoreSystemNotifs' });
  }

  // controllers
  registerSystemNotifController();
}
