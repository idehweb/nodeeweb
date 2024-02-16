import EventEmitter from 'events';
import store from '../../store';
import { RegisterOptions } from '../../types/register';
import { color } from '../../utils/color';
import { CoreEventEmitter } from '../event/CoreEventEmitter.abstract';

export function registerEvent(
  event: CoreEventEmitter,
  { from, logger = store.systemLogger }: RegisterOptions = {}
) {
  store.event = event;
  logger.log(
    color('Yellow', `## ${from ? `[${from}] ` : ''}Register Event ##`)
  );
}
