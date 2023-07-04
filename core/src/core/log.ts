import { join, resolve } from "path";
import winston, { format, transports } from "winston";

const logFormats = [
  format.timestamp({
    alias: "time",
    format: "MM-DD HH:mm:ss",
  }),
  format.printf(
    ({ level, message, time, label }) =>
      `[${time}] ${level === "info" ? "" : `[${level.toUpperCase()}] `}${
        label && !(label as string).includes("notShow") ? `${label}: ` : ""
      }${message}`
  ),
];

const logsPath = join(resolve(), "logs");

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
    level: "info",
    ...(handleExceptions
      ? {
          exceptionHandlers: [
            new transports.File({
              dirname: logsPath,
              filename: "exceptions.log",
              maxFiles: 1,
              maxsize: 1024 ** 2,
            }),
          ],
          rejectionHandlers: [
            new transports.File({
              dirname: logsPath,
              filename: "rejections.log",
              maxsize: 1024 ** 2,
            }),
          ],
        }
      : {}),
    format: format.combine(...logFormats),
    transports: [
      new transports.Console({
        level: "info",
        format: format.colorize({
          all: true,
          colors: { info: "white", error: "red", warn: "yellow" },
        }),
      }),
      new transports.File({
        dirname: logsPath,
        filename: `${name}.all.log`,
        level: "info",
        maxFiles,
        maxsize: 50 * 1024 ** 2,
      }),
      new transports.File({
        dirname: logsPath,
        filename: `${name}.error.log`,
        level: "error",
        maxFiles,
        maxsize: 50 * 1024 ** 2,
      }),
    ],
  });
  return Logger;
}
