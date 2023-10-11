import axios from 'axios';
import store from '../../store';
import logger from '../handlers/log.handler';
import { SupervisorEmitter } from '../../types/global';
import { axiosError2String } from '../../utils/helpers';

export default class Supervisor implements SupervisorEmitter {
  url: string;
  token: string;
  isInitiate: boolean;
  constructor() {
    this.url = store.config.supervisor?.url || store.env.SUPERVISOR_URL;
    this.token = store.config.supervisor?.token || store.env.SUPERVISOR_TOKEN;
    this.isInitiate = this.url && this.token && true;
  }

  async emit(event: string, body?: any) {
    if (!this.isInitiate) return false;
    try {
      await axios.post(
        this.url,
        { event, body },
        { headers: { Authorization: this.token } }
      );
      return true;
    } catch (err) {
      logger.error(
        '[Supervisor] on emit:',
        axiosError2String(err, true).message
      );
      return false;
    }
  }
}
