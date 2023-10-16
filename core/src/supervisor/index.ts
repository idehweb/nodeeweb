import store from '../../store';
import { color } from '../../utils/color';
import logger from '../handlers/log.handler';
import Supervisor from './Supervisor';

export default function initSupervisor() {
  updateSupervisor();
  store.event.on('config', (changes) => {
    if (changes?.supervisor !== undefined) updateSupervisor();
    store.supervisor?.emit('config', changes);
  });
}

function updateSupervisor() {
  const s = new Supervisor();
  if (!s.isInitiate) {
    if (store.supervisor) {
      store.supervisor = null;
      logger.log(color('Red', 'Supervisor deactivate'));
    }
    return;
  }
  store.supervisor = s;
  logger.log(color('Green', 'Supervisor activate'));
}

// TODO
need an api to recieve supervisor event action