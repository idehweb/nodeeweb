import winston from "winston";
import morgan from "morgan";
import { MiddleWare } from "../../types/global";
import { createCustomLogger } from "../core/log";

export class Logger {
  constructor(private logger: winston.Logger, private label?: string) {}

  private convert(a: any) {
    if (["number", "string", "boolean", "undefined"].includes(typeof a))
      return String(a);
    return JSON.stringify(a, null, "  ");
  }

  log(...args: any[]) {
    this.logger.info({
      message: args.map(this.convert).join(" "),
      label: this.label,
    });
  }
  warn(...args: any[]) {
    this.logger.warn({
      message: args.map(this.convert).join(" "),
      label: this.label,
    });
  }
  error(...args: any[]) {
    this.logger.error({
      message: args.map(this.convert).join(" "),
      label: this.label,
    });
  }
}
const logger = new Logger(
  createCustomLogger({ name: "core", handleExceptions: true })
);
export default logger;

export function createLogger(name: string) {
  return new Logger(createCustomLogger({ name, maxFiles: 1 }));
}

const morganStream = {
  write: (msg: string) => logger.log(msg),
};

export const expressLogger: MiddleWare = morgan(
  ":remote-addr :method :url :status :res[content-length] - :response-time ms",
  {
    stream: morganStream,
  }
);
