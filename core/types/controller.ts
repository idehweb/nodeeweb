import { MiddleWare } from './global';

export type ControllerAccess = {
  modelName: string;
  role: string;
};

export type ControllerSchema = {
  url: string;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  access?: ControllerAccess | ControllerAccess[];
  service: MiddleWare | MiddleWare[];
};
