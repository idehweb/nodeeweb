import store from '../../store';
import { color } from '../../utils/color';
import { configService } from '../config/service';
import logger from '../handlers/log.handler';
import { registerFuncSupervisor } from '../handlers/supervisor.handler';
import {
  registerRoute,
  registerTemplate,
  unregisterRoute,
  unregisterTemplate,
} from '../handlers/view.handler';
import Supervisor from './Supervisor';

export default function initSupervisor() {
  updateSupervisor();
  store.event.on('config-update', (changes) => {
    if (changes?.supervisor !== undefined) updateSupervisor();
    store.supervisor?.emit('config-update', changes);
  });

  registerFuncSupervisor(
    'config-update',
    configService.updateConf.bind(configService)
  );
  registerFuncSupervisor('register-template', registerTemplate);
  registerFuncSupervisor('unregister-template', unregisterTemplate);
  registerFuncSupervisor('register-route', registerRoute);
  registerFuncSupervisor('unregister-route', unregisterRoute);
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
