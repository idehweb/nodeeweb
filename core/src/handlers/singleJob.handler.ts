import fs from 'fs';
import { isAsyncFunction } from 'util/types';
import { wait } from '../../utils/helpers';
import { getSharedPath } from '../../utils/path';
import { Logger } from './log.handler';
import { RegisterOptions } from '../../types/register';
import store from '../../store';
import { join } from 'path';

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
    return getSharedPath(`single-job-${this.id}.lock`);
  }

  #block() {
    try {
      fs.writeFileSync(this.file_name, '', {
        flag: 'wx',
      });
      return true;
    } catch (err) {
      return false;
    }
  }
  #free() {
    try {
      fs.rmSync(this.file_name);
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

export function clearAllLockFiles() {
  try {
    const sharedLockFile = fs
      .readdirSync(getSharedPath('.'))
      .filter((f) => f.endsWith('.lock'))
      .map((f) => join(getSharedPath('.'), f));

    for (const file of sharedLockFile) {
      fs.rmSync(file, { recursive: true, force: true });
    }

    this.logger.log('remove shared lock files');
  } catch (err) {
    this.logger.warn('shared lock files removed before!');
  }
}
