import store from '../../store';
import { RegisterOptions } from '../../types/register';
import { SystemNotif } from '../../types/systemNotif';
import { call } from '../../utils/helpers';

export async function registerSystemNotif(
  sysNotif: SystemNotif,
  { logger = store.systemLogger, from }: RegisterOptions
) {
  // push
  store.sysNotifs.push(sysNotif);

  // register
  await call(sysNotif.register.bind(sysNotif), store);

  // log
  logger.log(
    '[SystemNotif]',
    `${from ? `[${from}] ` : ''}register ${sysNotif.id}`
  );
}

export async function unregisterSystemNotif(
  id: string,
  { logger = store.systemLogger, from }: RegisterOptions
) {
  const baseMsg = `[SystemNotif]${from ? ` [${from}]` : ''}`;

  // find
  const sysIndex = store.sysNotifs.findIndex((sys) => sys.id === id);
  const sys = sysIndex !== -1 ? store.sysNotifs[sysIndex] : null;

  // not found
  if (!sys) {
    logger.error(baseMsg, 'not found', id);
    return false;
  }

  // unregister
  await call(sys.unregister.bind(sys), store);

  // filter
  store.sysNotifs = store.sysNotifs.filter((_, i) => i !== sysIndex);

  // log
  logger.log(baseMsg, 'unregister', sys.id);

  return true;
}
