import { SupervisorEvent } from '../../dto/in/supervisor.dto';
import store from '../../store';
import {
  BadRequestError,
  NotFound,
  UnauthorizedError,
} from '../../types/error';
import { MiddleWare } from '../../types/global';
import { call } from '../../utils/helpers';
import { extractToken } from '../handlers/auth.handler';
import logger from '../handlers/log.handler';

class Service {
  private functions: Map<string, (...args: any) => any>;
  constructor() {
    this.functions = new Map();
  }

  addFunc(key: string, func: (...args: any) => any) {
    this.functions.set(key, func);
  }

  rmFunc(key: string) {
    this.functions.delete(key);
  }

  auth: MiddleWare = (req, res, next) => {
    const token = extractToken(req);
    const whitelist = store.config.supervisor?.whitelist ?? [];
    if (token && whitelist.length && whitelist.includes(token)) return next();
    throw new UnauthorizedError('token is not in whitelist');
  };

  onEvent: MiddleWare = async (req, res, next) => {
    const body: SupervisorEvent = req.body;
    if (body.id === store.supervisor?.id)
      throw new BadRequestError(
        'same id, it seems i received event which i emit'
      );

    const target = this.functions.get(body.func);
    if (!target)
      throw new NotFound(
        `function with name ${body.func} not found, registered functions: ${[
          ...this.functions.keys(),
        ].join(', ')}`
      );

    try {
      const data = await call(target, ...(body.args ?? []));
      return res.json({ message: 'call successfully', data });
    } catch (err) {
      logger.error(`[Supervisor] on event ${body.func}:\n`, err);
      throw err;
    }
  };
}

export default new Service();
