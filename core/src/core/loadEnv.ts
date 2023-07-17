import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import info from '../../package.json';

if (process.env.EnvLoader !== 'Docker') loader();

function loader() {
  const appDirectory = fs.realpathSync(process.cwd());

  const resolveApp = (relativePath: string) =>
    path.resolve(appDirectory, relativePath);
  //
  const envLocalPath = resolveApp('.env.local');
  const envModulePath = resolveApp(`./node_modules/${info.name}/.env.local`);

  if (!fs.existsSync(envLocalPath)) {
    const env = fs.readFileSync(envModulePath, 'utf8');
    fs.writeFileSync(envLocalPath, env, 'utf8');
  }

  dotenv.config({
    path: envLocalPath,
  });
}
