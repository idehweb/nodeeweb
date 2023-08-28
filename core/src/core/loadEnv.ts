import path, { join } from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { CORE_NODE_MODULE_PATH } from '../../utils/package';

if (process.env.EnvLoader !== 'Docker') loader();

function loader() {
  const appDirectory = fs.realpathSync(process.cwd());

  const resolveApp = (relativePath: string) =>
    path.resolve(appDirectory, relativePath);

  const envLocalPath = resolveApp('.env.local');
  const appEnvPaths = [resolveApp('.'), join(CORE_NODE_MODULE_PATH, '..')].map(
    (p) => join(p, '.env')
  );

  if (!fs.existsSync(envLocalPath)) {
    let isExist = false;
    for (const path of appEnvPaths) {
      if (!fs.existsSync(path)) continue;
      const env = fs.readFileSync(path, 'utf8');
      fs.writeFileSync(envLocalPath, env, 'utf8');
      isExist = true;
      break;
    }

    if (!isExist)
      throw new Error(
        `there is not any env file, candidate paths: ${[
          envLocalPath,
          ...appEnvPaths,
        ].join(' , ')}`
      );
  }

  dotenv.config({
    path: envLocalPath,
  });
}

// console.log(process.env);
