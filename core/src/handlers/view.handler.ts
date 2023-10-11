import _ from 'lodash';
import store from '../../store';
import { RegisterOptions } from '../../types/register';
import { AdminViewSchema } from '../../types/view';
import { color } from '../../utils/color';
import { StoreTemplate, TemplateDocument } from '../../types/template';
import { StoreRoute } from '../../types/route';

export function registerAdminView(
  view: AdminViewSchema,
  { from, logger = store.systemLogger }: RegisterOptions
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
  { from, logger = store.systemLogger }: RegisterOptions
) {
  store.templates[type] = template;
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
  { from, logger = store.systemLogger }: RegisterOptions
) {
  delete store.templates[type];
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
  { from, logger = store.systemLogger }: RegisterOptions
) {
  if (!route.path) throw new Error(`path in ${name} route is undefined`);

  if (!route.path.startsWith('/')) route.path = `/${route.path}`;
  store.routes[name] = route;
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
  { from, logger = store.systemLogger }: RegisterOptions
) {
  const canDelete = delete store.routes[name];
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
