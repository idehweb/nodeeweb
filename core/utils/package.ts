import fs from 'fs';
import { join } from 'path';
import info from '../package.json';
export default info;
export const APP_INFO = getRealPath('package.json');
export const NODE_MODULE_PATH = getRealPath('node_modules');
export const CORE_NODE_MODULE_PATH: string = fs.existsSync(
  join(NODE_MODULE_PATH, info.name, 'node_modules')
)
  ? join(NODE_MODULE_PATH, info.name, 'node_modules')
  : NODE_MODULE_PATH;
function getRealPath(filePath: string) {
  for (const path of require.main.paths) {
    const infoPath = join(path, '..', filePath);
    if (fs.existsSync(infoPath)) return infoPath;
  }
  return null;
}

export const CORE_NODE_MODULE_PATH_RELATIVE =
  CORE_NODE_MODULE_PATH === NODE_MODULE_PATH
    ? './node_modules'
    : `./${join('./node_modules', info.name, 'node_modules')}`;
