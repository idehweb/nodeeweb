import { captureRejectionSymbol } from 'events';
import { call } from '../../utils/helpers';
import { CoreEventEmitter } from './CoreEventEmitter.abstract';
import logger from '../handlers/log.handler';

export default class CustomCoreEventEmitter extends CoreEventEmitter {
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
  async emitWithWait(
    eventName: string | symbol,
    ...args: any[]
  ): Promise<boolean> {
    try {
      const listeners = this.listeners(eventName) ?? [];
      for (const listener of listeners) await call(listener as any, ...args);
    } catch (err) {
      return false;
    }

    return true;
  }
}
