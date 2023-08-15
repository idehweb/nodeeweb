import EventEmitter from 'events';
import store from '../../store';
import { RegisterOptions } from '../../types/register';
import { color } from '../../utils/color';

export function registerEvent(
  event: EventEmitter,
  { from, logger = store.systemLogger }: RegisterOptions = {}
) {
  store.event = event;
  logger.log(
    color('Yellow', `## ${from ? `[${from}] ` : ''}Register Event ##`)
  );
}
