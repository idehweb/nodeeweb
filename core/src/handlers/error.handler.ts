import store from '../../store';
import { MiddleWare, MiddleWareError } from '../../types/global';

export function errorHandlerRegister(
  errorKey: keyof typeof store.globalMiddleware.error,
  fn: MiddleWareError | MiddleWare
) {
  store.globalMiddleware.error[errorKey] = fn as any;
}
