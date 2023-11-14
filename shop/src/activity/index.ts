import { getEntityEventName } from '@nodeeweb/core/src/handlers/entity.handler';
import store from '../../store';
import registerController from './controller';
import registerView from './view';
import { CRUD } from '@nodeeweb/core';
import service from './service';

function registerEvents() {
  const models = store.db.modelNames();
  const allEvents = models.flatMap((model) =>
    Object.values(CRUD).map((crud) => [
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
    store.event.on(event, service.pre.bind(service));
  // post
  for (const event of postEvents)
    store.event.on(event, service.post.bind(service));
}

export default function registerActivity() {
  registerController();
  registerView();
  registerEvents();
}
