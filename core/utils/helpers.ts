import * as fs from 'fs';
import _, { at } from 'lodash';
import { Document } from 'mongoose';
import { SimpleError } from '../types/error';
import bfs from './bfs';

export function convertToString(a: any, pretty = true) {
  if (a instanceof SimpleError)
    return `{ message : ${a.message} , stack : ${a.stack} }`;

  const cache = [];

  const replacer = (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.includes(value)) return;

      cache.push(value);
    }
    return value;
  };

  if (typeof a === 'object') {
    const newA = {};
    Object.getOwnPropertyNames(a).forEach((key) => {
      newA[key] = a[key];
      // const temp = a[key];
      // delete a[key];
      // a[key] = temp;
    });
    return !pretty
      ? JSON.stringify(newA, replacer)
      : JSON.stringify(newA, replacer, '  ');
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

export function getModelName(doc: Document) {
  return doc?.['constructor']?.['modelName'];
}

export function replaceValue({
  data,
  text,
  boundary = '%',
}: {
  data: object[];
  text: string;
  boundary?: string;
}) {
  const values = (JSON.parse(JSON.stringify(data)) as object[])
    .map(
      (d) => {
        bfs(d, ({ key, value, parent }) => {
          parent[key.toString().toUpperCase()] = value;
        });
        return d;
      }
      // Object.fromEntries(
      //   Object.entries(d).map(([k, v]) => [
      //     `${boundary}${k.toUpperCase()}${boundary}`,
      //     v,
      //   ])
      // )
    )
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});

  let newMsg = text;
  const pattern = new RegExp(`(${boundary}[^${boundary} ]+${boundary})`, 'ig');
  let value = pattern.exec(text);
  while (value) {
    const upperV = value[0]?.toUpperCase();
    const [target] = at(values as any, upperV);
    if (target) newMsg = newMsg.replace(new RegExp(value[0], 'ig'), target);
    value = pattern.exec(text);
  }
  return newMsg;
}

export function slugify(str: string) {
  return _.kebabCase(str);
}
