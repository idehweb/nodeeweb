import fs from 'fs';
import { isAsyncFunction } from 'util/types';
import { wait } from '../../utils/helpers';
import { getSharedPath } from '../../utils/path';
import { Logger } from './log.handler';
import { RegisterOptions } from '../../types/register';
import store from '../../store';

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
    fs.rmSync(getSharedPath('.'), { recursive: true, force: true });
    this.logger.log('remove shared dir');
  } catch (err) {
    this.logger.warn('shared dir removed before!');
  }
}
