import fs from 'fs';
import { isAsyncFunction } from 'util/types';
import { wait } from '../../utils/helpers';
import { getSharedPath } from '../../utils/path';
import logger from './log.handler';

export type SingleJob = () => void | Promise<void>;

export class SingleJobProcess {
  constructor(private id: string, private job: SingleJob) {}

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
      logger.error('single job free error', err);
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
