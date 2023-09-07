import fs from 'fs';
import { isAsyncFunction } from 'util/types';
import { wait } from '../../utils/helpers';
import { getSharedPath } from '../../utils/path';
import logger, { Logger } from './log.handler';
import { RegisterOptions } from '../../types/register';
import store from '../../store';
import { join } from 'path';

const lockFiles = new Set<string>();

export type SingleJob = () => void | Promise<void>;

export class SingleJobProcess {
  from?: string;
  logger: Logger;
  constructor(
    private id: string,
    private job: SingleJob,
    { from, logger = store.systemLogger }: RegisterOptions = {}
  ) {
    this.logger = logger;
    this.from = from;
  }

  static builderAsync(id: string, job: SingleJob): () => Promise<void> {
    const jp = new SingleJobProcess(id, async () => {
      if (isAsyncFunction(job)) await job();
      else job();
      await wait(1);
    });
    return jp.runTask.bind(jp);
  }

  get file_name() {
    return `single-job-${this.id}.lock`;
  }

  get file_path() {
    return getSharedPath(this.file_name);
  }

  #block() {
    try {
      fs.writeFileSync(this.file_path, '', {
        flag: 'wx',
      });
      lockFiles.add(this.file_name);
      return true;
    } catch (err) {
      return false;
    }
  }
  #free() {
    try {
      fs.rmSync(this.file_path);
      lockFiles.delete(this.file_name);
    } catch (err) {
      this.logger.error('single job free error', err);
    }
  }
  async runTask() {
    let error: any;
    // block other process with same task id
    const canBlock = this.#block();
    if (!canBlock) {
      return;
    }

    // execute tasks
    try {
      await this.job();
    } catch (err) {
      error = err;
    }

    // free others
    this.#free();

    // failed to execute job
    if (error) throw error;
  }
}

export async function waitForLockFiles(timer = 10) {
  const timerPromise = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('time come to end'));
      }, timer * 1000);
    });
  };

  const watcherPromise = () => {
    const w = fs.watch(getSharedPath('.'));
    const checkStatus = () => {
      const sharedFiles = fs
        .readdirSync(getSharedPath('.'))
        .filter((f) => lockFiles.has(f));
      if (sharedFiles.length) return false;
      return true;
    };
    return new Promise<void>((resolve, reject) => {
      if (checkStatus()) resolve();

      w.addListener('change', (et, filename) => {
        const name = String(filename);
        if (et !== 'rename' || !lockFiles.has(name)) return;
        if (!checkStatus()) return;
        return resolve();
      });
      w.addListener('close', reject);
      w.addListener('error', reject);
    });
  };

  try {
    await Promise.race([timerPromise(), watcherPromise()]);
  } catch (err) {
    store.systemLogger.error(`[single-job-handler] failed:\n`, err);
    clearAllLockFiles();
  }
}

export function clearAllLockFiles() {
  try {
    const sharedLockFile = fs
      .readdirSync(getSharedPath('.'))
      .filter((f) => lockFiles.has(f))
      .map((f) => join(getSharedPath('.'), f));

    for (const file of sharedLockFile) {
      fs.rmSync(file, { recursive: true, force: true });
    }

    store.systemLogger.log('[single-job-handler] remove shared lock files');
  } catch (err) {
    store.systemLogger.warn(
      '[single-job-handler] shared lock files removed before!'
    );
  }
}
