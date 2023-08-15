import EventEmitter, { captureRejectionSymbol } from 'events';
import logger from '../handlers/log.handler';
import { registerEvent } from '../handlers/event.handler';

export class CoreEvent extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](err: any, event: any, ...args: any) {
    logger.error(
      '[CoreEvent] rejection happened for',
      event,
      'with',
      err,
      ...args
    );
  }
}

export function registerDefaultEvent() {
  registerEvent(new CoreEvent(), { from: 'CoreEvent', logger });
}
