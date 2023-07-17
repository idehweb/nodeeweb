import { classCatchBuilder } from '@nodeeweb/core/utils/catchAsync';
import { serviceOnError } from '../common/service';
import { MiddleWare } from '@nodeeweb/core/types/global';

export default class Service {
  static rewriteProducts: MiddleWare = () => {};
  static onError = serviceOnError('Gateway');
}
classCatchBuilder(Service);
