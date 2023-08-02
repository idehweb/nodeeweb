import { spawn } from 'child_process';
import logger from '../src/handlers/log.handler';
import { color } from './color';

export default function exec(cmd: string) {
  logger.log(color('Yellow', cmd));
  const sp = spawn(cmd, {
    shell: true,
    stdio: [process.stdin, process.stdout, process.stderr],
    windowsHide: true,
  });
  return new Promise((resolve, reject) => {
    sp.on('close', (code) => {
      if (code && code !== 0)
        return reject(new Error(`Exec Failed\ncode:${code}\ncmd:${cmd}`));
      resolve(true);
    });
  });
}
