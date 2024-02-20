import EventEmitter from 'events';

export abstract class CoreEventEmitter extends EventEmitter {
  abstract emitWithWait(
    eventName: string | symbol,
    ...args: any[]
  ): Promise<boolean>;
}
