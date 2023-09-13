import _ from 'lodash';
import store from '../../store';
import { RegisterOptions } from '../../types/register';
import { AdminViewSchema } from '../../types/view';
import { color } from '../../utils/color';
import { StoreTemplate, TemplateDocument } from '../../types/template';

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
