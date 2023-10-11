import store from '../../store';
import { color } from '../../utils/color';
import logger from '../handlers/log.handler';
import Supervisor from './Supervisor';

export default function initSupervisor() {
  activeSupervisor();
  store.event.on('config', (changes) => {
    if (!changes?.supervisor) return;
    activeSupervisor();
  });
}

export function activeSupervisor() {
  const s = new Supervisor();
  if (!s.isInitiate) return;
  store.supervisor = s;
  logger.log(color('Green', 'Supervisor activated'));
}
