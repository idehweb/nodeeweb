import axios from 'axios';
import store from '../store';
import { spawn } from 'child_process';
import { shutdown } from '../src/core/shutdown';
import { catchFn } from './catchAsync';
import { axiosError2String, wait } from './helpers';
import { RestartPolicy } from '../types/restart';

const externalReset = async () => {
  await axios.get(store.env.RESTART_WEBHOOK, {
    headers: {
      Authorization: store.env.RESTART_WEBHOOK_AUTH_TOKEN,
    },
  });
};

const internalReset = async () => {
  spawn(process.argv[0], process.argv.slice(1), {
    env: {
      ...process.env,
      RESTART_COUNT: +(store.env.RESTART_COUNT ?? 0) + 1 + '',
      RESTARTING: 'true',
    },
    detached: true,
    stdio: 'inherit',
  }).unref();

  await wait(1);
  shutdown(0);
};

export default async function restart({
  external_wait = true,
  internal_wait,
  wait,
  policy = store.env.RESTART_POLICY,
}: {
  internal_wait?: boolean;
  external_wait?: boolean;
  wait?: boolean;
  policy?: RestartPolicy;
} = {}) {
  store.systemLogger.log(`[restart] run ${policy} restart`);

  // merge waits
  external_wait = external_wait || wait;
  internal_wait = internal_wait || wait;

  if (policy === RestartPolicy.External) {
    if (!store.env.RESTART_WEBHOOK)
      throw new Error(`[restart] external restart need RESTART_WEBHOOK in env`);
    const catchExternal = catchFn(externalReset, {
      onError(err: Error) {
        const msg = axiosError2String(err).message;
        if (external_wait) throw new Error(`external reset error\n${msg}`);
        store.systemLogger.error('[restart] external reset error\n', msg);
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
