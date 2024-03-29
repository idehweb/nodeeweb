import crypto from 'crypto';
import axios from 'axios';
import store from '../../store';
import logger from '../handlers/log.handler';
import { axiosError2String } from '../../utils/helpers';
import { color } from '../../utils/color';

export default class Supervisor {
  url: string;
  token: string;
  isInitiate: boolean;
  id: string;
  constructor() {
    this.url =
      store.config.supervisor !== null
        ? store.config.supervisor?.url || store.env.SUPERVISOR_URL
        : null;
    this.token =
      store.config.supervisor !== null
        ? store.config.supervisor?.token || store.env.SUPERVISOR_TOKEN
        : null;
    this.isInitiate = this.url && this.token && true;
    this.id = crypto.randomUUID();
  }

  async emit(event: string, ...body: any[]) {
    if (!this.isInitiate) return false;
    try {
      await axios.post(
        this.url,
        { event, body, id: this.id },
        { headers: { Authorization: this.token } }
      );
      logger.log(color('Green', `[Supervisor] successfully emit ${event}!`));
      return true;
    } catch (err) {
      logger.error(
        `[Supervisor] on emit ${event}:`,
        axiosError2String(err, true).message
      );
      return false;
    }
  }
}
