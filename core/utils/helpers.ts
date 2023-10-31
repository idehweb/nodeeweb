import * as fs from 'fs';
import _, { at, isNil } from 'lodash';
import { Document } from 'mongoose';
import store from '../store';
import { SimpleError } from '../types/error';
import bfs from './bfs';
import { StoreRoute } from '../types/route';
import { Req } from '../types/global';

export function page2Route(page: any): StoreRoute {
  return { path: page.path || page.slug };
}

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
          if (!key || typeof key !== 'string') return;
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
    const upperFilterV = value[0]
      ?.toUpperCase()
      .slice(boundary.length, -boundary.length);
    const [target] = at(values as any, upperFilterV);
    if (!isNil(target))
      newMsg = newMsg.replace(new RegExp(value[0], 'ig'), target);
    value = pattern.exec(text);
  }
  return newMsg;
}

export function slugify(str: string) {
  return _.kebabCase(str);
}

export function getEnv(
  key: string,
  { format }: { format: 'array' | 'string' | 'auto' } = { format: 'auto' }
) {
  const value = store.env[key.toUpperCase().replace(/-/g, '_')];
  if (typeof value !== 'string') return value;
  const newValue = value
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v);

  switch (format) {
    case 'auto':
      if (newValue.length <= 1) return value;
      else return newValue;
    case 'array':
      return newValue;
    case 'string':
      return value;
  }
}

export function toMs(time: string) {
  const milliseconds = time.match(/\d+\s?\w/g).reduce((acc, cur, i) => {
    let multiplier = 1000;
    switch (cur.slice(-1)) {
      case 'd':
        multiplier *= 24;
      case 'h':
        multiplier *= 60;
      case 'm':
        multiplier *= 60;
      case 's':
        return (parseInt(cur) ? parseInt(cur) : 0) * multiplier + acc;
    }
    return acc;
  }, 0);
  return milliseconds;
}
export function fromMs(duration: number) {
  const portions: string[] = [];

  const msInHour = 1000 * 60 * 60;
  const hours = Math.trunc(duration / msInHour);
  if (hours > 0) {
    portions.push(hours + 'h');
    duration = duration - hours * msInHour;
  }

  const msInMinute = 1000 * 60;
  const minutes = Math.trunc(duration / msInMinute);
  if (minutes > 0) {
    portions.push(minutes + 'm');
    duration = duration - minutes * msInMinute;
  }

  const seconds = Math.trunc(duration / 1000);
  if (seconds > 0) {
    portions.push(seconds + 's');
    duration = duration - seconds * 1000;
  }

  if (duration > 0) {
    portions.push(duration + 'ms');
  }

  return portions.join(' ');
}

export function combineUrl({
  host,
  url,
  protocol,
}: {
  host: string;
  url: string;
  protocol?: string;
}) {
  const protocolRegex = /^(https?:\/\/)?(.+)$/;
  const pathRegex = /\/+/g;
  const [, proto, path] = protocolRegex.exec(`${host}/${url}`);
  return `${protocol || proto.replace('://', '')}://${path.replace(
    pathRegex,
    '/'
  )}`;
}

export function rawPath(req: Req) {
  return `${req.protocol}://${req.get('host')}${req.path}`;
}

export function normalizeColName(col: string) {
  // replace all "-" , " " with upper letter
  let result = '',
    act = 'none';
  for (const char of col) {
    if (char !== ' ' && char !== '-') {
      switch (act) {
        case 'upper':
          result += char.toUpperCase();
          break;
        case 'none':
        default:
          result += char;
          break;
      }
      act = 'none';
    } else {
      act = 'upper';
    }
  }
  return result;
}

export function getAllPropertyNames(obj: object = {}, maxDepth = 5) {
  const names: string[] = [];
  const recorded = new Map();
  names.push(...Object.getOwnPropertyNames(obj));
  let depth = 0,
    target = obj;
  while (target['__proto__']) {
    if (recorded.has(target['__proto__']) || ++depth > maxDepth) break;
    names.push(...Object.getOwnPropertyNames(target['__proto__']));
    recorded.set(target['__proto__'], true);
    target = target['__proto__'];
  }
  return [...new Set(names)];
}
