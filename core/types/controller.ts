import { MiddleWare } from './global';
import { ValidateArgs } from './pipe';

export type ControllerAccess = {
  modelName: string;
  role: string;
};

export type ControllerSchema = {
  url: string;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  access?: ControllerAccess | ControllerAccess[];
  service: MiddleWare | MiddleWare[];
  validate?: ValidateArgs | ValidateArgs[] | null;
};
