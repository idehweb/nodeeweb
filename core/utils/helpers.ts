import { join } from 'path';
import * as fs from 'fs';
import _ from 'lodash';

export function convertToString(a: any, pretty = true) {
  if (typeof a === 'object') {
    Object.getOwnPropertyNames(a).forEach((key) => {
      const temp = a[key];
      delete a[key];
      a[key] = temp;
    });
    return !pretty ? JSON.stringify(a) : JSON.stringify(a, null, '  ');
  }
  return a?.toString() ?? String(a);
  // const msgs: string[] = [];
  // bfs(a, ({ value, key }) => {
  //   if (value === undefined) return;
  //   msgs.push(key && key !== 'message' ? `${key} : ${value}` : value);
  // });
  // return msgs.join('\n');
}

export function wait(sec: number) {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000));
}

export function axiosError2String(error: any, pretty = true) {
  if (!error.isAxiosError) {
    return { error, parsed: false, message: convertToString(error, pretty) };
  }
  const body = {
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
  };
  return {
    body,
    message: pretty ? JSON.stringify(body, null, '  ') : JSON.stringify(body),
    parsed: true,
    error,
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
