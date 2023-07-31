import store from '../../store';
import { Pipe } from '../../types/pipe';
import { RegisterOptions } from '../../types/register';
import { color } from '../../utils/color';
import { CoreValidationPipe } from '../core/validate';

export function registerValidationPipe({
  from,
  logger = store.systemLogger,
  validation,
}: RegisterOptions & { validation?: Pipe<unknown> } = {}) {
  store.globalMiddleware.pipes.validation =
    validation ?? new CoreValidationPipe();
  logger.log(
    color('Magenta', `##${from ? ` ${from}` : ''} Register Validation Pipe ##`)
  );
}
