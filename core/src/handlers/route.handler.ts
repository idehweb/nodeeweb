import _ from 'lodash';
import store from '../../store';
import { RegisterOptions } from '../../types/register';
import { StoreRoute } from '../../types/route';
import { color } from '../../utils/color';

export function registerRoute(
  { route, name }: { name: string; route: StoreRoute },
  { from, logger = store.systemLogger }: RegisterOptions
) {
  store.routes[name] = route;
  logger.log(
    color(
      'Magenta',
      `## ${from ? `${from} ` : ''}Register ${_.startCase(
        _.kebabCase(name)
      )} Route ##`
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
