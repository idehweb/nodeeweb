import axios from 'axios';
import store from '../store';
import { spawn } from 'child_process';
import { shutdown } from '../src/core/shutdown';
import { catchFn } from './catchAsync';
import { axiosError2String, wait } from './helpers';
import { RestartPolicy } from '../types/restart';
import { stderr, stdin, stdout } from 'process';

const externalReset = async () => {
  await axios.get(store.env.RESTART_WEBHOOK, {
    headers: {
      Authorization: store.env.RESTART_WEBHOOK_AUTH_TOKEN,
    },
  });
};

const internalReset = async () => {
  const executer = process.execPath;
  const args = process.argv.filter((a) => a !== executer);

  spawn(executer, args, {
    env: {
      ...process.env,
      RESTART_COUNT: +(store.env.RESTART_COUNT ?? 0) + 1 + '',
      RESTARTING: 'true',
    },
    cwd: process.cwd(),
    detached: true,
    stdio: 'ignore',
  }).unref();

  await wait(1);
  shutdown(0);
};

export default async function restart({
  external_wait = true,
  internal_wait,
  policy = store.env.RESTART_POLICY,
}: {
  internal_wait?: boolean;
  external_wait?: boolean;
  policy?: RestartPolicy;
} = {}) {
  store.systemLogger.log(`[restart] run ${policy} restart`);

  if (policy === RestartPolicy.External) {
    if (!store.env.RESTART_WEBHOOK)
      throw new Error(`[restart] external restart need RESTART_WEBHOOK in env`);
    const catchExternal = catchFn(externalReset, {
      onError(err: Error) {
        if (external_wait)
          throw new Error(
            `external reset error\n${axiosError2String(err, false).message}`
          );
        store.systemLogger.error(
          '[restart] external reset error\n',
          axiosError2String(err).message
        );
      },
    });
    external_wait ? await catchExternal() : catchExternal();
  }

  if (policy === RestartPolicy.Internal) {
    const catchInternal = catchFn(internalReset, {
      onError(err: Error) {
        if (internal_wait)
          throw new Error(`internal reset error\n${err.toString()}`);
        store.systemLogger.error('[restart] internal reset error\n', err);
      },
    });
    internal_wait ? await catchInternal() : catchInternal();
  }
}
