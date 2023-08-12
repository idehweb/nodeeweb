import { join } from 'path';
import * as fs from 'fs';
import _ from 'lodash';

export function wait(sec: number) {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000));
}

export function axiosError2String(error: any) {
  if (!error.isAxiosError) {
    return { error, parsed: false };
  }
  return {
    message: JSON.stringify(
      {
        name: error.name,
        code: error.code,
        message: error.message,
        url: error?.request?._url || error?.config?.url,
        method: error.config?.method,
        res_data: error?.response?.data,
        req_data: error.config.data || error?.request?.data,
        res_headers: error?.response?.headers,
        req_headers: error?.config.headers,
        stack: error.stack,
      },
      null,
      '  '
    ),
    parsed: true,
  };
}

export async function isExist(path: string) {
  try {
    await fs.promises.access(path);
    return true;
  } catch (err) {
    return false;
  }
}

export function isExistsSync(path: string) {
  return fs.existsSync(path);
}

export function isAsync(fn: Function) {
  return fn['constructor'].name === 'AsyncFunction';
}

export async function call<A extends Array<any>, R>(
  fn: (...args: A) => R | Promise<R>,
  ...args: A
) {
  let result = fn(...args);
  while (result instanceof Promise) {
    result = await result;
  }
  return result as R;
}

export function getName(f: any, capitalize = true) {
  const name: string =
    (typeof f === 'string'
      ? f
      : f?.shadowName || f?.name || f?.constructor?.name) ?? '';
  return name
    .split(' ')
    .map((word, i) => (i == 0 && capitalize ? _.capitalize(word) : word))
    .join(' ');
}
