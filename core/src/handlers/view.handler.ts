import _ from 'lodash';
import store from '../../store';
import { RegisterOptions } from '../../types/register';
import { AdminViewSchema } from '../../types/view';
import { color } from '../../utils/color';

export function registerAdminView(
  view: AdminViewSchema,
  { from, logger = store.systemLogger }: RegisterOptions
) {
  store.adminViews.push(view);
  logger.log(
    color(
      'Magenta',
      `## ${from ? `${from} ` : ''}Register ${_.startCase(view.name)} View ##`
    )
  );
}
