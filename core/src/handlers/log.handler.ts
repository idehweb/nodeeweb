import winston from "winston";
import morgan from "morgan";
import { MiddleWare } from "../../types/global";
import { createCustomLogger } from "../core/log";
import store from "../../store";
import { Colors, color } from "../../utils/color";

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

export function createLogger(name: string, maxFiles = 1) {
  return new Logger(createCustomLogger({ name, maxFiles }));
}

const morganLogger = createLogger("core.server", 5);
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
    }: MorganDetailType = JSON.parse(msg);

    let final_msg = "";

    // ip , agent
    if (!store.env.isLoc) {
      final_msg += `${ip} ${agent}`;
    }

    // method
    let method_color: keyof typeof Colors;
    if (store.env.isLoc) {
      switch (method.toUpperCase()) {
        case "GET":
          method_color = "Green";
          break;
        case "POST":
          method_color = "Yellow";
          break;
        case "PUT":
        case "PATCH":
          method_color = "Blue";
          break;
        case "DELETE":
          method_color = "Red";
          break;
        default:
          method_color = "White";
      }
    } else {
      method_color = "White";
    }
    final_msg += " " + color(method_color, method.toUpperCase());

    // url
    final_msg += " " + url;

    // code
    let status_color: keyof typeof Colors;
    if (store.env.isLoc) {
      switch (Math.floor(status / 100)) {
        case 1:
          status_color = "Cyan";
          break;
        case 2:
          status_color = "Green";
          break;
        case 3:
          status_color = "Blue";
          break;
        case 4:
          status_color = "Red";
          break;
        case 5:
        default:
          status_color = "Magenta";
          break;
      }
    } else {
      status_color = "White";
    }
    final_msg += " " + color(status_color, String(status));

    // time
    final_msg += " - " + response_time + "ms";

    // content length
    if (content_length) final_msg += " - " + content_length;

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
      content_length: tokens.res(req, res, "Content-Length"),
      response_time: Number.parseFloat(tokens["response-time"](req, res)),
      ip: tokens["remote-addr"](req, res),
      agent: tokens["user-agent"](req, res),
    } as MorganDetailType);
  },
  {
    stream: morganStream,
  }
);
