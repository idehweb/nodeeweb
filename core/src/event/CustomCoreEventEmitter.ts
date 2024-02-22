import { captureRejectionSymbol } from 'events';
import { call } from '../../utils/helpers';
import { CoreEventEmitter } from './CoreEventEmitter.abstract';
import logger from '../handlers/log.handler';

export default class CustomCoreEventEmitter extends CoreEventEmitter {
  constructor() {
    super({ captureRejections: true });
    // this.setMaxListeners(Number.MAX_SAFE_INTEGER);
  }

  [captureRejectionSymbol](err: any, event: any, ...args: any) {
    logger.error(
      '[CustomCoreEventEmitter] rejection happened for',
      event,
      'with',
      err,
      args.map((a) => String(a))
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
      logger.error(
        '[CustomCoreEventEmitter] rejection happened for',
        eventName,
        'with',
        err,
        args.map((a) => String(a))
      );
      return false;
    }

    return true;
  }
  removeListener(
    eventName: string | symbol,
    listener: (...args: any[]) => void
  ): this {
    const serial = listener['serial'];
    console.log('remove call with serial', serial);
    if (serial) {
      this.listeners(eventName)
        .filter((l) => l['serial'] === serial)
        .forEach((l) => super.removeListener(eventName, l as any));
    }
    return super.removeListener(eventName, listener);
  }
}
