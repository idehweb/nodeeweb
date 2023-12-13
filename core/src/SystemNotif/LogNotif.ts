import winston from 'winston';
import store, { Store } from '../../store';
import { catchFn } from '../../utils/catchAsync';
import { LOG_EVENT_NAME } from '../handlers/log.handler';
import { CoreSystemNotif } from './CoreSystemNotif';

export const LOG_NOTIF_ID = 'log-core';
export const LOG_NOTIF_TYPE = 'log';

export class LogNotif extends CoreSystemNotif {
  id = LOG_NOTIF_ID;
  type = LOG_NOTIF_TYPE;

  private onErrorCatch(err: Error) {
    store.systemLogger.error('[LogNotif] catch error', err);
  }

  private onLog = catchFn(
    async (type: LOG_EVENT_NAME, body: winston.LogEntry, ...args: any[]) => {
      this.save({
        message: `[${type}] ${body.label ? `[${body.label}] ` : ''}${
          body.message
        }`,
      });
    },
    {
      onError: this.onErrorCatch.bind(this),
    }
  );

  register(store: Store): void | Promise<void> {
    store.event.addListener(LOG_EVENT_NAME.ALL, this.onLog);
  }
  unregister(store: Store): void | Promise<void> {
    store.event.removeListener(LOG_EVENT_NAME.ALL, this.onLog);
  }
}
