import { ChatGptPluginContent } from './type';
declare function register(arg: any): ChatGptPluginContent['stack'];
export { register as config, register as active, register as edit };
