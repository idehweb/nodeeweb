import winston from 'winston';
import morgan from 'morgan';
import { MiddleWare, USE_ENV } from '../../types/global';
import { createCustomLogger } from '../core/log';
import store from '../../store';
import { Colors, color, yellow } from '../../utils/color';
import { convertToString } from '../../utils/helpers';

export class Logger {
  constructor(private logger: winston.Logger, private label?: string) {}

  private convert(a: any) {
    return convertToString(a);
  }

  log(...args: any[]) {
    this.logger.info({
      message: args.map(this.convert).join(' '),
      label: this.label,
    });
  }
  warn(...args: any[]) {
    this.logger.warn({
      message: args.map(this.convert).join(' '),
      label: this.label,
    });
  }
  error(...args: any[]) {
    this.logger.error({
      message: args.map(this.convert).join(' '),
      label: this.label,
    });
  }
}
const logger = new Logger(
  createCustomLogger({ name: 'core', handleExceptions: true }),
  store.env.USE_ENV !== USE_ENV.NPM ? undefined : 'CORE'
);
export default logger;

export function createLogger(name: string, label?: string, maxFiles = 1) {
  return new Logger(createCustomLogger({ name, maxFiles }), label);
}

const morganLogger = createLogger(
  'core.server',
  store.env.USE_ENV !== USE_ENV.NPM ? undefined : 'CORE_SERVER',
  5
);
const morganStream = {
  write: (msg: string) => {
    const {
      agent,
      content_length,
      ip,
      method,
      response_time,
      status,
      url,
      forwardHeader,
    }: MorganDetailType = JSON.parse(msg);

    const client_ip = forwardHeader ? forwardHeader.split(',')[0].trim() : ip;

    let final_msg = '';

    // ip , agent
    if (!store.env.isLoc) {
      final_msg += `${client_ip} ${agent} `;
    }

    // method
    let method_color: keyof typeof Colors;
    switch (method.toUpperCase()) {
      case 'GET':
        method_color = 'Green';
        break;
      case 'POST':
        method_color = 'Yellow';
        break;
      case 'PUT':
      case 'PATCH':
        method_color = 'Blue';
        break;
      case 'DELETE':
        method_color = 'Red';
        break;
      default:
        method_color = 'White';
    }
    final_msg += color(method_color, method.toUpperCase()) + ' ';

    // url
    final_msg += url + ' ';

    // code
    let status_color: keyof typeof Colors;
    switch (Math.floor(status / 100)) {
      case 1:
        status_color = 'Cyan';
        break;
      case 2:
        status_color = 'Green';
        break;
      case 3:
        status_color = 'Blue';
        break;
      case 4:
        status_color = 'Red';
        break;
      case 5:
      default:
        status_color = 'Magenta';
        break;
    }
    final_msg +=
      ' ' + color(status_color, status ? String(status) : 'disconnect');

    // time
    if (response_time)
      final_msg += ' - ' + Number(response_time).toFixed(2) + 'ms';

    // content length
    if (content_length) final_msg += ' - ' + content_length;

    return morganLogger.log(final_msg);
  },
};

type MorganDetailType = {
  method: string;
  url: string;
  status: number;
  content_length: string;
  response_time: number;
  ip: string;
  agent: string;
  forwardHeader: string;
};

export const expressLogger: MiddleWare = morgan(
  // `${
  //   store.env.isLoc ? "" : ":remote-addr "
  // }:method :url :status :res[content-length] - :response-time ms`,
  (tokens, req, res) => {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number.parseInt(tokens.status(req, res)),
      content_length: tokens.res(req, res, 'Content-Length'),
      response_time: Number.parseFloat(tokens['response-time'](req, res)),
      ip: tokens['remote-addr'](req, res),
      agent: tokens['user-agent'](req, res),
      forwardHeader: req.headers['x-forwarded-for'],
    } as MorganDetailType);
  },
  {
    stream: morganStream,
  }
);
