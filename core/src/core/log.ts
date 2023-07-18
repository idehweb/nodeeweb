import { join, resolve } from 'path';
import winston, { format, transports } from 'winston';
import store from '../../store';
import { color } from '../../utils/color';

const logFormats = [
  format.timestamp({
    alias: 'time',
    format: 'MM-DD HH:mm:ss',
  }),
  format.printf(
    ({ level, message, time, label }) =>
      `[${time}] ${level === 'info' ? '' : `[${level.toUpperCase()}] `}${
        label && !(label as string).includes('notShow')
          ? color('Yellow', `${label}: `)
          : ''
      }${message}`
  ),
];

const logsPath = join(resolve(), 'logs');

const consoleTransport = new transports.Console({
  level: 'info',
  format: format.combine(
    format.printf((info) => {
      const msg = info[Symbol.for('message')] as string;
      return msg.replace(/\[\S+ \S+\] /, '');
    }),
    format.colorize({
      all: true,
      colors: { info: 'white', error: 'red', warn: 'yellow' },
    })
  ),
});

const exceptionTransportCreator = () =>
  new transports.File({
    dirname: logsPath,
    filename: 'exceptions.log',
    maxFiles: 1,
    maxsize: 1024 ** 2,
  });

const rejectionTransportCreator = () =>
  new transports.File({
    dirname: logsPath,
    filename: 'rejections.log',
    maxsize: 1024 ** 2,
  });

const fileTransportCreator = (name: string, maxFiles: number) => [
  new transports.File({
    dirname: logsPath,
    filename: `${name}.all.log`,
    level: 'info',
    maxFiles,
    maxsize: 50 * 1024 ** 2,
  }),
  new transports.File({
    dirname: logsPath,
    filename: `${name}.error.log`,
    level: 'error',
    maxFiles,
    maxsize: 50 * 1024 ** 2,
  }),
];

export function createCustomLogger({
  name,
  maxFiles = 5,
  handleExceptions,
}: {
  name: string;
  maxFiles?: number;
  handleExceptions?: boolean;
}) {
  const Logger = winston.createLogger({
    level: 'info',
    ...(handleExceptions && store.env.logIntoFile
      ? {
          exceptionHandlers: [exceptionTransportCreator()],
          rejectionHandlers: [rejectionTransportCreator()],
        }
      : {}),
    format: format.combine(...logFormats),
    transports: [
      consoleTransport,
      ...(store.env.logIntoFile ? fileTransportCreator(name, maxFiles) : []),
    ],
  });
  return Logger;
}
