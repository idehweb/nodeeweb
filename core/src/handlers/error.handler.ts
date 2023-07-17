import store from '../../store';
import { MiddleWare, MiddleWareError } from '../../types/global';

export function errorHandlerRegister(
  errorKey: keyof typeof store.errorPackage,
  fn: MiddleWareError | MiddleWare
) {
  store.errorPackage[errorKey] = fn as any;
}
