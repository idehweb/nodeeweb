import axios from 'axios';
import store from '../store';
import { spawn } from 'child_process';
import { shutdown } from '../src/core/shutdown';

export default async function restart() {
  const policy = store.env.RESTART_POLICY;
  store.systemLogger.log(`[restart] run ${policy} restart`);

  if (policy === 'external') {
    if (!store.env.RESTART_WEBHOOK)
      throw new Error(`[restart] external restart need RESTART_WEBHOOK in env`);
    try {
      await axios.get(store.env.RESTART_WEBHOOK, {
        headers: {
          Authorization: store.env.RESTART_WEBHOOK_AUTH_TOKEN,
        },
      });
    } catch (err) {
      store.systemLogger.error('[restart] send webhook request error\n', err);
    }
  }

  if (policy === 'internal') {
    spawn(process.argv[0], process.argv.slice(1), {
      env: {
        ...process.env,
        RESTART_COUNT: +(store.env.RESTART_COUNT ?? 0) + 1 + '',
        RESTARTING: 'true',
      },
      detached: true,
      stdio: 'inherit',
    }).unref();

    shutdown(0);
  }
}
