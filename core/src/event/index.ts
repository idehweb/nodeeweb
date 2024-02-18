import logger from '../handlers/log.handler';
import { registerEvent } from '../handlers/event.handler';
import CustomCoreEventEmitter from './CustomCoreEventEmitter';

export function registerDefaultEvent() {
  registerEvent(new CustomCoreEventEmitter(), {
    from: 'CustomCoreEventEmitter',
    logger,
  });
}
