import path, { join } from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { CORE_NODE_MODULE_PATH } from '../../utils/package';

if (process.env.EnvLoader !== 'Docker') loader();

function loader() {
  const appDirectory = fs.realpathSync(process.cwd());

  const resolveApp = (relativePath: string) =>
    path.resolve(appDirectory, relativePath);
  //
  const envLocalPath = resolveApp('.env.local');
  const envModulePath = resolveApp(join(CORE_NODE_MODULE_PATH ?? '.', '.env'));

  if (!fs.existsSync(envLocalPath)) {
    const env = fs.readFileSync(envModulePath, 'utf8');
    fs.writeFileSync(envLocalPath, env, 'utf8');
  }

  dotenv.config({
    path: envLocalPath,
  });
}

// console.log(process.env);
