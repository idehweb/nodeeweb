import _ from 'lodash';
import store from '../../store';
import { RegisterOptions } from '../../types/register';
import { AdminViewSchema } from '../../types/view';
import { color } from '../../utils/color';
import { StoreTemplate, TemplateDocument } from '../../types/template';
import { StoreRoute } from '../../types/route';

export function registerAdminView(
  view: AdminViewSchema,
  { from, logger = store.systemLogger, onStartup }: RegisterOptions
) {
  store.adminViews[view.name] = view.content;
  logger.log(
    color(
      'Magenta',
      `## ${from ? `${from} ` : ''}Register ${_.startCase(view.name)} View ##`
    )
  );
}

export function registerTemplate(
  {
    template,
    type,
    title,
  }: { type: string; template: StoreTemplate; title?: string },
  { from, logger = store.systemLogger, onStartup }: RegisterOptions
) {
  store.templates[type] = template;
  onStartup ||
    store.supervisor?.emit(
      'register-template',
      {
        template,
        type,
        title,
      },
      { from: `Supervisor-${from}` }
    );
  logger.log(
    color(
      'Magenta',
      `## ${from ? `${from} ` : ''}Register ${
        title ? `${_.startCase(_.kebabCase(title))}:` : ''
      }${_.startCase(_.kebabCase(type))} Template ##`
    )
  );
}

export function unregisterTemplate(
  { type, title }: { type: string; title?: string },
  { from, logger = store.systemLogger, onStartup }: RegisterOptions
) {
  delete store.templates[type];
  onStartup ||
    store.supervisor?.emit(
      'unregister-template',
      { type, title },
      { from: `Supervisor-${from}` }
    );
  logger.log(
    color(
      'Magenta',
      `## ${from ? `${from} ` : ''}Unregister ${
        title ? `${_.startCase(_.kebabCase(title))}:` : ''
      }${_.startCase(_.kebabCase(type))} Template ##`
    )
  );
}

export function registerRoute(
  { route, name }: { name: string; route: StoreRoute },
  { from, logger = store.systemLogger, onStartup }: RegisterOptions
) {
  if (!route.path) throw new Error(`path in ${name} route is undefined`);

  if (!route.path.startsWith('/')) route.path = `/${route.path}`;
  store.routes[name] = route;
  onStartup || store.supervisor?.emit('register-route', { route, name });

  logger.log(
    color(
      'Magenta',
      `## ${from ? `${from} ` : ''}Register ${_.startCase(name)} ==> ${
        route.path
      } Route ##`
    )
  );
}

export function unregisterRoute(
  { name }: { name: string },
  { from, logger = store.systemLogger, onStartup }: RegisterOptions
) {
  const canDelete = delete store.routes[name];
  onStartup ||
    store.supervisor?.emit(
      'unregister-route',
      { name },
      { from: `Supervisor-${from}` }
    );

  canDelete &&
    logger.log(
      color(
        'Magenta',
        `## ${from ? `${from} ` : ''}Unregister ${_.startCase(
          _.kebabCase(name)
        )} Route ##`
      )
    );
}
