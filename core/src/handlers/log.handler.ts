import { MiddleWare } from "../../types/global";

export function debug(...args: any) {
  console.log(...args);
}

export function log(...args: any) {
  console.log(...args);
}

export const expressLogger: MiddleWare = () => {};
