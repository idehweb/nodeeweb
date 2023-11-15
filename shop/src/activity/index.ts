import { getEntityEventName } from '@nodeeweb/core/src/handlers/entity.handler';
import store from '../../store';
import registerController from './controller';
import registerView from './view';
import { CRUD } from '@nodeeweb/core';
import service from './service';
import { catchFn } from '@nodeeweb/core/utils/catchAsync';

function registerEvents() {
  const models = store.db.modelNames();
  const allEvents = models.flatMap((model) =>
    [CRUD.CREATE, CRUD.DELETE_ONE, CRUD.UPDATE_ONE].map((crud) => [
      getEntityEventName(model, { pre: true, type: crud }),
      getEntityEventName(model, { post: true, type: crud }),
    ])
  );

  const [preEvents, postEvents] = allEvents.reduce<[string[], string[]]>(
    (prev, [pre, post]) => {
      prev[0].push(pre);
      prev[1].push(post);
      return prev;
    },
    [[], []]
  );

  // register
  // pre
  for (const event of preEvents)
    store.event.on(
      event,
      catchFn(service.pre, {
        self: service,
        onError(err: any) {
          store.systemLogger.error('[ActivityEvent] [pre]', err);
        },
      })
    );
  // post
  for (const event of postEvents)
    store.event.on(
      event,
      catchFn(service.post, {
        self: service,
        onError(err: any) {
          store.systemLogger.error('[ActivityEvent] [post]', err);
        },
      })
    );
}

export default function registerActivity() {
  registerController();
  registerView();
  registerEvents();
}
