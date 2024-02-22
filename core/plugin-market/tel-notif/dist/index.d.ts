import { PluginContent } from './type';
declare function register(arg: any): PluginContent['stack'];
export { register as config, register as active, register as edit };
